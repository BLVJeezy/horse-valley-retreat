
DO $$
DECLARE
  new_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@horsevally.local') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_id,
      'authenticated',
      'authenticated',
      'admin@horsevally.local',
      crypt('horsevally1805', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      false, false
    );
    INSERT INTO public.user_roles (user_id, role) VALUES (new_id, 'admin');
  END IF;
END $$;
