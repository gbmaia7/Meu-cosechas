alter table public.profiles
  add column if not exists role text not null default 'customer';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('customer', 'store', 'admin'));
  end if;
end $$;

alter table public.orders
  add column if not exists accepted_at timestamptz,
  add column if not exists prepared_at timestamptz,
  add column if not exists ready_at timestamptz,
  add column if not exists out_for_delivery_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancel_reason text;

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (
    status in (
      'pending',
      'new',
      'accepted',
      'paid',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'canceled',
      'cancelled'
    )
  );

alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders
  add constraint orders_payment_method_check
  check (
    payment_method is null or payment_method in (
      'pix',
      'card',
      'credit',
      'debit',
      'credit_card',
      'debit_card',
      'cash',
      'machine',
      'vr',
      'subscription'
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

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references public.profiles(id),
  reason text,
  created_at timestamptz not null default now()
);

alter table public.order_status_events enable row level security;

create or replace function public.has_store_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('store', 'admin')
  );
$$;

grant execute on function public.has_store_access() to anon, authenticated;

drop policy if exists orders_store_select on public.orders;
create policy orders_store_select
  on public.orders
  for select
  using (public.has_store_access());

drop policy if exists orders_store_update on public.orders;
create policy orders_store_update
  on public.orders
  for update
  using (public.has_store_access())
  with check (public.has_store_access());

drop policy if exists order_status_events_store_all on public.order_status_events;
create policy order_status_events_store_all
  on public.order_status_events
  for all
  using (public.has_store_access())
  with check (public.has_store_access());

drop policy if exists profiles_store_select on public.profiles;
create policy profiles_store_select
  on public.profiles
  for select
  using (public.has_store_access());

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;

alter table public.orders replica identity full;
