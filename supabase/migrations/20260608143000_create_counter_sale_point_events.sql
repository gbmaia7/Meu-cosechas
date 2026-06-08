create table if not exists public.counter_sale_point_events (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'teknisa',
  external_sale_id text not null,
  store_id text not null,
  phone_e164 text,
  user_id uuid references public.profiles(id) on delete set null,
  amount numeric(10, 2) not null default 0,
  points integer not null default 1,
  status text not null default 'pending',
  paid_at timestamptz,
  expires_at timestamptz,
  claimed_at timestamptz,
  cancelled_at timestamptz,
  raw_payload jsonb not null default '{}'::jsonb,
  payload_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint counter_sale_point_events_status_check
    check (status in ('pending', 'claimed', 'expired', 'cancelled')),
  constraint counter_sale_point_events_points_check
    check (points > 0),
  constraint counter_sale_point_events_amount_check
    check (amount >= 0)
);

create unique index if not exists counter_sale_point_events_source_external_idx
  on public.counter_sale_point_events(source, external_sale_id);

create index if not exists counter_sale_point_events_phone_status_idx
  on public.counter_sale_point_events(phone_e164, status)
  where phone_e164 is not null;

create index if not exists counter_sale_point_events_user_id_idx
  on public.counter_sale_point_events(user_id)
  where user_id is not null;

create index if not exists counter_sale_point_events_expires_at_idx
  on public.counter_sale_point_events(expires_at)
  where status = 'pending';

alter table public.counter_sale_point_events enable row level security;

drop policy if exists counter_sale_point_events_customer_select on public.counter_sale_point_events;
create policy counter_sale_point_events_customer_select
  on public.counter_sale_point_events
  for select
  using (user_id = auth.uid());

drop policy if exists counter_sale_point_events_store_select on public.counter_sale_point_events;
create policy counter_sale_point_events_store_select
  on public.counter_sale_point_events
  for select
  using (public.has_store_access());

create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'expire-teknisa-counter-sale-credits') then
    perform cron.unschedule('expire-teknisa-counter-sale-credits');
  end if;
end $$;

select cron.schedule(
  'expire-teknisa-counter-sale-credits',
  '0 * * * *',
  $$
    update public.counter_sale_point_events
    set status = 'expired',
        updated_at = now()
    where status = 'pending'
      and expires_at is not null
      and expires_at < now();

    delete from public.counter_sale_point_events
    where status = 'expired'
      and updated_at < now() - interval '90 days';
  $$
);
