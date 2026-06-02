do $$
declare
  demo_user_id uuid;
  demo_order_id uuid;
  demo_item_id uuid;
begin
  delete from public.order_item_extras
  where order_item_id in (
    select oi.id
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.notes = '[demo-producao]'
  );

  delete from public.order_items
  where order_id in (
    select id
    from public.orders
    where notes = '[demo-producao]'
  );

  delete from public.order_status_events
  where order_id in (
    select id
    from public.orders
    where notes = '[demo-producao]'
  );

  delete from public.orders
  where notes = '[demo-producao]'
     or pickup_code in ('P-101', 'P-102', 'P-103');

  select id into demo_user_id
  from public.profiles
  where email = 'cliente-demo-producao@meucosechas.com'
  limit 1;

  if demo_user_id is null then
    demo_user_id := gen_random_uuid();

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
      demo_user_id,
      'authenticated',
      'authenticated',
      'cliente-demo-producao@meucosechas.com',
      crypt('cliente123456', gen_salt('bf', 10)),
      now(),
      '',
      '',
      '',
      '',
      '',
      '',
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('sub', demo_user_id::text, 'name', 'Cliente Producao Demo', 'email_verified', true),
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
      demo_user_id::text,
      demo_user_id,
      jsonb_build_object('sub', demo_user_id::text, 'email', 'cliente-demo-producao@meucosechas.com', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    );
  end if;

  insert into public.profiles (id, name, email, phone, phone_verified, role, is_active)
  values (
    demo_user_id,
    'Caio Producao Demo',
    'cliente-demo-producao@meucosechas.com',
    '+5521997776666',
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
    user_id,
    subtotal,
    total_price,
    payment_method,
    payment_status,
    status,
    modality,
    pickup_code,
    notes,
    created_at
  )
  values (
    demo_user_id,
    27.90,
    27.90,
    'pix',
    'paid',
    'new',
    'counter',
    'P-101',
    '[demo-producao]',
    now() - interval '5 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values (demo_order_id, 'prod-101', 'Açai Premium', 'M', 'Açai tradicional', 27.90, 1, 'Sem banana');

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
    notes,
    created_at
  )
  values (
    demo_user_id,
    19.90,
    19.90,
    'cash',
    'pay_on_delivery',
    'preparing',
    'counter',
    'P-102',
    now() - interval '10 minutes',
    now() - interval '4 minutes',
    '[demo-producao]',
    now() - interval '12 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values (demo_order_id, 'prod-102', 'Suco Detox Verde', 'G', null, 19.90, 1, null);

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
    notes,
    created_at
  )
  values (
    demo_user_id,
    33.90,
    33.90,
    'credit_card',
    'paid',
    'ready',
    'counter',
    'P-103',
    now() - interval '18 minutes',
    now() - interval '11 minutes',
    now() - interval '2 minutes',
    '[demo-producao]',
    now() - interval '20 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values (demo_order_id, 'prod-103', 'Smoothie Morango e Banana', 'M', null, 33.90, 1, 'Pouco gelo');
end $$;
