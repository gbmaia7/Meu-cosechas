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

// Legacy Payments API statuses
const mapPaymentsApiStatus = (status: string) => {
  if (status === 'approved') return { orderStatus: 'new', paymentStatus: 'paid' };
  if (['rejected', 'cancelled'].includes(status)) return { orderStatus: 'payment_failed', paymentStatus: 'failed' };
  if (status === 'refunded') return { orderStatus: 'cancelled', paymentStatus: 'refunded' };
  return { orderStatus: 'pending_payment', paymentStatus: 'pending' };
};

// Orders API statuses
const mapOrdersApiStatus = (status: string) => {
  if (status === 'processed') return { orderStatus: 'new', paymentStatus: 'paid' };
  if (status === 'failed') return { orderStatus: 'payment_failed', paymentStatus: 'failed' };
  // action_required = 3DS pending, pending = Pix/general pending
  return { orderStatus: 'pending_payment', paymentStatus: 'pending' };
};

const getSafeOrderStatus = (currentStatus: string | null | undefined, nextStatus: string) => {
  const paymentStatuses = ['pending', 'pending_payment', 'payment_failed', 'expired'];
  if (paymentStatuses.includes(currentStatus || '')) return nextStatus;
  return currentStatus || nextStatus;
};

const isOrdersApiId = (id: string) => !/^\d+$/.test(id);

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
    .select('id, order_id, provider_payment_id, provider_status, payment_method, qr_code, qr_code_base64, ticket_url, raw_response')
    .eq('order_id', orderId)
    .eq('provider', 'mercado_pago')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !payment?.provider_payment_id) return jsonResponse({ error: 'Payment not found' }, 404);

  const providerPaymentId = payment.provider_payment_id;
  const useOrdersApi = isOrdersApiId(providerPaymentId);

  const mpUrl = useOrdersApi
    ? `https://api.mercadopago.com/v1/orders/${providerPaymentId}`
    : `https://api.mercadopago.com/v1/payments/${providerPaymentId}`;

  const mpResponse = await fetch(mpUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const mpRaw = await mpResponse.json().catch(() => null);

  // Orders API wraps rejected payments in { errors, data } with HTTP 402 — unwrap
  const isOrdersApiRejection = useOrdersApi && mpResponse.status === 402 && mpRaw?.data;
  if (!mpResponse.ok && !isOrdersApiRejection) {
    return jsonResponse({ error: 'Unable to fetch Mercado Pago payment', details: mpRaw }, 502);
  }

  const mpData = isOrdersApiRejection ? mpRaw.data : mpRaw;

  let providerStatus: string;
  let statusDetail: string | null;
  let mapped: { orderStatus: string; paymentStatus: string };

  if (useOrdersApi) {
    providerStatus = String(mpData?.status || '');
    const txPayment = mpData?.transactions?.payments?.[0];
    statusDetail = String(txPayment?.status_detail || mpData?.status_detail || '') || null;
    mapped = mapOrdersApiStatus(providerStatus);
  } else {
    providerStatus = String(mpData?.status || '');
    statusDetail = mpData?.status_detail || null;
    mapped = mapPaymentsApiStatus(providerStatus);
  }

  const { data: order } = await serviceClient
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();
  const safeOrderStatus = getSafeOrderStatus(order?.status, mapped.orderStatus);

  await serviceClient
    .from('order_payments')
    .update({
      provider_status: providerStatus,
      raw_response: {
        ...mpData,
        _app_diagnostics: payment.raw_response?._app_diagnostics,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  await serviceClient
    .from('orders')
    .update({ status: safeOrderStatus, payment_status: mapped.paymentStatus })
    .eq('id', orderId);

  return jsonResponse({
    order_id: orderId,
    provider_payment_id: providerPaymentId,
    provider_status: providerStatus,
    status_detail: statusDetail,
    payment_status: mapped.paymentStatus,
    order_status: safeOrderStatus,
    payment_method: payment.payment_method,
    qr_code: payment.qr_code,
    qr_code_base64: payment.qr_code_base64,
    ticket_url: payment.ticket_url,
  });
});
