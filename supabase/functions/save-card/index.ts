import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !accessToken) {
    return jsonResponse({ error: 'Environment not configured' }, 500);
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser();
  if (userError || !userData.user) return jsonResponse({ error: 'Authentication required' }, 401);

  const body = await req.json().catch(() => null);
  if (!body?.token) return jsonResponse({ error: 'Card token required' }, 400);

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const userId = userData.user.id;
  const userEmail = userData.user.email;
  if (!userEmail) return jsonResponse({ error: 'User email required' }, 400);

  // Get or create MP Customer
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('mp_customer_id')
    .eq('id', userId)
    .single();

  let customerId = profile?.mp_customer_id;

  if (!customerId) {
    const searchRes = await fetch(
      `https://api.mercadopago.com/v1/customers/search?email=${encodeURIComponent(userEmail)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const searchData = await searchRes.json();
    customerId = searchData?.results?.[0]?.id;

    if (!customerId) {
      const createRes = await fetch('https://api.mercadopago.com/v1/customers', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const createData = await createRes.json();
      if (!createData.id) return jsonResponse({ error: 'Failed to create MP customer', details: createData }, 502);
      customerId = createData.id;
    }

    await serviceClient.from('profiles').update({ mp_customer_id: customerId }).eq('id', userId);
  }

  // Save card token to MP Customer
  const cardRes = await fetch(`https://api.mercadopago.com/v1/customers/${customerId}/cards`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: body.token }),
  });
  const cardData = await cardRes.json();
  if (!cardRes.ok || !cardData.id) return jsonResponse({ error: 'Failed to save card to MP', details: cardData }, 502);

  // Avoid duplicates
  const { data: existing } = await serviceClient
    .from('saved_cards')
    .select('id')
    .eq('user_id', userId)
    .eq('mp_card_id', cardData.id)
    .maybeSingle();

  if (existing) {
    return jsonResponse({
      id: existing.id,
      mp_card_id: cardData.id,
      payment_method_id: cardData.payment_method_id,
      last_four_digits: cardData.last_four_digits,
      expiration_month: cardData.expiration_month,
      expiration_year: cardData.expiration_year,
      card_holder: cardData.cardholder?.name || '',
    });
  }

  const { data: savedCard, error: saveError } = await serviceClient
    .from('saved_cards')
    .insert({
      user_id: userId,
      mp_card_id: cardData.id,
      brand: cardData.payment_method_id || 'unknown',
      holder_name: cardData.cardholder?.name || '',
      last_four: cardData.last_four_digits || '0000',
      exp_month: cardData.expiration_month,
      exp_year: cardData.expiration_year,
    })
    .select('id')
    .single();

  if (saveError) return jsonResponse({ error: 'Failed to store card metadata', details: saveError }, 500);

  return jsonResponse({
    id: savedCard.id,
    mp_card_id: cardData.id,
    payment_method_id: cardData.payment_method_id,
    last_four_digits: cardData.last_four_digits,
    expiration_month: cardData.expiration_month,
    expiration_year: cardData.expiration_year,
    card_holder: cardData.cardholder?.name || '',
  });
});
