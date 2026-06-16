create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'expire-counter-pay-on-delivery-orders') then
    perform cron.unschedule('expire-counter-pay-on-delivery-orders');
  end if;
end;
$$;

select cron.schedule(
  'expire-counter-pay-on-delivery-orders',
  '* * * * *',
  $$
    with expired_orders as (
      update public.orders
      set status = 'cancelled',
          payment_status = 'failed',
          cancelled_at = now(),
          cancel_reason = 'Expirado automaticamente: pagamento no caixa nao confirmado em 5 minutos'
      where status = 'new'
        and modality = 'counter'
        and payment_status = 'pay_on_delivery'
        and created_at < now() - interval '5 minutes'
      returning id
    )
    insert into public.order_status_events (order_id, old_status, new_status, reason)
    select id, 'new', 'cancelled', 'Expirado automaticamente: pagamento no caixa nao confirmado em 5 minutos'
    from expired_orders;
  $$
);
