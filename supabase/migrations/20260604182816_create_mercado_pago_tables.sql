alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (
    status in (
      'pending',
      'pending_payment',
      'new',
      'accepted',
      'paid',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'payment_failed',
      'expired',
      'canceled',
      'cancelled'
    )
  );

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders
  add constraint orders_payment_status_check
  check (
    payment_status in (
      'pending',
      'paid',
      'failed',
      'refunded',
      'pay_on_delivery'
    )
  );

create table if not exists public.order_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'mercado_pago',
  provider_payment_id text,
  provider_status text,
  payment_method text not null,
  amount numeric(10, 2) not null,
  qr_code text,
  qr_code_base64 text,
  ticket_url text,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists order_payments_provider_payment_id_idx
  on public.order_payments(provider, provider_payment_id)
  where provider_payment_id is not null;

create index if not exists order_payments_order_id_idx
  on public.order_payments(order_id);

alter table public.order_payments enable row level security;

drop policy if exists order_payments_customer_select on public.order_payments;
create policy order_payments_customer_select
  on public.order_payments
  for select
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_payments.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists order_payments_store_select on public.order_payments;
create policy order_payments_store_select
  on public.order_payments
  for select
  using (public.has_store_access());

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'mercado_pago',
  provider_event_id text,
  provider_payment_id text,
  event_type text,
  action text,
  signature_valid boolean,
  payload jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists payment_webhook_events_provider_event_idx
  on public.payment_webhook_events(provider, provider_event_id)
  where provider_event_id is not null;

alter table public.payment_webhook_events enable row level security;

drop policy if exists payment_webhook_events_store_select on public.payment_webhook_events;
create policy payment_webhook_events_store_select
  on public.payment_webhook_events
  for select
  using (public.has_store_access());
