-- ==========================================================
-- CINEVA: STREAM WITH COMFORTABLE
-- Complete Supabase Database Schema
-- ==========================================================

-- 1. Table for Admin Users (Normal table, NOT auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disallow anon client access to admin_users"
  ON public.admin_users
  FOR ALL
  USING (false);

-- 2. Table for Viewers / Penonton
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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disallow anon client direct access to users"
  ON public.users
  FOR ALL
  USING (false);

-- 3. Table for Movies (Film)
CREATE TABLE IF NOT EXISTS public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  short_description TEXT,
  poster_url TEXT NOT NULL,
  backdrop_url TEXT NOT NULL,
  trailer_url TEXT,
  video_url TEXT NOT NULL,
  qualities JSONB DEFAULT '[]'::jsonb,
  release_year INT NOT NULL DEFAULT 2026,
  duration INT NOT NULL DEFAULT 90,
  genres TEXT[] NOT NULL DEFAULT '{}',
  cast_members TEXT[] NOT NULL DEFAULT '{}',
  director VARCHAR(255) DEFAULT 'Prima Wisnu',
  rating NUMERIC(3, 1) DEFAULT 9.0,
  maturity_rating VARCHAR(10) DEFAULT '13+',
  languages TEXT[] DEFAULT '{"Bahasa Indonesia", "English"}',
  subtitles JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT true,
  trending BOOLEAN DEFAULT true,
  is_original BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to movies
CREATE POLICY "Allow public read access to movies"
  ON public.movies
  FOR SELECT
  USING (true);

-- 4. Table for Series (Serial TV)
CREATE TABLE IF NOT EXISTS public.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  short_description TEXT,
  poster_url TEXT NOT NULL,
  backdrop_url TEXT NOT NULL,
  trailer_url TEXT,
  release_year INT NOT NULL DEFAULT 2026,
  genres TEXT[] NOT NULL DEFAULT '{}',
  cast_members TEXT[] NOT NULL DEFAULT '{}',
  creator VARCHAR(255) DEFAULT 'Prima Wisnu',
  rating NUMERIC(3, 1) DEFAULT 9.0,
  maturity_rating VARCHAR(10) DEFAULT '16+',
  languages TEXT[] DEFAULT '{"Bahasa Indonesia", "English"}',
  subtitles JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT true,
  trending BOOLEAN DEFAULT true,
  is_original BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to series"
  ON public.series
  FOR SELECT
  USING (true);

-- 5. Table for Seasons
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID REFERENCES public.series(id) ON DELETE CASCADE,
  season_number INT NOT NULL DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seasons"
  ON public.seasons
  FOR SELECT
  USING (true);

-- 6. Table for Episodes
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
  series_slug VARCHAR(255) NOT NULL,
  episode_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  qualities JSONB DEFAULT '[]'::jsonb,
  duration INT NOT NULL DEFAULT 45,
  subtitles JSONB DEFAULT '[]'::jsonb,
  release_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to episodes"
  ON public.episodes
  FOR SELECT
  USING (true);

-- 7. Table for Categories (Home Rails)
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content_type VARCHAR(50) DEFAULT 'all',
  sort_order INT DEFAULT 1,
  visibility BOOLEAN DEFAULT true,
  content_slugs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- 8. Seed initial Administrator
-- Password 'Cineva@99' is hashed with bcrypt
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

-- 9. Seed default Category Rails
INSERT INTO public.categories (id, title, slug, description, content_type, sort_order, visibility, content_slugs)
VALUES
  ('cat-featured', 'Featured & Trending Now', 'featured-trending', 'Sorotan film dan serial pilihan terpopuler minggu ini', 'all', 1, true, '{}'),
  ('cat-originals', 'Cineva Originals & Productions', 'cineva-originals', 'Karya sinematik orisinal dan produksi pilihan', 'all', 2, true, '{}'),
  ('cat-movies', 'Film Layar Lebar', 'feature-movies', 'Koleksi film panjang pilihan dengan kualitas sinematik', 'movie', 3, true, '{}'),
  ('cat-series', 'Serial TV & Drama', 'popular-series', 'Petualangan multi-episode dan serial drama terbaik', 'series', 4, true, '{}')
ON CONFLICT (id) DO NOTHING;
