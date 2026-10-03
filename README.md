# 🎬 Cineva — Stream with Comfortable

A cinema-grade streaming platform built for showcasing original independent films, episodic series, AI-assisted animations, and experimental cinematography. Combining the discovery elegance of Netflix with the informational density of Prime Video, Cineva delivers a theater-like streaming experience directly in the browser.

---

## 📖 Overview

Cineva is engineered as an original video-on-demand service designed for creators and personal studios. It offers a complete streaming web ecosystem featuring dedicated movie and series catalogs, multi-season episode browsing, custom HTML5 video playback with WebVTT subtitle tracks, Continue Watching progress resumption, Watchlist curation, instant multi-attribute search, and an authenticated Cineva Studio administration dashboard.

The platform is strictly architected around the principle of lightweight serverless execution: Vercel handles frontend delivery and lightweight metadata APIs, while all video streaming and subtitle assets bypass serverless proxies to stream directly from external Object Storage/CDN providers.

---

## ✨ Key Features

- **Cinematic Discovery Homepage**: Dynamic rotating hero section, category rails with horizontal scroll controls, and real-time continue watching tracking.
- **Movies & Episodic Series Separation**: Distinct catalog routes with dedicated interfaces tailored for standalone feature films and multi-season episodic series.
- **Custom HTML5 Theater Player**: Auto-hiding HUD controls, buffer indicators, 10-second skip shortcuts, speed presets (0.75x–2x), multi-resolution selectors, and full keyboard navigation.
- **WebVTT Subtitle System**: Native browser subtitle tracks supporting Bahasa Indonesia and English with custom cinematic cue styling.
- **Continue Watching with Resume Prompt**: Timestamp tracking saved across playback sessions, with an automatic modal prompt to resume from previous positions.
- **Synchronized Watchlist**: Client-side watchlist management synchronized across browser tabs with category filters and empty states.
- **Fast Search Engine**: Instant querying across movie titles, series names, episode synopses, genres, directors, and actors.
- **Visual Genre Directory**: Categorized collections with automatic media counters and dedicated genre landing pages.
- **Cineva Studio (Admin Control Center)**: Private studio interface to review catalog inventory, publish new titles, inspect category rails, and manage CDN configurations.
- **Dedicated Admin Authentication**: Login protection powered by bcrypt password hashing and a dedicated Supabase PostgreSQL table.

---

## 🏛️ System Architecture

```text
User Browser
     │
     ├── HTTPS (Web App & Metadata) ──────────────────────────┐
     │                                                        ▼
     │                                            Next.js 16 (App Router)
     │                                            Vercel Serverless Functions
     │                                                        │
     │                                                        ▼
     │                                            Supabase Database (PostgreSQL)
     │                                            Table: public.admin_users
     │                                            (Server-side only, zero DevTools leak)
     │
     └── HTTPS Direct Stream (No Server Proxy) ───────────────┐
                                                              ▼
                                                  External Object Storage / CDN
                                                  (Cloudflare R2, Bunny, AWS S3)
                                                  - MP4 / HLS Video Files
                                                  - WebVTT Subtitle Tracks
                                                  - High-Res Posters & Backdrops
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (Custom dark cinema theme)
- **Database**: Supabase PostgreSQL (Standard table architecture)
- **Authentication**: Bcrypt.js password hashing with HMAC SHA-256 HTTP-only session cookies
- **Icons**: Lucide React
- **Video Delivery**: Direct HTML5 media streaming with WebVTT subtitle tracks

---

## 📁 Project Structure

```text
cineva/
├── app/
│   ├── (main)/
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Admin authentication portal
│   │   │   └── page.tsx            # Protected Cineva Studio dashboard
│   │   ├── genres/
│   │   │   ├── [slug]/page.tsx     # Specific genre collection page
│   │   │   └── page.tsx            # Genre directory overview
│   │   ├── movie/[slug]/page.tsx   # Detailed movie presentation
│   │   ├── movies/page.tsx         # Filterable feature films catalog
│   │   ├── search/page.tsx         # Real-time search page
│   │   ├── series/
│   │   │   ├── [slug]/page.tsx     # Multi-season series & episode guide
│   │   │   └── page.tsx            # Episodic series catalog
│   │   ├── watchlist/page.tsx      # Saved watchlist collection
│   │   ├── layout.tsx              # Navbar & Footer wrapper
│   │   └── page.tsx                # Discovery homepage
│   ├── api/
│   │   └── admin/auth/route.ts     # Admin login & logout API endpoints
│   ├── watch/[slug]/page.tsx       # Fullscreen theater player route
│   ├── globals.css                 # Dark theme tokens & scrollbar styling
│   └── layout.tsx                  # Root layout & SEO metadata
├── components/
│   ├── admin/                      # Studio dashboard & login components
│   ├── cards/                      # Interactive media cards with hover previews
│   ├── catalog/                    # Filterable catalog grids & controls
│   ├── detail/                     # Presentation views for movies & series
│   ├── hero/                       # Rotating hero banner with gradient masks
│   ├── navigation/                 # Scroll-adaptive Navbar and Footer
│   ├── player/                     # Custom HTML5 video player with WebVTT
│   ├── rails/                      # Horizontal carousels & Continue Watching
│   ├── search/                     # Instant search input & result grids
│   └── watchlist/                  # Watchlist grid with filter tabs
├── lib/
│   ├── auth/admin.ts               # Server authentication, bcrypt, & session signing
│   ├── data/mockData.ts            # Fictional catalog records & category definitions
│   ├── data/repository.ts          # Data querying layer & category resolvers
│   ├── hooks/                      # Custom hooks for watchlist and progress sync
│   ├── supabase/server.ts          # Server-only Supabase client (zero client exposure)
│   └── video/provider.ts           # External CDN and R2 video provider abstraction
├── public/
│   └── subtitles/                  # WebVTT subtitle files (ID & EN)
├── supabase/
│   └── schema.sql                  # Database table definitions and seed script
└── types/
    └── content.ts                  # TypeScript interfaces for movies, series, & tracks
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18.18 or higher installed on your machine:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cineva.git
   cd cineva
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Launch the local development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

Configure your credentials inside `.env.local`:

```env
# Supabase Configuration (Server-Side ONLY)
# Never prefix with NEXT_PUBLIC_ to guarantee API keys are not visible in DevTools
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Secret key used for signing HTTP-only admin session cookies
ADMIN_SESSION_SECRET=your-secure-random-secret-key

# External Video CDN Configuration
VIDEO_PROVIDER=cdn
VIDEO_CDN_BASE_URL=
SUBTITLE_CDN_BASE_URL=
```

---

## 🗄️ Database Setup

Cineva stores administrator credentials in a custom PostgreSQL table on Supabase rather than the default authentication schema.

1. Open your Supabase project dashboard.
2. Navigate to the SQL Editor.
3. Open and copy the contents of `supabase/schema.sql`.
4. Execute the script to create the table and seed the initial administrator:

```sql
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
CREATE POLICY "Disallow anon client access" ON public.admin_users FOR ALL USING (false);

INSERT INTO public.admin_users (nama, email, password, role)
VALUES (
  'Prima Wisnu',
  'primawisnu99@gmail.com',
  '$2b$10$mXfUuTQV6yuFgjwgCoo9PeRfQCx5XcZWlsQoKPcFqg5wv3G5Kbfqq',
  'superadmin'
)
ON CONFLICT (email) DO NOTHING;
```

---

## 🛡️ Security Implementation

- **Bcrypt Password Encryption**: Admin passwords are never stored in plaintext. They are encrypted using bcrypt with a work factor of 10.
- **SQL Injection Immunization**: Queries to the database are constructed using parameterized query builders, preventing SQL injection vulnerabilities.
- **Zero Client API Key Leakage**: Supabase credentials omit the `NEXT_PUBLIC_` prefix and execute exclusively within server contexts. No keys are exposed in browser network inspection, console output, or client JavaScript bundles.
- **Cryptographic HTTP-Only Sessions**: Successful authentication produces an HMAC SHA-256 signed token stored within an HTTP-only, SameSite cookie, guarding against client-side script tampering and XSS access.
- **Route Authorization Guard**: Unauthenticated requests to `/admin` are automatically redirected to `/admin/login` prior to rendering.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](file:///d:/Files/Code/cineva/LICENSE) for more information.
