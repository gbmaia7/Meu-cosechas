do $$
declare
  user_one uuid;
  user_two uuid;
  address_one uuid;
  address_two uuid;
  order_new uuid;
  order_preparing uuid;
  order_ready uuid;
  order_delivery uuid;
  item_id uuid;
begin
  delete from public.order_item_extras
  where order_item_id in (
    select oi.id
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.notes = '[demo-loja]'
  );

  delete from public.order_items
  where order_id in (
    select id
    from public.orders
    where notes = '[demo-loja]'
  );

  delete from public.order_status_events
  where order_id in (
    select id
    from public.orders
    where notes = '[demo-loja]'
  );

  delete from public.orders
  where notes = '[demo-loja]';

  select id into user_one from auth.users where email = 'cliente-demo-1@meucosechas.com';
  if user_one is null then
    user_one := gen_random_uuid();
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current,
      reauthentication_token,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      is_sso_user,
      is_anonymous
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      user_one,
      'authenticated',
      'authenticated',
      'cliente-demo-1@meucosechas.com',
      crypt('cliente123456', gen_salt('bf', 10)),
      now(),
      '',
      '',
      '',
      '',
      '',
      '',
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('sub', user_one::text, 'name', 'Cliente Demo 1', 'email_verified', true),
      now(),
      now(),
      false,
      false
    );

    insert into auth.identities (
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    )
    values (
      user_one::text,
      user_one,
      jsonb_build_object('sub', user_one::text, 'email', 'cliente-demo-1@meucosechas.com', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    );
  end if;

  select id into user_two from auth.users where email = 'cliente-demo-2@meucosechas.com';
  if user_two is null then
    user_two := gen_random_uuid();
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current,
      reauthentication_token,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      is_sso_user,
      is_anonymous
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      user_two,
      'authenticated',
      'authenticated',
      'cliente-demo-2@meucosechas.com',
      crypt('cliente123456', gen_salt('bf', 10)),
      now(),
      '',
      '',
      '',
      '',
      '',
      '',
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('sub', user_two::text, 'name', 'Cliente Demo 2', 'email_verified', true),
      now(),
      now(),
      false,
      false
    );

    insert into auth.identities (
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    )
    values (
      user_two::text,
      user_two,
      jsonb_build_object('sub', user_two::text, 'email', 'cliente-demo-2@meucosechas.com', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    );
  end if;

  insert into public.profiles (id, name, email, phone, phone_verified, role, is_active)
  values
    (user_one, 'Ana Demo', 'cliente-demo-1@meucosechas.com', '+5521999000001', true, 'customer', true),
    (user_two, 'Bruno Demo', 'cliente-demo-2@meucosechas.com', '+5521999000002', true, 'customer', true)
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
  values (user_two, 'Demo Loja', 'Bloco 2', 'Sala 301', 'Deixar na recepcao', false)
  returning id into address_one;

  insert into public.addresses (user_id, label, block, room, complement, is_default)
  values (user_two, 'Demo Loja 2', 'Bloco 1', 'Sala 120', 'Interfone 120', false)
  returning id into address_two;

  insert into public.orders (
    user_id,
    subtotal,
    total_price,
    payment_method,
    payment_status,
    status,
    modality,
    pickup_code,
    points_earned,
    notes,
    created_at
  )
  values (
    user_one,
    29.90,
    29.90,
    'pix',
    'paid',
    'new',
    'counter',
    'D-001',
    1,
    '[demo-loja]',
    now() - interval '8 minutes'
  )
  returning id into order_new;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values (order_new, 'demo-acai-m', 'Acai Premium', 'M', 'Acai tradicional', 29.90, 1, 'Sem banana')
  returning id into item_id;

  insert into public.order_item_extras (order_item_id, extra_id, extra_name, extra_price)
  values
    (item_id, 'granola', 'Granola', 0),
    (item_id, 'leite-po', 'Leite em po', 2.50);

  insert into public.orders (
    user_id,
    subtotal,
    total_price,
    payment_method,
    payment_status,
    status,
    modality,
    pickup_code,
    accepted_at,
    prepared_at,
    points_earned,
    notes,
    created_at
  )
  values (
    user_one,
    44.80,
    44.80,
    'credit_card',
    'paid',
    'preparing',
    'counter',
    'D-002',
    now() - interval '13 minutes',
    now() - interval '9 minutes',
    1,
    '[demo-loja]',
    now() - interval '18 minutes'
  )
  returning id into order_preparing;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values
    (order_preparing, 'demo-suco-verde', 'Suco Detox Verde', 'G', null, 16.90, 1, null),
    (order_preparing, 'demo-smoothie', 'Smoothie Morango e Banana', 'M', null, 27.90, 1, 'Pouco gelo');

  insert into public.orders (
    user_id,
    subtotal,
    total_price,
    payment_method,
    payment_status,
    status,
    modality,
    pickup_code,
    accepted_at,
    prepared_at,
    ready_at,
    points_earned,
    notes,
    created_at
  )
  values (
    user_one,
    21.90,
    21.90,
    'cash',
    'pay_on_delivery',
    'ready',
    'counter',
    'D-003',
    now() - interval '21 minutes',
    now() - interval '18 minutes',
    now() - interval '2 minutes',
    0,
    '[demo-loja]',
    now() - interval '26 minutes'
  )
  returning id into order_ready;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values (order_ready, 'demo-acai-p', 'Acai Premium', 'P', 'Acai zero', 21.90, 1, null);

  insert into public.orders (
    user_id,
    subtotal,
    total_price,
    payment_method,
    payment_status,
    status,
    modality,
    address_id,
    delivery_pin,
    accepted_at,
    prepared_at,
    ready_at,
    out_for_delivery_at,
    points_earned,
    notes,
    created_at
  )
  values (
    user_two,
    38.90,
    43.90,
    'machine',
    'pay_on_delivery',
    'out_for_delivery',
    'delivery',
    address_one,
    '4821',
    now() - interval '30 minutes',
    now() - interval '25 minutes',
    now() - interval '12 minutes',
    now() - interval '4 minutes',
    0,
    '[demo-loja]',
    now() - interval '35 minutes'
  )
  returning id into order_delivery;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values (order_delivery, 'demo-vitamina', 'Vitamina Proteica', 'G', null, 38.90, 1, 'Entregar com canudo');

  insert into public.orders (
    user_id,
    subtotal,
    total_price,
    payment_method,
    payment_status,
    status,
    modality,
    address_id,
    delivery_pin,
    accepted_at,
    cancel_reason,
    cancelled_at,
    points_earned,
    notes,
    created_at
  )
  values (
    user_two,
    32.90,
    37.90,
    'pix',
    'failed',
    'cancelled',
    'delivery',
    address_two,
    '1937',
    now() - interval '40 minutes',
    'Pagamento nao confirmado',
    now() - interval '32 minutes',
    0,
    '[demo-loja]',
    now() - interval '45 minutes'
  );
end $$;
