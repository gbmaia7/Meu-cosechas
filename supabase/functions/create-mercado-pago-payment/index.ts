import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PaymentMethod = 'pix' | 'credit_card' | 'debit_card';

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  base?: string;
  notes?: string;
  pointsCost?: number;
  deliveryEligibilityPrice?: number;
  extras?: Array<{ id: string; name: string; price: number }>;
};

type PaymentRequest = {
  items: CheckoutItem[];
  paymentMethod: PaymentMethod;
  modality: 'counter' | 'delivery';
  address?: { block: string; room: string; complement?: string };
  deliveryFee?: number;
  couponDiscount?: number;
  token?: string;
  payment_method_id?: string;
  issuer_id?: string;
  installments?: number;
  mp_card_id?: string;
  payer?: {
    email?: string;
    identification?: { type?: string; number?: string };
  };
  device_session_id?: string;
  referrerId?: string;
  referralCreditId?: string;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const cleanName = (name: string) => String(name || 'Item Cosechas').replace(/^\[.*?\]\s*/, '').slice(0, 120);
const roundMoney = (value: number) => Math.max(0, Math.round(value * 100) / 100);
const FREE_DELIVERY_MINIMUM = 20;
const DELIVERY_FEE_BELOW_MINIMUM = 4;
const calculateDeliveryFee = (deliverySubtotal: number, modality: 'counter' | 'delivery') =>
  modality === 'counter' || deliverySubtotal >= FREE_DELIVERY_MINIMUM ? 0 : DELIVERY_FEE_BELOW_MINIMUM;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !accessToken) {
    return jsonResponse({ error: 'Mercado Pago environment is not configured' }, 500);
  }

  let payload: PaymentRequest;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) return jsonResponse({ error: 'Cart is empty' }, 400);
  if (!['pix', 'credit_card', 'debit_card'].includes(payload.paymentMethod)) {
    return jsonResponse({ error: 'Invalid payment method' }, 400);
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser();
  if (userError || !userData.user) return jsonResponse({ error: 'Authentication required' }, 401);

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const userId = userData.user.id;

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('name, phone, email, mp_customer_id, created_at')
    .eq('id', userId)
    .single();

  let addressId: string | null = null;
  if (payload.modality === 'delivery') {
    if (!payload.address?.block || !payload.address?.room) {
      return jsonResponse({ error: 'Delivery address is required' }, 400);
    }

    const { data: savedAddress, error: addressError } = await serviceClient
      .from('addresses')
      .insert({
        user_id: userId,
        label: 'Entrega do pedido',
        block: payload.address.block,
        room: payload.address.room,
        complement: payload.address.complement || null,
        is_default: false,
      })
      .select('id')
      .single();

    if (addressError) return jsonResponse({ error: 'Unable to save address', details: addressError }, 500);
    addressId = savedAddress.id;
  }

  let pickupCode: string | null = null;
  let deliveryPin: string | null = null;
  if (payload.modality === 'counter') {
    const today = new Date();
    today.setHours(7, 0, 0, 0);
    const { count } = await serviceClient
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('modality', 'counter')
      .gte('created_at', today.toISOString());
    pickupCode = `C-${String((count || 0) + 1).padStart(3, '0')}`;
  } else {
    deliveryPin = String(Math.floor(1000 + Math.random() * 9000));
  }

  const subtotal = roundMoney(items.reduce((sum, item) => sum + Number(item.price || 0) * Math.max(1, Number(item.quantity || 1)), 0));
  const deliverySubtotal = roundMoney(items.reduce((sum, item) => {
    const quantity = Math.max(1, Number(item.quantity || 1));
    const isClubReward = item.pointsCost && String(item.name || '').startsWith('[CLUBE]');
    const eligibilityPrice = isClubReward
      ? item.deliveryEligibilityPrice ?? Number(item.price || 0)
      : Number(item.price || 0);
    return sum + Number(eligibilityPrice || 0) * quantity;
  }, 0));
  const deliveryFee = calculateDeliveryFee(deliverySubtotal, payload.modality);
  const couponDiscount = roundMoney(Number(payload.couponDiscount) || 0);
  const total = roundMoney(subtotal + deliveryFee - couponDiscount);
  if (total <= 0) return jsonResponse({ error: 'Invalid checkout total' }, 400);

  const { data: savedOrder, error: orderError } = await serviceClient
    .from('orders')
    .insert({
      user_id: userId,
      guest_name: profile?.name || null,
      guest_phone: profile?.phone || null,
      subtotal,
      total_price: total,
      status: 'pending_payment',
      payment_method: payload.paymentMethod,
      payment_status: 'pending',
      modality: payload.modality,
      address_id: addressId,
      pickup_code: pickupCode,
      delivery_pin: deliveryPin,
      referral_credit_id: payload.referralCreditId || null,
    })
    .select('id, pickup_code')
    .single();

  if (orderError) return jsonResponse({ error: 'Unable to create order', details: orderError }, 500);

  const orderItems = items.map((item) => ({
    order_id: savedOrder.id,
    product_id: item.productId,
    product_name: cleanName(item.name),
    unit_price: Number(item.price) || 0,
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    size_label: item.size || null,
    base: item.base || null,
    notes: item.notes || null,
    points_cost: item.pointsCost || 0,
    is_reward: (item.pointsCost || 0) > 0,
  }));

  const { data: savedItems, error: itemError } = await serviceClient
    .from('order_items')
    .insert(orderItems)
    .select('id');

  if (itemError) return jsonResponse({ error: 'Unable to create order items', details: itemError }, 500);

  const extras = items.flatMap((item, index) =>
    (item.extras || []).map((extra) => ({
      order_item_id: savedItems?.[index]?.id,
      extra_id: extra.id,
      extra_name: extra.name,
      extra_price: extra.price,
    }))
  ).filter((extra) => extra.order_item_id);

  if (extras.length > 0) {
    const { error: extrasError } = await serviceClient.from('order_item_extras').insert(extras);
    if (extrasError) return jsonResponse({ error: 'Unable to create order extras', details: extrasError }, 500);
  }

  if (!payload.payer?.email && !profile?.email && !userData.user.email) {
    return jsonResponse({ error: 'Payer email is required' }, 400);
  }

  const payerAliasEmail = `cliente${userId.replace(/-/g, '').slice(0, 12)}@meucosechas.app`;
  const customerEmail = payload.payer?.email || profile?.email || userData.user.email || payerAliasEmail;
  const payerEmail = payload.paymentMethod === 'pix' ? payerAliasEmail : customerEmail;

  const nameParts = (profile?.name || '').trim().split(/\s+/);
  const payerFirstName = nameParts[0] || '';
  const payerLastName = nameParts.slice(1).join(' ') || payerFirstName;

  // Resolve card payment method
  let mpPaymentMethod: string | undefined =
    payload.paymentMethod === 'pix' ? 'pix' : payload.payment_method_id;
  let resolvedIssuerId: string | number | undefined = payload.issuer_id;

  if (payload.paymentMethod !== 'pix' && (!mpPaymentMethod || mpPaymentMethod === 'unknown')) {
    if (profile?.mp_customer_id && payload.mp_card_id) {
      try {
        const cardRes = await fetch(
          `https://api.mercadopago.com/v1/customers/${profile.mp_customer_id}/cards/${payload.mp_card_id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        const cardData = await cardRes.json();
        const resolvedPmId = cardData?.payment_method?.id || cardData?.payment_method_id;
        console.log('[payment] card lookup status:', cardRes.status, 'payment_method:', JSON.stringify(cardData?.payment_method));
        if (resolvedPmId) {
          mpPaymentMethod = resolvedPmId;
          if (cardData.issuer?.id) resolvedIssuerId = cardData.issuer.id;
          serviceClient
            .from('saved_cards')
            .update({ brand: resolvedPmId })
            .eq('mp_card_id', payload.mp_card_id)
            .then(() => console.log('[payment] auto-healed saved_cards brand:', resolvedPmId))
            .catch(() => {});
        }
      } catch {
        // validation below will reject if still unresolved
      }
    }
  }

  if (payload.paymentMethod !== 'pix') {
    if (!payload.token) return jsonResponse({ error: 'Card token is required' }, 400);
    if (!mpPaymentMethod || mpPaymentMethod === 'unknown') {
      return jsonResponse({ error: 'Could not determine payment method for this card' }, 400);
    }
  }

  // Build transaction payment_method for Orders API
  const transactionPaymentMethod: Record<string, unknown> =
    payload.paymentMethod === 'pix'
      ? { id: 'pix', type: 'bank_transfer' }
      : {
          id: mpPaymentMethod,
          type: payload.paymentMethod === 'debit_card' ? 'debit_card' : 'credit_card',
          token: payload.token,
          installments: Math.max(1, Number(payload.installments) || 1),
        };

  const mpOrderPayload: Record<string, unknown> = {
    type: 'online',
    external_reference: savedOrder.id,
    processing_mode: 'automatic',
    capture_mode: 'automatic',
    total_amount: total.toFixed(2),
    payer: {
      email: payerEmail,
      first_name: payerFirstName,
      last_name: payerLastName,
      identification: payload.payer?.identification,
    },
    transactions: {
      payments: [
        {
          amount: total.toFixed(2),
          payment_method: transactionPaymentMethod,
        },
      ],
    },
  };

  // 3DS for card payments: force challenge on every transaction to shift
  // fraud liability to the issuing bank, reducing reliance on MP's antifraud score.
  if (payload.paymentMethod !== 'pix') {
    mpOrderPayload.config = {
      online: {
        transaction_security: {
          validation: 'always',
          liability_shift: 'required',
        },
      },
    };
  }

  const mpHeaders: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Idempotency-Key': savedOrder.id,
  };
  if (payload.device_session_id) {
    mpHeaders['X-meli-session-id'] = payload.device_session_id;
  }

  const mpResponse = await fetch('https://api.mercadopago.com/v1/orders', {
    method: 'POST',
    headers: mpHeaders,
    body: JSON.stringify(mpOrderPayload),
  });

  const mpRaw = await mpResponse.json().catch(() => null);

  // Orders API wraps rejected payments in { errors, data } with HTTP 402.
  // Unwrap so the rest of the code works uniformly.
  const mpData = (mpResponse.status === 402 && mpRaw?.data) ? mpRaw.data : mpRaw;

  const mpStatus = String(mpData?.status || '');
  // Prefer payment-level detail (e.g. "high_risk", "pending_challenge") over order-level ("failed")
  const mpStatusDetail = String(
    mpData?.transactions?.payments?.[0]?.status_detail || mpData?.status_detail || '',
  );
  console.log('[create-mercado-pago-payment] orders api http:', mpResponse.status, 'status:', mpStatus, 'detail:', mpStatusDetail);

  // Hard API errors (4xx that are NOT a payment rejection)
  if (!mpResponse.ok && mpResponse.status !== 402) {
    console.log('[create-mercado-pago-payment] api_error:', JSON.stringify(mpRaw));
    await serviceClient.from('orders').update({ status: 'payment_failed', payment_status: 'failed' }).eq('id', savedOrder.id);
    return jsonResponse({ success: false, mp_status: mpResponse.status, mp_error: mpRaw, payer_email_used: payerEmail }, 200);
  }

  // MP order ID used as provider_payment_id for polling via GET /v1/orders/{id}
  const mpOrderId = String(mpData?.id || '');

  // Extract Pix QR code — Orders API puts it in payment_method.transaction_data or point_of_interaction
  const pixPayment = mpData?.transactions?.payments?.[0];
  const txData =
    pixPayment?.point_of_interaction?.transaction_data ||
    pixPayment?.payment_method?.transaction_data ||
    {};
  const qrCode = txData.qr_code || null;
  const qrCodeBase64 = txData.qr_code_base64 || null;
  const ticketUrl = txData.ticket_url || pixPayment?.ticket_url || null;

  // 3DS challenge URL — present when status is action_required / pending_challenge
  const threeDSecureUrl =
    mpStatusDetail === 'pending_challenge'
      ? (pixPayment?.payment_method?.transaction_security?.url || null)
      : null;

  // Update order status immediately for synchronous rejections
  if (mpStatus === 'failed') {
    await serviceClient.from('orders').update({ status: 'payment_failed', payment_status: 'failed' }).eq('id', savedOrder.id);
  }

  const { data: savedPayment, error: paymentError } = await serviceClient
    .from('order_payments')
    .insert({
      order_id: savedOrder.id,
      provider: 'mercado_pago',
      provider_payment_id: mpOrderId,
      provider_status: mpStatus,
      payment_method: payload.paymentMethod,
      amount: total,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
      ticket_url: ticketUrl,
      raw_response: mpData,
    })
    .select('id')
    .single();

  if (paymentError) return jsonResponse({ error: 'Unable to save payment', details: paymentError }, 500);

  if ((mpStatus === 'processed' || mpStatus === 'approved') && payload.referralCreditId) {
    await serviceClient
      .from('referrals')
      .update({ credit_redeemed_at: new Date().toISOString() })
      .eq('id', payload.referralCreditId)
      .is('credit_redeemed_at', null);
  }

  return jsonResponse({
    order_id: savedOrder.id,
    pickup_code: savedOrder.pickup_code,
    delivery_pin: deliveryPin,
    payment_id: savedPayment.id,
    provider_payment_id: mpOrderId,
    provider_status: mpStatus,
    status_detail: mpStatusDetail || null,
    payment_method: payload.paymentMethod,
    qr_code: qrCode,
    qr_code_base64: qrCodeBase64,
    ticket_url: ticketUrl,
    three_d_secure_url: threeDSecureUrl,
  });
});
