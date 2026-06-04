create extension if not exists pgcrypto with schema extensions;

alter table public.orders
  add column if not exists delivery_pin_hash text;

create or replace function public.hash_delivery_pin(
  p_order_id uuid,
  p_delivery_pin text
)
returns text
language sql
immutable
set search_path = public, extensions
as $$
  select encode(extensions.digest(p_order_id::text || ':' || trim(coalesce(p_delivery_pin, '')), 'sha256'), 'hex');
$$;

create or replace function public.store_delivery_pin_hash()
returns trigger
language plpgsql
as $$
begin
  if new.modality = 'delivery'
    and new.delivery_pin is not null
    and trim(new.delivery_pin) <> ''
  then
    new.delivery_pin_hash := public.hash_delivery_pin(new.id, new.delivery_pin);
    new.delivery_pin := null;
  end if;

  return new;
end;
$$;

drop trigger if exists store_delivery_pin_hash on public.orders;
create trigger store_delivery_pin_hash
  before insert or update of delivery_pin on public.orders
  for each row
  execute function public.store_delivery_pin_hash();

update public.orders
set
  delivery_pin_hash = public.hash_delivery_pin(id, delivery_pin),
  delivery_pin = null
where modality = 'delivery'
  and delivery_pin is not null
  and trim(delivery_pin) <> '';

create or replace function public.prevent_direct_delivery_completion()
returns trigger
language plpgsql
as $$
begin
  if old.modality = 'delivery'
    and new.status = 'delivered'
    and old.status is distinct from new.status
    and coalesce(current_setting('app.confirming_delivery_pin', true), '') <> 'on'
  then
    raise exception 'DELIVERY_PIN_REQUIRED';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_direct_delivery_completion on public.orders;
create trigger prevent_direct_delivery_completion
  before update of status on public.orders
  for each row
  execute function public.prevent_direct_delivery_completion();

create or replace function public.confirm_delivery_with_pin(
  p_order_id uuid,
  p_delivery_pin text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  order_record public.orders%rowtype;
  typed_pin text := trim(coalesce(p_delivery_pin, ''));
begin
  if not public.has_store_access() then
    raise exception 'STORE_ACCESS_REQUIRED';
  end if;

  if typed_pin = '' then
    raise exception 'DELIVERY_PIN_REQUIRED';
  end if;

  select *
  into order_record
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if order_record.modality <> 'delivery' then
    raise exception 'ORDER_NOT_DELIVERY';
  end if;

  if order_record.status <> 'out_for_delivery' then
    raise exception 'ORDER_NOT_OUT_FOR_DELIVERY';
  end if;

  if coalesce(order_record.delivery_pin_hash, '') <> public.hash_delivery_pin(p_order_id, typed_pin) then
    raise exception 'DELIVERY_PIN_INVALID';
  end if;

  perform set_config('app.confirming_delivery_pin', 'on', true);

  update public.orders
  set
    status = 'delivered',
    delivered_at = now()
  where id = p_order_id;

  insert into public.order_status_events (
    order_id,
    old_status,
    new_status,
    changed_by,
    reason
  )
  values (
    p_order_id,
    order_record.status,
    'delivered',
    auth.uid(),
    'Entrega confirmada por PIN'
  );

  return true;
end;
$$;

grant execute on function public.confirm_delivery_with_pin(uuid, text) to authenticated;
