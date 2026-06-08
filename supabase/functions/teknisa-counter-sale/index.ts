import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-teknisa-timestamp, x-teknisa-signature',
};

type TeknisaItem = {
  sku?: string;
  name?: string;
  quantity?: number;
  unit_price?: number;
};

type CounterSalePayload = {
  event?: 'counter_sale_paid' | 'counter_sale_cancelled';
  external_sale_id?: string;
  store_id?: string;
  phone?: string;
  amount?: number;
  paid_at?: string;
  cancelled_at?: string;
  reason?: string;
  items?: TeknisaItem[];
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');

const sha256Hex = async (value: string) =>
  toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));

const signHmac = async (secret: string, value: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
};

const secureCompare = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

const validateSignature = async (secret: string, timestamp: string | null, signature: string | null, rawBody: string) => {
  if (!secret || !timestamp || !signature) return false;

  const requestTime = Date.parse(timestamp);
  if (!Number.isFinite(requestTime)) return false;
  if (Math.abs(Date.now() - requestTime) > 5 * 60 * 1000) return false;

  const provided = signature.startsWith('sha256=') ? signature.slice('sha256='.length) : signature;
  const expected = await signHmac(secret, `${timestamp}.${rawBody}`);
  return secureCompare(provided.toLowerCase(), expected);
};

const normalizePhone = (phone: string | undefined) => {
  const raw = String(phone || '').trim();
  if (!raw) return null;

  if (raw.startsWith('+')) {
    const digits = raw.replace(/\D/g, '');
    return digits.length >= 12 && digits.length <= 13 ? `+${digits}` : null;
  }

  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return `+${digits}`;
  return null;
};

const assertRequiredString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const findVerifiedProfileByPhone = async (
  client: ReturnType<typeof createClient>,
  phoneE164: string,
) => {
  const { data } = await client
    .from('profiles')
    .select('id, points, total_orders')
    .eq('phone', phoneE164)
    .eq('phone_verified', true)
    .maybeSingle();

  return data as { id: string; points: number | null; total_orders: number | null } | null;
};

const creditProfilePoints = async (
  client: ReturnType<typeof createClient>,
  profile: { id: string; points: number | null; total_orders: number | null },
  points: number,
  externalSaleId: string,
) => {
  await client.from('loyalty_points_ledger').insert({
    user_id: profile.id,
    points,
    reason: 'counter_purchase',
    description: `Compra balcão Teknisa ${externalSaleId}`,
  });

  await client
    .from('profiles')
    .update({
      points: (profile.points || 0) + points,
      total_orders: (profile.total_orders || 0) + 1,
      last_purchase_at: new Date().toISOString(),
    })
    .eq('id', profile.id);
};

const reverseProfilePoints = async (
  client: ReturnType<typeof createClient>,
  userId: string,
  points: number,
  externalSaleId: string,
) => {
  const { data: profile } = await client
    .from('profiles')
    .select('points, total_orders')
    .eq('id', userId)
    .single();

  await client.from('loyalty_points_ledger').insert({
    user_id: userId,
    points: -points,
    reason: 'counter_purchase_cancelled',
    description: `Cancelamento compra balcão Teknisa ${externalSaleId}`,
  });

  await client
    .from('profiles')
    .update({
      points: Math.max(0, (profile?.points || 0) - points),
      total_orders: Math.max(0, (profile?.total_orders || 0) - 1),
    })
    .eq('id', userId);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const teknisaSecret = Deno.env.get('TEKNISA_WEBHOOK_SECRET');
  if (!supabaseUrl || !serviceRoleKey || !teknisaSecret) {
    return jsonResponse({ error: 'Teknisa environment is not configured' }, 500);
  }

  const rawBody = await req.text();
  const signatureValid = await validateSignature(
    teknisaSecret,
    req.headers.get('x-teknisa-timestamp'),
    req.headers.get('x-teknisa-signature'),
    rawBody,
  );
  if (!signatureValid) return jsonResponse({ error: 'Invalid signature' }, 401);

  let payload: CounterSalePayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!['counter_sale_paid', 'counter_sale_cancelled'].includes(payload.event || '')) {
    return jsonResponse({ error: 'Invalid event' }, 400);
  }
  if (!assertRequiredString(payload.external_sale_id)) {
    return jsonResponse({ error: 'external_sale_id is required' }, 400);
  }
  if (!assertRequiredString(payload.store_id)) {
    return jsonResponse({ error: 'store_id is required' }, 400);
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const externalSaleId = payload.external_sale_id.trim();
  const storeId = payload.store_id.trim();
  const payloadHash = await sha256Hex(rawBody);

  const { data: existing } = await serviceClient
    .from('counter_sale_point_events')
    .select('id, status, payload_hash, user_id, points')
    .eq('source', 'teknisa')
    .eq('external_sale_id', externalSaleId)
    .maybeSingle();

  if (payload.event === 'counter_sale_cancelled') {
    if (!existing) return jsonResponse({ error: 'Cannot cancel unknown sale' }, 404);

    if (existing.status === 'cancelled') {
      if (existing.payload_hash !== payloadHash) {
        return jsonResponse({ error: 'external_sale_id already cancelled with conflicting payload' }, 409);
      }
      return jsonResponse({ ok: true, status: 'already_processed', points: existing.points || 0 });
    }

    if (existing.status === 'claimed' && existing.user_id) {
      await reverseProfilePoints(serviceClient, existing.user_id, existing.points || 1, externalSaleId);
    }

    const cancelledAt = payload.cancelled_at ? new Date(payload.cancelled_at) : new Date();
    if (Number.isNaN(cancelledAt.getTime())) {
      return jsonResponse({ error: 'cancelled_at is invalid' }, 400);
    }

    const { error: cancelError } = await serviceClient
      .from('counter_sale_point_events')
      .update({
        status: 'cancelled',
        cancelled_at: cancelledAt.toISOString(),
        raw_payload: payload,
        payload_hash: payloadHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (cancelError) return jsonResponse({ error: 'Unable to cancel counter sale event', details: cancelError }, 500);
    return jsonResponse({ ok: true, status: 'cancelled', points: existing.points || 0 });
  }

  if (existing) {
    if (existing.payload_hash !== payloadHash) {
      return jsonResponse({ error: 'external_sale_id already exists with conflicting payload' }, 409);
    }
    return jsonResponse({ ok: true, status: 'already_processed', points: existing.points || 0 });
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonResponse({ error: 'amount must be greater than zero' }, 400);
  }

  const paidAt = payload.paid_at ? new Date(payload.paid_at) : new Date();
  if (Number.isNaN(paidAt.getTime())) {
    return jsonResponse({ error: 'paid_at is invalid' }, 400);
  }

  const phoneE164 = normalizePhone(payload.phone);
  if (!phoneE164) return jsonResponse({ error: 'phone is invalid' }, 400);

  const points = 1;
  const profile = await findVerifiedProfileByPhone(serviceClient, phoneE164);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);

  const status = profile ? 'claimed' : 'pending';
  const { data: eventRow, error: insertError } = await serviceClient
    .from('counter_sale_point_events')
    .insert({
      source: 'teknisa',
      external_sale_id: externalSaleId,
      store_id: storeId,
      phone_e164: phoneE164,
      user_id: profile?.id || null,
      amount,
      points,
      status,
      paid_at: paidAt.toISOString(),
      expires_at: profile ? null : expiresAt.toISOString(),
      claimed_at: profile ? now.toISOString() : null,
      raw_payload: payload,
      payload_hash: payloadHash,
    })
    .select('id')
    .single();

  if (insertError) return jsonResponse({ error: 'Unable to save counter sale event', details: insertError }, 500);

  if (profile) {
    await creditProfilePoints(serviceClient, profile, points, externalSaleId);
  }

  return jsonResponse({
    ok: true,
    id: eventRow.id,
    status,
    points,
    expires_at: profile ? null : expiresAt.toISOString(),
  });
});
