const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CheckoutItem = {
  name: string;
  price: number;
  quantity: number;
};

type CheckoutRequest = {
  items: CheckoutItem[];
  deliveryFee?: number;
  couponDiscount?: number;
  paymentMethod?: string;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const toCents = (value: number) => Math.max(0, Math.round(value * 100));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const handle = Deno.env.get('INFINITEPAY_HANDLE');
  const appUrl = Deno.env.get('APP_URL');

  if (!handle || !appUrl) {
    return jsonResponse({ error: 'InfinitePay environment is not configured' }, 500);
  }

  let payload: CheckoutRequest;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) {
    return jsonResponse({ error: 'Cart is empty' }, 400);
  }

  const checkoutItems = items.map((item) => ({
    name: String(item.name || 'Item Cosechas').slice(0, 120),
    description: 'Pedido Cosechas',
    price: toCents(Number(item.price) || 0),
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
  }));

  if (checkoutItems.some((item) => item.price <= 0)) {
    return jsonResponse({ error: 'Invalid item price' }, 400);
  }

  const deliveryFee = toCents(Number(payload.deliveryFee) || 0);
  const couponDiscount = toCents(Number(payload.couponDiscount) || 0);

  if (deliveryFee > 0) {
    checkoutItems.push({
      name: 'Taxa de entrega',
      description: 'Entrega Cosechas',
      price: deliveryFee,
      quantity: 1,
    });
  }

  if (couponDiscount > 0) {
    checkoutItems.push({
      name: 'Desconto',
      price: -couponDiscount,
      quantity: 1,
    });
  }

  const total = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (total <= 0) {
    return jsonResponse({ error: 'Invalid checkout total' }, 400);
  }

  const infinitePayItems = couponDiscount > 0
    ? [{ name: 'Pedido Cosechas', description: 'Pedido Cosechas', price: total, quantity: 1 }]
    : checkoutItems;

  const orderNsu = crypto.randomUUID();
  const url = new URL('/validando-pagamento', appUrl);
  url.searchParams.set('order_nsu', orderNsu);

  const checkoutPayload = {
    handle,
    redirect_url: url.toString(),
    webhook_url: new URL('/functions/v1/webhook-infinitepay', Deno.env.get('SUPABASE_URL') || appUrl).toString(),
    order_nsu: orderNsu,
    items: infinitePayItems,
  };

  const response = await fetch('https://api.checkout.infinitepay.io/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(checkoutPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return jsonResponse({ error: 'Unable to create InfinitePay checkout', details: data }, 502);
  }

  return jsonResponse({
    order_nsu: orderNsu,
    payment_method: payload.paymentMethod || 'infinitepay',
    ...data,
  });
});
