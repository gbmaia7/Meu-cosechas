create extension if not exists pg_cron;

select cron.schedule(
  'expire-pending-payment-orders',
  '*/5 * * * *',
  $$
    update public.orders
    set status = 'expired',
        payment_status = 'failed'
    where status = 'pending_payment'
      and created_at < now() - interval '40 minutes';
  $$
);
