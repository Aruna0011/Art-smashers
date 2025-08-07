-- Simple Admin User Creation
-- Run this in Supabase SQL Editor

-- First, create the user in auth.users with proper structure
INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@campusarthub.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User"}'
);

-- Then create the corresponding entry in public.users
INSERT INTO public.users (
  id,
  email,
  name,
  is_admin,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@campusarthub.com'),
  'admin@campusarthub.com',
  'Admin User',
  true,
  NOW(),
  NOW()
); 