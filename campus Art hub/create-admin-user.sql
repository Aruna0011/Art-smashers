-- Create admin user in Supabase
-- Run this in your Supabase SQL Editor

-- First, create the user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@campusarthub.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User","isAdmin":true}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Then create the corresponding entry in public.users
INSERT INTO public.users (
  id,
  email,
  name,
  phone,
  address,
  is_admin,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@campusarthub.com'),
  'admin@campusarthub.com',
  'Admin User',
  '',
  '',
  true,
  NOW(),
  NOW()
); 