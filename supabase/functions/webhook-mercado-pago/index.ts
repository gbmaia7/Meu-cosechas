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
  const signatureValid = await validateSignature(
    webhookSecret,
    req.headers.get('x-signature'),
    req.headers.get('x-request-id'),
    providerPaymentId,
  );

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

  if (!signatureValid) return jsonResponse({ error: 'Invalid webhook signature' }, 401);
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
    .select('status')
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

  return jsonResponse({ success: true, order_id: orderId, provider_status: mpData.status });
});
