-- ==========================================================
-- CINEVA: STREAM WITH COMFORTABLE
-- Supabase Schema for Database Tables
-- ==========================================================

-- 1. Create table for Admin Users (Normal table, NOT auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Deny public/anon read access from client side
CREATE POLICY "Disallow anon client access"
  ON public.admin_users
  FOR ALL
  USING (false);

-- 2. Create table for Viewers / Penonton
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  otp_code VARCHAR(10),
  otp_expires_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for viewers
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disallow anon client direct access to users"
  ON public.users
  FOR ALL
  USING (false);

-- 3. Seed initial Administrator
-- Password 'Cineva@99' is hashed with bcrypt (cost factor 10)
-- Hash: $2b$10$mXfUuTQV6yuFgjwgCoo9PeRfQCx5XcZWlsQoKPcFqg5wv3G5Kbfqq
INSERT INTO public.admin_users (nama, email, password, role)
VALUES (
  'Prima Wisnu',
  'primawisnu99@gmail.com',
  '$2b$10$mXfUuTQV6yuFgjwgCoo9PeRfQCx5XcZWlsQoKPcFqg5wv3G5Kbfqq',
  'superadmin'
)
ON CONFLICT (email) 
DO UPDATE SET 
  nama = EXCLUDED.nama,
  password = EXCLUDED.password,
  updated_at = NOW();

-- Verification query:
-- SELECT id, nama, email, is_verified, created_at FROM public.users;
-- SELECT id, nama, email, role, created_at FROM public.admin_users;
