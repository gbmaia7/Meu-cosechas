import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const mapOrderStatus = (providerStatus: string) => {
  if (providerStatus === 'approved') return { status: 'new', payment_status: 'paid' };
  if (['rejected', 'cancelled'].includes(providerStatus)) return { status: 'payment_failed', payment_status: 'failed' };
  if (providerStatus === 'refunded') return { status: 'cancelled', payment_status: 'refunded' };
  return { status: 'pending_payment', payment_status: 'pending' };
};

const getSafeOrderStatus = (currentStatus: string | null | undefined, nextStatus: string) => {
  const paymentStatuses = ['pending', 'pending_payment', 'payment_failed', 'expired'];
  if (paymentStatuses.includes(currentStatus || '')) return nextStatus;
  return currentStatus || nextStatus;
};

const getSignatureParts = (signature: string) =>
  signature.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

const validateSignature = async (secret: string, signature: string | null, requestId: string | null, dataId: string | null) => {
  if (!secret) return false;
  if (!signature || !requestId || !dataId) return false;

  const parts = getSignatureParts(signature);
  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${parts.ts};`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
  const expected = Array.from(new Uint8Array(signatureBuffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');

  return expected === parts.v1;
};

const creditPointsForOnlinePayment = async (
  client: ReturnType<typeof createClient>,
  orderId: string,
  userId: string,
) => {
  const { count } = await client
    .from('loyalty_points_ledger')
    .select('*', { count: 'exact', head: true })
    .eq('order_id', orderId);
  if ((count || 0) > 0) return;

  const { data: items } = await client
    .from('order_items')
    .select('product_name, points_cost')
    .eq('order_id', orderId);
  const paidItems = (items || []).filter((i: { points_cost: number | null }) => !((i.points_cost || 0) > 0));
  if (paidItems.length === 0) return;

  const productNames = paidItems.map((i: { product_name: string }) => i.product_name).join(', ');

  const { data: sub } = await client
    .from('subscriptions')
    .select('double_points')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  const bonusPoints = sub?.double_points ? 1 : 0;

  await client.from('loyalty_points_ledger').insert({
    user_id: userId, order_id: orderId, points: 1, reason: 'purchase', description: productNames,
  });
  if (bonusPoints > 0) {
    await client.from('loyalty_points_ledger').insert({
      user_id: userId, order_id: orderId, points: 1, reason: 'double_points', description: productNames,
    });
  }

  const { data: profile } = await client
    .from('profiles')
    .select('points, total_orders')
    .eq('id', userId)
    .single();
  await client.from('profiles').update({
    points: (profile?.points || 0) + 1 + bonusPoints,
    total_orders: (profile?.total_orders || 0) + 1,
    last_purchase_at: new Date().toISOString(),
  }).eq('id', userId);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
  const webhookSecret = Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET');
  if (!supabaseUrl || !serviceRoleKey || !accessToken || !webhookSecret) {
    return jsonResponse({ error: 'Mercado Pago environment is not configured' }, 500);
  }

  const url = new URL(req.url);
  const payload = await req.json().catch(() => null);
  if (!payload) return jsonResponse({ error: 'Invalid JSON body' }, 400);

  const providerPaymentId = String(url.searchParams.get('data.id') || payload?.data?.id || payload?.id || '').trim();
  const xSignature = req.headers.get('x-signature');
  // Old-format notifications (?id=&topic=) do not carry x-signature.
  // Only reject when the header is present but the HMAC does not match.
  const signatureValid = xSignature
    ? await validateSignature(webhookSecret, xSignature, req.headers.get('x-request-id'), providerPaymentId)
    : false;

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  await serviceClient.from('payment_webhook_events').insert({
    provider: 'mercado_pago',
    provider_event_id: payload?.id ? String(payload.id) : null,
    provider_payment_id: providerPaymentId || null,
    event_type: payload?.type || null,
    action: payload?.action || null,
    signature_valid: signatureValid,
    payload,
  });

  if (xSignature && !signatureValid) return jsonResponse({ error: 'Invalid webhook signature' }, 401);
  if (!providerPaymentId) return jsonResponse({ error: 'Missing payment id' }, 400);

  const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${providerPaymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const mpData = await mpResponse.json().catch(() => null);
  if (!mpResponse.ok) return jsonResponse({ error: 'Unable to fetch Mercado Pago payment', details: mpData }, 502);

  const orderId = String(mpData.external_reference || '').trim();
  if (!orderId) return jsonResponse({ error: 'Payment has no external_reference' }, 400);

  const mapped = mapOrderStatus(mpData.status);
  const { data: order } = await serviceClient
    .from('orders')
    .select('id, status, user_id, referral_credit_id')
    .eq('id', orderId)
    .single();
  const safeStatus = getSafeOrderStatus(order?.status, mapped.status);

  await serviceClient
    .from('order_payments')
    .update({
      provider_status: mpData.status,
      raw_response: mpData,
      updated_at: new Date().toISOString(),
    })
    .eq('provider', 'mercado_pago')
    .eq('provider_payment_id', providerPaymentId);

  await serviceClient
    .from('orders')
    .update({ status: safeStatus, payment_status: mapped.payment_status })
    .eq('id', orderId);

  await serviceClient
    .from('payment_webhook_events')
    .update({ processed_at: new Date().toISOString() })
    .eq('provider', 'mercado_pago')
    .eq('provider_payment_id', providerPaymentId)
    .is('processed_at', null);

  if (mapped.status === 'new' && order?.user_id) {
    await creditPointsForOnlinePayment(serviceClient, orderId, order.user_id);
  }

  if (mapped.status === 'new' && (order as any)?.referral_credit_id) {
    await serviceClient
      .from('referrals')
      .update({ credit_redeemed_at: new Date().toISOString() })
      .eq('id', (order as any).referral_credit_id)
      .is('credit_redeemed_at', null);
  }

  return jsonResponse({ success: true, order_id: orderId, provider_status: mpData.status });
});
