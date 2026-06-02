do $$
declare
  prod_user_id uuid;
  delivery_user_id uuid;
  address_id uuid;
  demo_order_id uuid;
  item_id uuid;
begin
  delete from public.order_item_extras
  where order_item_id in (
    select oi.id
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.notes in ('[demo-loja]', '[demo-producao]', '[demo-entregador]')
  );

  delete from public.order_items
  where order_id in (
    select o.id
    from public.orders o
    where o.notes in ('[demo-loja]', '[demo-producao]', '[demo-entregador]')
  );

  delete from public.order_status_events
  where order_id in (
    select o.id
    from public.orders o
    where o.notes in ('[demo-loja]', '[demo-producao]', '[demo-entregador]')
  );

  delete from public.orders
  where notes in ('[demo-loja]', '[demo-producao]', '[demo-entregador]');

  select id into prod_user_id
  from auth.users
  where email = 'cliente-demo-prod-real@meucosechas.com'
  limit 1;

  if prod_user_id is null then
    prod_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, reauthentication_token, raw_app_meta_data,
      raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous
    )
    values (
      '00000000-0000-0000-0000-000000000000', prod_user_id, 'authenticated', 'authenticated',
      'cliente-demo-prod-real@meucosechas.com', crypt('cliente123456', gen_salt('bf', 10)), now(),
      '', '', '', '', '', '',
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('sub', prod_user_id::text, 'name', 'Cliente Demo Produtos Reais', 'email_verified', true),
      now(), now(), false, false
    );

    insert into auth.identities (
      provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    )
    values (
      prod_user_id::text, prod_user_id,
      jsonb_build_object('sub', prod_user_id::text, 'email', 'cliente-demo-prod-real@meucosechas.com', 'email_verified', true),
      'email', now(), now(), now()
    );
  end if;

  insert into public.profiles (id, name, email, phone, phone_verified, role, is_active)
  values (
    prod_user_id,
    'Cliente Demo Produtos Reais',
    'cliente-demo-prod-real@meucosechas.com',
    '+5521996665555',
    true,
    'customer',
    true
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    phone_verified = true,
    role = 'customer',
    is_active = true,
    updated_at = now();

  insert into public.orders (
    user_id, subtotal, total_price, payment_method, payment_status, status, modality,
    pickup_code, notes, created_at
  )
  values (
    prod_user_id, 27.90, 27.90, 'pix', 'paid', 'new', 'counter',
    'D-001', '[demo-loja]', now() - interval '6 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (
    order_id, product_id, product_name, size_label, base, unit_price, quantity, notes
  )
  values (
    demo_order_id, '1', 'Colibri Roxo com Iogurte', 'M', 'Iogurte natural', 27.90, 1, 'Sem banana'
  )
  returning id into item_id;

  insert into public.order_item_extras (order_item_id, extra_id, extra_name, extra_price)
  values
    (item_id, 'extra-granola', 'Granola', 3.00),
    (item_id, 'extra-mel', 'Mel de Abelha', 3.00);

  insert into public.orders (
    user_id, subtotal, total_price, payment_method, payment_status, status, modality,
    pickup_code, accepted_at, prepared_at, notes, created_at
  )
  values (
    prod_user_id, 19.90, 19.90, 'cash', 'pay_on_delivery', 'preparing', 'counter',
    'D-002', now() - interval '11 minutes', now() - interval '5 minutes',
    '[demo-loja]', now() - interval '13 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (
    order_id, product_id, product_name, size_label, base, unit_price, quantity, notes
  )
  values (
    demo_order_id, 'caribe-1', 'Limonada de Coco', 'G', 'Coco', 19.90, 1, 'Pouco gelo'
  )
  returning id into item_id;

  insert into public.order_item_extras (order_item_id, extra_id, extra_name, extra_price)
  values
    (item_id, 'extra-aveia-caribe', 'Aveia', 3.00),
    (item_id, 'extra-mel-caribe', 'Mel de Abelha', 3.00);

  insert into public.orders (
    user_id, subtotal, total_price, payment_method, payment_status, status, modality,
    pickup_code, accepted_at, prepared_at, ready_at, notes, created_at
  )
  values (
    prod_user_id, 33.90, 33.90, 'credit_card', 'paid', 'ready', 'counter',
    'D-003', now() - interval '18 minutes', now() - interval '11 minutes',
    now() - interval '2 minutes', '[demo-loja]', now() - interval '20 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (
    order_id, product_id, product_name, size_label, base, unit_price, quantity, notes
  )
  values (
    demo_order_id, '4', 'Açaí Bowl', 'G', 'Açaí tradicional', 33.90, 1, 'Pouco mel'
  )
  returning id into item_id;

  insert into public.order_item_extras (order_item_id, extra_id, extra_name, extra_price)
  values
    (item_id, 'extra-granola', 'Granola', 3.00),
    (item_id, 'extra-aveia', 'Aveia', 3.00);

  select id into delivery_user_id
  from auth.users
  where email = 'cliente-demo-entrega-real@meucosechas.com'
  limit 1;

  if delivery_user_id is null then
    delivery_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, reauthentication_token, raw_app_meta_data,
      raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous
    )
    values (
      '00000000-0000-0000-0000-000000000000', delivery_user_id, 'authenticated', 'authenticated',
      'cliente-demo-entrega-real@meucosechas.com', crypt('cliente123456', gen_salt('bf', 10)), now(),
      '', '', '', '', '', '',
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('sub', delivery_user_id::text, 'name', 'Cliente Entrega Real', 'email_verified', true),
      now(), now(), false, false
    );

    insert into auth.identities (
      provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    )
    values (
      delivery_user_id::text, delivery_user_id,
      jsonb_build_object('sub', delivery_user_id::text, 'email', 'cliente-demo-entrega-real@meucosechas.com', 'email_verified', true),
      'email', now(), now(), now()
    );
  end if;

  insert into public.profiles (id, name, email, phone, phone_verified, role, is_active)
  values (
    delivery_user_id,
    'Cliente Entrega Real',
    'cliente-demo-entrega-real@meucosechas.com',
    '+5521987776666',
    true,
    'customer',
    true
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    phone_verified = true,
    role = 'customer',
    is_active = true,
    updated_at = now();

  insert into public.addresses (user_id, label, block, room, complement, is_default)
  values (
    delivery_user_id,
    'Endereco Demo Real',
    'Bloco 4',
    'Sala 812',
    'Entregar na recepcao do andar',
    false
  )
  returning id into address_id;

  insert into public.orders (
    user_id, subtotal, total_price, payment_method, payment_status, status, modality,
    address_id, delivery_pin, accepted_at, prepared_at, ready_at, out_for_delivery_at,
    notes, created_at
  )
  values (
    delivery_user_id, 35.90, 40.90, 'machine', 'pay_on_delivery', 'ready', 'delivery',
    address_id, '7362', now() - interval '18 minutes', now() - interval '12 minutes',
    now() - interval '2 minutes', null, '[demo-entregador]', now() - interval '22 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (
    order_id, product_id, product_name, size_label, base, unit_price, quantity, notes
  )
  values (
    demo_order_id, 'coffee-1', 'Tropical Coffee', 'G', null, 35.90, 1, 'Sem gelo'
  )
  returning id into item_id;

  insert into public.order_item_extras (order_item_id, extra_id, extra_name, extra_price)
  values
    (item_id, 'extra-aveia-c', 'Aveia', 3.00),
    (item_id, 'extra-mel-c', 'Mel de Abelha', 3.00);
end $$;
