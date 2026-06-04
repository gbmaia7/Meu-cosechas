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
  if (!body?.saved_card_id) return jsonResponse({ error: 'saved_card_id required' }, 400);

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const userId = userData.user.id;

  const { data: card, error: cardError } = await serviceClient
    .from('saved_cards')
    .select('id, mp_card_id')
    .eq('id', body.saved_card_id)
    .eq('user_id', userId)
    .single();

  if (cardError || !card) return jsonResponse({ error: 'Card not found' }, 404);

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('mp_customer_id')
    .eq('id', userId)
    .single();

  if (profile?.mp_customer_id) {
    await fetch(
      `https://api.mercadopago.com/v1/customers/${profile.mp_customer_id}/cards/${card.mp_card_id}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }

  await serviceClient.from('saved_cards').delete().eq('id', card.id);

  return jsonResponse({ success: true });
});
