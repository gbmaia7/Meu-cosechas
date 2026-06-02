do $$
declare
  store_user_id uuid;
  store_email text := 'loja@meucosechas.com';
  store_password text := 'loja123456';
begin
  select id into store_user_id
  from auth.users
  where email = store_email
  limit 1;

  if store_user_id is null then
    store_user_id := gen_random_uuid();

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
      store_user_id,
      'authenticated',
      'authenticated',
      store_email,
      crypt(store_password, gen_salt('bf', 10)),
      now(),
      '',
      '',
      '',
      '',
      '',
      '',
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      jsonb_build_object('sub', store_user_id::text, 'name', 'Loja Cosechas', 'email_verified', true),
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
      store_user_id::text,
      store_user_id,
      jsonb_build_object('sub', store_user_id::text, 'email', store_email, 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    );
  else
    update auth.users
    set
      encrypted_password = crypt(store_password, gen_salt('bf', 10)),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      confirmation_token = '',
      recovery_token = '',
      email_change_token_new = '',
      email_change = '',
      email_change_token_current = '',
      reauthentication_token = '',
      raw_user_meta_data = jsonb_build_object('sub', store_user_id::text, 'name', 'Loja Cosechas', 'email_verified', true),
      updated_at = now()
    where id = store_user_id;
  end if;

  insert into public.profiles (
    id,
    name,
    email,
    phone_verified,
    role,
    is_active
  )
  values (
    store_user_id,
    'Loja Cosechas',
    store_email,
    true,
    'store',
    true
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    role = excluded.role,
    is_active = true,
    updated_at = now();
end $$;
