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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
  if (!supabaseUrl || !serviceRoleKey || !accessToken) {
    return jsonResponse({ error: 'Mercado Pago environment is not configured' }, 500);
  }

  const payload = await req.json().catch(() => null);
  const orderId = String(payload?.order_id || '').trim();
  if (!orderId) return jsonResponse({ error: 'Missing order_id' }, 400);

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: payment, error } = await serviceClient
    .from('order_payments')
    .select('id, order_id, provider_payment_id, provider_status, payment_method, qr_code, qr_code_base64, ticket_url')
    .eq('order_id', orderId)
    .eq('provider', 'mercado_pago')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !payment?.provider_payment_id) return jsonResponse({ error: 'Payment not found' }, 404);

  const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment.provider_payment_id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const mpData = await mpResponse.json().catch(() => null);
  if (!mpResponse.ok) return jsonResponse({ error: 'Unable to fetch Mercado Pago payment', details: mpData }, 502);

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
    .eq('id', payment.id);

  await serviceClient
    .from('orders')
    .update({ status: safeStatus, payment_status: mapped.payment_status })
    .eq('id', orderId);

  return jsonResponse({
    order_id: orderId,
    provider_payment_id: payment.provider_payment_id,
    provider_status: mpData.status,
    payment_status: mapped.payment_status,
    order_status: safeStatus,
    payment_method: payment.payment_method,
    qr_code: payment.qr_code,
    qr_code_base64: payment.qr_code_base64,
    ticket_url: payment.ticket_url,
  });
});
