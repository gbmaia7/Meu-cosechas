const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type VerifyRequest = {
  order_nsu?: string;
  slug?: string;
  transaction_nsu?: string;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const handle = Deno.env.get('INFINITEPAY_HANDLE');
  if (!handle) {
    return jsonResponse({ error: 'InfinitePay environment is not configured' }, 500);
  }

  let payload: VerifyRequest;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const orderNsu = payload.order_nsu?.trim();
  const slug = payload.slug?.trim();
  const transactionNsu = payload.transaction_nsu?.trim();

  if (!orderNsu && !slug && !transactionNsu) {
    return jsonResponse({ error: 'Missing payment identifier' }, 400);
  }

  const response = await fetch('https://api.checkout.infinitepay.io/payment_check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      handle,
      order_nsu: orderNsu,
      slug,
      transaction_nsu: transactionNsu,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return jsonResponse({ error: 'Unable to verify InfinitePay payment', details: data }, 502);
  }

  return jsonResponse(data);
});
