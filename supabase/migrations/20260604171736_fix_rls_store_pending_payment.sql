-- Garante que loja/admin não veja pedidos pending_payment via RLS.
-- O filtro existia apenas no frontend (Loja.tsx); agora é aplicado no banco também.
drop policy if exists orders_store_select on public.orders;
create policy orders_store_select
  on public.orders
  for select
  using (public.has_store_access() and status != 'pending_payment');

-- Garante que loja/admin não consiga atualizar pedidos pending_payment.
drop policy if exists orders_store_update on public.orders;
create policy orders_store_update
  on public.orders
  for update
  using (public.has_store_access() and status != 'pending_payment')
  with check (public.has_store_access());
