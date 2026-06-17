create or replace function public.claim_pending_counter_sale_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event record;
  v_total_points integer := 0;
  v_total_orders integer := 0;
begin
  if tg_op = 'UPDATE' then
    if (old.phone_verified is true) or (new.phone_verified is not true) or (new.phone is null) then
      return new;
    end if;
  else
    if (new.phone_verified is not true) or (new.phone is null) then
      return new;
    end if;
  end if;

  for v_event in
    select id, points, external_sale_id
    from public.counter_sale_point_events
    where phone_e164 = new.phone
      and status = 'pending'
      and (expires_at is null or expires_at > now())
  loop
    update public.counter_sale_point_events
    set status     = 'claimed',
        user_id    = new.id,
        claimed_at = now(),
        expires_at = null,
        updated_at = now()
    where id = v_event.id;

    insert into public.loyalty_points_ledger (user_id, points, reason, description)
    values (
      new.id,
      v_event.points,
      'counter_purchase',
      'Compra balcão Teknisa ' || v_event.external_sale_id
    );

    v_total_points := v_total_points + v_event.points;
    v_total_orders := v_total_orders + 1;
  end loop;

  if v_total_points > 0 then
    update public.profiles
    set points       = coalesce(points, 0) + v_total_points,
        total_orders = coalesce(total_orders, 0) + v_total_orders
    where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_phone_verified_claim_counter_sales on public.profiles;

create trigger on_phone_verified_claim_counter_sales
  after insert or update on public.profiles
  for each row
  execute function public.claim_pending_counter_sale_credits();
