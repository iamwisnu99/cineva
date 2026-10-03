-- ==========================================================
-- CINEVA: STREAM WITH COMFORTABLE
-- Supabase Schema for Custom Admin Users (Normal Table)
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

-- 2. Enable Row Level Security (RLS) for extra safety
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Deny public/anon read access from client side
-- Only Server-Side API using Service Role can query/manage this table!
CREATE POLICY "Disallow anon client access"
  ON public.admin_users
  FOR ALL
  USING (false);

-- 4. Seed initial Administrator: Prima Wisnu
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
-- SELECT id, nama, email, role, created_at FROM public.admin_users;
