-- Adiciona role 'delivery' separado de 'store'.
-- Entregadores passam a ter acesso restrito: só entregas do dia (ready/out_for_delivery/delivered).

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('customer', 'store', 'admin', 'delivery'));

create or replace function public.has_delivery_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('delivery', 'admin')
  );
$$;

grant execute on function public.has_delivery_access() to anon, authenticated;

drop policy if exists orders_delivery_select on public.orders;
create policy orders_delivery_select
  on public.orders
  for select
  using (
    public.has_delivery_access()
    and modality = 'delivery'
    and status in ('ready', 'out_for_delivery', 'delivered')
  );

drop policy if exists orders_delivery_update on public.orders;
create policy orders_delivery_update
  on public.orders
  for update
  using (
    public.has_delivery_access()
    and modality = 'delivery'
    and status in ('ready', 'out_for_delivery')
  )
  with check (public.has_delivery_access());

drop policy if exists profiles_delivery_select on public.profiles;
create policy profiles_delivery_select
  on public.profiles
  for select
  using (public.has_delivery_access());

drop policy if exists addresses_delivery_select on public.addresses;
create policy addresses_delivery_select
  on public.addresses
  for select
  using (public.has_delivery_access());

create or replace function public.confirm_delivery_with_pin(p_order_id uuid, p_delivery_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  order_record public.orders%rowtype;
  typed_pin text := trim(coalesce(p_delivery_pin, ''));
begin
  if not (public.has_store_access() or public.has_delivery_access()) then
    raise exception 'STORE_ACCESS_REQUIRED';
  end if;
  if typed_pin = '' then raise exception 'DELIVERY_PIN_REQUIRED'; end if;
  select * into order_record from public.orders where id = p_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if order_record.modality <> 'delivery' then raise exception 'ORDER_NOT_DELIVERY'; end if;
  if order_record.status <> 'out_for_delivery' then raise exception 'ORDER_NOT_OUT_FOR_DELIVERY'; end if;
  if coalesce(order_record.delivery_pin_hash, '') <> public.hash_delivery_pin(p_order_id, typed_pin)
    then raise exception 'DELIVERY_PIN_INVALID'; end if;
  perform set_config('app.confirming_delivery_pin', 'on', true);
  update public.orders set status = 'delivered', delivered_at = now() where id = p_order_id;
  insert into public.order_status_events (order_id, old_status, new_status, changed_by, reason)
  values (p_order_id, order_record.status, 'delivered', auth.uid(), 'Entrega confirmada por PIN');
  return true;
end;
$$;

grant execute on function public.confirm_delivery_with_pin(uuid, text) to authenticated;
