drop policy if exists addresses_store_select on public.addresses;

create policy addresses_store_select
  on public.addresses
  for select
  using (public.has_store_access());
