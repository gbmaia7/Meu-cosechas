do $$
declare
  demo_user_id uuid;
  demo_address_id uuid;
  demo_order_id uuid;
  demo_item_id uuid;
begin
  delete from public.order_item_extras
  where order_item_id in (
    select oi.id
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.notes = '[demo-entregador]'
  );

  delete from public.order_items
  where order_id in (
    select id
    from public.orders
    where notes = '[demo-entregador]'
  );

  delete from public.order_status_events
  where order_id in (
    select id
    from public.orders
    where notes = '[demo-entregador]'
  );

  delete from public.orders
  where notes = '[demo-entregador]';

  select id into demo_user_id
  from public.profiles
  where email = 'cliente-demo-entrega@meucosechas.com'
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
      'cliente-demo-entrega@meucosechas.com',
      crypt('cliente123456', gen_salt('bf', 10)),
      now(),
      '',
      '',
      '',
      '',
      '',
      '',
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('sub', demo_user_id::text, 'name', 'Cliente Entrega Demo', 'email_verified', true),
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
      jsonb_build_object('sub', demo_user_id::text, 'email', 'cliente-demo-entrega@meucosechas.com', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    );
  end if;

  insert into public.profiles (id, name, email, phone, phone_verified, role, is_active)
  values (
    demo_user_id,
    'Marina Entrega Demo',
    'cliente-demo-entrega@meucosechas.com',
    '+5521988887777',
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
    demo_user_id,
    'Demo Entregador',
    'Bloco 4',
    'Sala 812',
    'Entregar na recepcao do andar',
    false
  )
  returning id into demo_address_id;

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
    points_earned,
    notes,
    created_at
  )
  values (
    demo_user_id,
    35.90,
    40.90,
    'machine',
    'pay_on_delivery',
    'ready',
    'delivery',
    demo_address_id,
    '7362',
    now() - interval '18 minutes',
    now() - interval '12 minutes',
    now() - interval '2 minutes',
    0,
    '[demo-entregador]',
    now() - interval '22 minutes'
  )
  returning id into demo_order_id;

  insert into public.order_items (order_id, product_id, product_name, size_label, base, unit_price, quantity, notes)
  values (
    demo_order_id,
    'demo-acai-delivery',
    'Acai Premium',
    'G',
    'Acai tradicional',
    35.90,
    1,
    'Sem granola'
  )
  returning id into demo_item_id;

  insert into public.order_item_extras (order_item_id, extra_id, extra_name, extra_price)
  values
    (demo_item_id, 'banana', 'Banana', 0),
    (demo_item_id, 'leite-po', 'Leite em po', 2.50);
end $$;
