# CINEVA — Website Streaming Platform Prompt

## Project Identity

Build a premium streaming website named:

# Cineva
### Stream with Comfortable

Cineva is an original streaming platform for films and series created and published by the owner of the platform. The catalog may include AI-generated animated films, AI-assisted series, original short films, experimental projects, and future original productions.

The product should feel like a real commercial streaming service, not a generic video gallery.

The visual direction should combine the best usability and presentation patterns associated with **Prime Video** and **Netflix**, while maintaining a distinct Cineva identity. Do not copy proprietary branding, logos, artwork, or exact layouts.

---

# 1. Core Product Goals

Create a responsive streaming platform that supports:

- Movies
- Series
- Seasons
- Episodes
- Genres
- Categories
- Featured content
- Continue Watching
- Watchlist
- Search
- Content details
- Video playback
- Subtitle selection
- Multiple subtitle languages
- Responsive mobile, tablet, and desktop layouts
- Admin/content-management architecture that can be expanded later
- External video hosting so the application server does not proxy large video files

The most important principle:

> **Vercel should handle the website and lightweight serverless/API operations, NOT act as the video storage or video streaming server.**

Never download an entire video through a Vercel Function and then pipe it to the viewer.

---

# 2. Visual Design Direction

Create a premium dark streaming interface inspired by the general UX patterns of Netflix and Prime Video.

## Visual characteristics

- Dark cinematic background
- Near-black / charcoal surfaces
- White primary typography
- Muted gray secondary text
- One restrained Cineva accent color
- Large cinematic hero banners
- Poster cards
- Landscape thumbnail cards
- Rounded but not excessively pill-shaped components
- Subtle gradients
- Subtle shadows
- Smooth hover states
- Elegant transitions
- Strong visual hierarchy
- Large artwork
- Minimal UI clutter
- Professional typography
- High contrast
- Comfortable spacing

Avoid:

- Excessive neon
- Excessive glassmorphism
- Excessive gradients
- Giant unnecessary animations
- Cluttered dashboards
- Generic SaaS appearance
- Excessive rounded cards
- Overly colorful interfaces
- Heavy 3D effects
- Anything that makes the site feel like a template

The interface should feel cinematic, mature, and premium.

---

# 3. Brand

Brand name:

**Cineva**

Tagline:

**Stream with Comfortable**

The tagline should appear naturally in the landing/hero experience without dominating the interface.

Create a simple modern Cineva wordmark/logo treatment that works on dark backgrounds.

Do not imitate Netflix's logo or Prime Video's logo.

---

# 4. Homepage

Design the homepage as a premium streaming discovery experience.

Recommended structure:

## Header

Desktop:

- Cineva logo
- Home
- Movies
- Series
- Genres
- Search
- Watchlist
- Profile

Mobile:

- Cineva logo
- Search
- Profile/menu

Keep the navigation compact and unobtrusive.

The header can become semi-transparent or slightly darker while scrolling.

---

# 5. Hero Section

Create a large cinematic hero area.

The hero should support:

- Backdrop image
- Movie/series title
- Short description
- Release year
- Age rating
- Duration for movies
- Season/episode information for series
- Genre
- "Watch Now" button
- "More Info" button
- Optional trailer button

Use a dark gradient overlay so text remains readable.

The hero should support rotating featured content in the future, but avoid excessive automatic animation.

Provide accessible controls and respect reduced-motion preferences.

---

# 6. Content Categories

The platform MUST distinguish clearly between:

## Movies

Examples:

- Trending Movies
- Latest Movies
- Featured Movies
- Action
- Animation
- Adventure
- Comedy
- Drama
- Sci-Fi
- Fantasy
- Horror
- Short Films

## Series

Examples:

- Trending Series
- Latest Series
- Featured Series
- New Episodes
- Animation Series
- Action Series
- Sci-Fi Series
- Fantasy Series
- Drama Series

The category architecture must be data-driven.

Do not hard-code category sections into the UI.

Each category should be able to contain:

- Title
- Description
- Content type
- Sorting order
- Visibility
- Content references

The admin/content layer should later be able to reorder categories without rewriting frontend components.

---

# 7. Content Cards

Create premium streaming cards.

Movie card:

- Poster
- Title
- Release year
- Genre
- Runtime
- Optional rating
- Hover preview area
- Quick watch button
- Add to watchlist button

Series card:

- Poster
- Title
- Release year
- Number of seasons
- Genre
- Optional rating
- Quick watch button
- Add to watchlist button

Desktop hover:

- Slight scale
- Elevated z-index
- Dark information panel
- Short description
- Watch button
- Watchlist button

Do not make hover effects so large that neighboring cards become difficult to use.

Mobile must use tap-friendly controls instead of relying on hover.

---

# 8. Movie Detail Page

Create a cinematic movie detail page.

Include:

- Large backdrop
- Poster
- Title
- Description
- Release year
- Runtime
- Genres
- Rating
- Director
- Cast
- Languages
- Subtitle availability
- Watch Now
- Add to Watchlist
- Trailer
- Related movies

Example structure:

```text
[Backdrop]

[Poster]   MOVIE TITLE
           2026 • 1h 42m • Animation
           Action • Adventure • Sci-Fi

           Description...

           [Watch Now] [Watchlist]

           Cast
           Director
           Languages
           Subtitles

More Like This
[card] [card] [card] [card]
```

---

# 9. Series Detail Page

Series must be treated differently from movies.

Include:

- Backdrop
- Poster
- Title
- Description
- Release year
- Genre
- Number of seasons
- Number of episodes
- Watch button
- Watchlist
- Season selector
- Episode list

Example:

```text
SERIES TITLE

Description...

[Play] [Watchlist]

Season 1 ▼

Episode 1
Episode title
Short description
Duration
[Play]

Episode 2
Episode title
Short description
Duration
[Play]
```

Episode cards should display:

- Episode number
- Episode title
- Thumbnail
- Duration
- Short description
- Watched/progress indicator

---

# 10. Video Player

Create a custom premium video player.

The player should support:

- Play/pause
- Seek
- Volume
- Fullscreen
- Picture-in-picture where supported
- Playback speed
- Quality selection when multiple qualities exist
- Subtitle/caption selection
- Keyboard shortcuts
- Continue watching
- Progress saving

Recommended controls:

```text
[Play] [Back 10s] [Forward 10s] [Progress]

[Volume]              [CC] [Quality] [Speed] [PiP] [Fullscreen]
```

The player must work well on:

- Desktop
- Android
- iOS
- Tablet

---

# 11. Subtitle System

Subtitle support is REQUIRED.

Prefer browser-native WebVTT subtitles.

Example:

```html
<track
  kind="subtitles"
  src="/subtitles/movie-en.vtt"
  srclang="en"
  label="English"
  default
/>
```

The data model should support multiple subtitles:

```json
{
  "subtitles": [
    {
      "language": "id",
      "label": "Bahasa Indonesia",
      "src": "https://example.com/movie-id.vtt"
    },
    {
      "language": "en",
      "label": "English",
      "src": "https://example.com/movie-en.vtt"
    }
  ]
}
```

Support:

- Indonesian
- English
- Future languages

Subtitle URLs should be configurable per movie or episode.

Do not hard-code subtitle paths into player components.

---

# 12. Video Hosting Architecture

IMPORTANT:

Do not use Vercel as the primary video file host.

Do not create a Vercel Serverless Function that downloads an entire MP4 and streams it to users.

The architecture should be:

```text
User Browser
     |
     | HTTPS
     v
Cineva Frontend
     |
     +------> Vercel Functions
     |          |
     |          +--> Metadata/API
     |          +--> Search
     |          +--> Watch progress
     |          +--> Lightweight business logic
     |
     +------> External Video Storage/CDN
                |
                +--> Video
                +--> Subtitle
                +--> Thumbnail
                +--> Poster
```

The browser should request the video directly from the external storage/CDN.

Vercel should only provide metadata and lightweight application logic.

---

# 13. Recommended Video Storage Strategy

The implementation should support configurable external video providers.

Do NOT assume Google Drive is a production CDN.

Google explicitly states that using Drive as a replacement for a large-scale CDN is not allowed. Google Drive also has API quotas and download limitations.

Therefore, structure the application so that the video provider can be changed without rewriting the player.

Recommended provider abstraction:

```ts
interface VideoProvider {
  getVideoUrl(contentId: string): Promise<string>;
  getSubtitleUrl(contentId: string, language: string): Promise<string>;
}
```

The frontend should receive a playable URL or streaming manifest from the provider.

---

# 14. Preferred Low-Cost Architecture

For a small personal Cineva project, prefer an architecture such as:

```text
Frontend:
Next.js / React
        |
        v
Vercel
        |
        +--> Serverless Functions
        |
        +--> Database

Video:
Object Storage / Video CDN
        |
        +--> Direct browser playback
```

A suitable object-storage option can be Cloudflare R2 because it does not charge egress bandwidth, although storage and request charges still exist beyond the included free tier.

Do not claim that the entire platform is permanently "100% free".

Instead:

> Design the application to minimize recurring infrastructure cost and remain within free or low-cost tiers during small-scale usage.

The application should make provider URLs configurable through environment variables.

---

# 15. Video Format Strategy

For the initial MVP, support:

- MP4
- H.264 video
- AAC audio
- WebVTT subtitles

The architecture should be prepared for future HLS support:

```text
master.m3u8
  |
  +-- 1080p
  +-- 720p
  +-- 480p
```

If HLS is implemented, the player should select the appropriate quality based on network conditions.

Do not implement expensive video transcoding on Vercel Functions.

---

# 16. Performance Requirements

Performance is extremely important.

The website must be:

- Fast
- Responsive
- Lazy-loaded
- Image optimized
- Lightweight
- Mobile friendly

Use:

- Next.js image optimization where appropriate
- Lazy loading
- Responsive images
- Poster thumbnails
- Proper caching
- Code splitting
- Dynamic imports
- Minimal client-side JavaScript
- Server Components where appropriate
- CDN-delivered assets
- Avoid unnecessary API requests

Do not load every movie poster on the homepage immediately.

Use horizontal content rails with lazy loading.

---

# 17. Data Model

Design a clean content model.

## Movie

```ts
Movie {
  id
  type: "movie"
  title
  slug
  description
  posterUrl
  backdropUrl
  trailerUrl
  videoUrl
  releaseYear
  duration
  genres[]
  cast[]
  director
  rating
  maturityRating
  languages[]
  subtitles[]
  featured
  trending
  createdAt
  updatedAt
}
```

## Series

```ts
Series {
  id
  type: "series"
  title
  slug
  description
  posterUrl
  backdropUrl
  trailerUrl
  releaseYear
  genres[]
  cast[]
  creator
  rating
  maturityRating
  languages[]
  subtitles[]
  seasons[]
  featured
  trending
  createdAt
  updatedAt
}
```

## Season

```ts
Season {
  id
  seriesId
  seasonNumber
  title
  description
  episodes[]
}
```

## Episode

```ts
Episode {
  id
  seasonId
  episodeNumber
  title
  description
  thumbnailUrl
  videoUrl
  duration
  subtitles[]
  releaseDate
}
```

---

# 18. Watch Progress

Implement watch progress.

Store:

```ts
{
  userId,
  contentId,
  episodeId,
  progressSeconds,
  durationSeconds,
  updatedAt
}
```

Homepage should show:

## Continue Watching

Each card should display a progress bar.

Example:

```text
Continue Watching

[Movie]
██████████░░░░

[Series Episode]
██████░░░░░░░░
```

When the user opens the video, resume from the previous position.

---

# 19. Watchlist

Users should be able to:

- Add movie
- Remove movie
- Add series
- Remove series
- View Watchlist

Watchlist should have filters:

- All
- Movies
- Series

---

# 20. Search

Create fast search.

Search should support:

- Movie title
- Series title
- Episode title
- Genre
- Actor/cast
- Director/creator

Provide search suggestions.

Example:

```text
Search Cineva

[ Interstellar ]

Movies
[poster] ...

Series
[poster] ...
```

---

# 21. Genre System

Genres should be reusable tags.

Example:

```text
Action
Adventure
Animation
Comedy
Drama
Fantasy
Horror
Mystery
Romance
Sci-Fi
Thriller
```

The UI should allow:

```text
Browse
  ├── Movies
  ├── Series
  ├── Animation
  ├── Action
  ├── Sci-Fi
  └── Fantasy
```

Do not duplicate content records simply because they belong to multiple categories.

Use relationships/tags.

---

# 22. Admin-Friendly Content Architecture

Even if a full admin dashboard is not implemented in the first version, structure the project so an admin panel can later manage:

- Movies
- Series
- Seasons
- Episodes
- Categories
- Genres
- Featured content
- Trending content
- Video URLs
- Subtitle URLs
- Posters
- Backdrops
- Trailers

The content layer should be database-driven.

Do not hard-code movie titles into React components.

---

# 23. Content Provider Configuration

Video sources must be configurable.

Example:

```env
VIDEO_PROVIDER=r2
VIDEO_CDN_BASE_URL=
SUBTITLE_CDN_BASE_URL=
```

Possible future providers:

```text
Cloudflare R2
Bunny Stream
Cloudinary
Mux
Other compatible object storage/CDN
```

The UI should not care which provider is being used.

---

# 24. Security

Do not expose secret credentials in client-side code.

Never put:

```text
API_SECRET
SERVICE_ROLE_KEY
PRIVATE_TOKEN
DATABASE_ADMIN_KEY
```

inside browser JavaScript.

Use environment variables on the server.

If signed video URLs are implemented:

```text
Browser
   |
   v
Vercel Function
   |
   v
Generate short-lived signed URL
   |
   v
Video CDN
```

Do not expose storage credentials to users.

---

# 25. SEO

Every movie and series should have its own SEO-friendly URL.

Examples:

```text
/movie/example-movie
/series/example-series
/series/example-series/season-1
/series/example-series/season-1/episode-1
```

Generate:

- Dynamic title
- Meta description
- Open Graph image
- Twitter/X card
- Structured metadata where appropriate

---

# 26. Accessibility

Implement:

- Keyboard navigation
- Visible focus states
- Accessible buttons
- Proper aria labels
- Subtitle/caption controls
- Sufficient contrast
- Reduced motion support
- Screen-reader friendly navigation

The player must remain usable without a mouse.

---

# 27. Responsive Design

Desktop:

- Large cinematic hero
- Multiple content rails
- 5–7 cards depending on viewport width

Tablet:

- Reduced card size
- Compact navigation
- 3–5 cards

Mobile:

- 2–3 cards depending on width
- Horizontal scrolling rails
- Compact hero
- Touch-friendly buttons
- Bottom navigation or compact menu if useful

Never allow horizontal overflow on the entire page.

---

# 28. Premium Streaming UI Details

Include subtle details such as:

- Skeleton loaders
- Smooth image loading
- Fade-in artwork
- Hover previews where practical
- Progress indicators
- "New" badges
- "Featured" badges
- Season/episode labels
- Continue Watching progress
- Recently Added
- Recommended content
- Similar content

Animations must remain subtle.

Performance always takes priority over decorative animation.

---

# 29. Homepage Example

Structure:

```text
CINEVA
Stream with Comfortable

[HOME] [MOVIES] [SERIES] [GENRES] [SEARCH] [WATCHLIST]

--------------------------------------------------

        HERO BACKDROP

        THE LAST SIGNAL

        2026 • 1h 48m • Sci-Fi • 13+

        Humanity received one final signal...

        [▶ WATCH NOW] [＋ WATCHLIST]

--------------------------------------------------

Continue Watching
[Card] [Card] [Card] [Card]

Trending Movies
[Card] [Card] [Card] [Card] [Card]

Popular Series
[Card] [Card] [Card] [Card] [Card]

New Releases
[Card] [Card] [Card] [Card] [Card]

Animation
[Card] [Card] [Card] [Card] [Card]

Sci-Fi
[Card] [Card] [Card] [Card] [Card]
```

---

# 30. Landing Experience

If the user is not logged in, the homepage can still show public content.

Include:

- Hero
- Featured movies
- Featured series
- Genres
- Original content
- About Cineva
- Sign in
- Create account

Do not force authentication merely to browse the catalog unless there is a deliberate product requirement.

---

# 31. Authentication

Prepare for:

- Email/password
- OAuth providers
- Session management
- User profile
- Watchlist
- Watch history
- Continue Watching

Authentication should be separated from content delivery.

A user login must NOT be required for direct public video delivery unless the content is intentionally private.

---

# 32. Database

Use a database suitable for serverless applications.

Preferred architecture:

```text
Next.js
   |
Vercel Functions
   |
Database
```

The database stores metadata, not large video files.

Never store MP4 files inside the database.

---

# 33. Cost-Control Rules

The project must follow these rules:

1. Never proxy video through Vercel Functions.
2. Never store large video files in the Git repository.
3. Never store video blobs in the database.
4. Never fetch the entire video server-side before playback.
5. Use direct CDN/object-storage URLs.
6. Cache metadata aggressively where appropriate.
7. Minimize API requests.
8. Use lazy loading.
9. Use optimized thumbnails.
10. Keep serverless functions lightweight.
11. Avoid unnecessary background jobs.
12. Make the video provider replaceable.
13. Provide graceful handling for provider errors and quota limits.
14. Never promise unlimited free bandwidth.

---

# 34. Google Drive Fallback

If Google Drive is used during early private testing:

- Treat it as a temporary/testing storage option.
- Do not architect Cineva around Google Drive as a public CDN.
- Keep the video provider abstraction intact.
- Do not use Vercel Functions as a video proxy.
- Expect quota/rate limitations.
- Provide a clear migration path to proper object storage/CDN.

The production architecture should not depend on Google Drive.

---

# 35. Error States

Create polished error states for:

- Video unavailable
- Subtitle unavailable
- Network error
- CDN error
- Content removed
- Episode unavailable
- Authentication failure
- Search failure
- Empty watchlist
- No search results

Example:

```text
We couldn't play this title.

The video service is temporarily unavailable.
Please try again later.

[Try Again]
```

Do not expose raw server errors to users.

---

# 36. Loading States

Create skeletons for:

- Hero
- Movie cards
- Series cards
- Detail page
- Episode list
- Search results

Avoid a blank white/dark screen while data loads.

---

# 37. Project Structure

Prefer a clean structure such as:

```text
app/
  page.tsx
  movies/
  series/
  genres/
  search/
  watchlist/
  watch/
  api/

components/
  navigation/
  hero/
  cards/
  rails/
  player/
  subtitles/
  search/
  watchlist/
  loading/
  errors/

lib/
  db/
  auth/
  video/
  subtitles/
  search/
  metadata/

types/
  movie.ts
  series.ts
  episode.ts
  user.ts

public/
  icons/
  placeholder/
```

Use reusable components.

Do not create giant monolithic components.

---

# 38. Technology Preference

Preferred stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel
- Serverless Functions
- PostgreSQL-compatible serverless database
- External object storage/CDN for video
- WebVTT subtitles

Use modern stable libraries.

Avoid unnecessary dependencies.

---

# 39. Important Architecture Principle

Separate these three responsibilities:

### Application Layer

Handles:

- UI
- Authentication
- Metadata
- Search
- Watchlist
- Watch progress
- Business logic

Hosted on:

**Vercel**

### Database Layer

Handles:

- Movie metadata
- Series metadata
- Episodes
- Users
- Watchlist
- Watch progress

Hosted on:

**Serverless database**

### Media Delivery Layer

Handles:

- Video
- Subtitle
- Poster
- Backdrop
- Thumbnail

Hosted on:

**Object storage / video CDN**

The browser should communicate directly with the media delivery layer whenever possible.

---

# 40. Final UI Requirement

The final result should look like a legitimate premium streaming service.

The visual impression should be:

> Netflix-style content discovery + Prime Video-style information density + Cineva's own identity.

It should NOT look like:

- A YouTube clone
- A generic React template
- A SaaS dashboard
- A basic HTML video gallery
- An AI-generated website template
- A developer portfolio

The user should immediately understand:

> "This is a streaming platform."

---

# 41. Demo Content

Populate the initial interface with fictional/demo content.

Do not use copyrighted movie posters, logos, or copyrighted promotional artwork in a way that implies Cineva owns them.

Use original placeholders or generated/demo artwork.

Example demo titles:

- The Last Signal
- Echoes of Aether
- Beyond Tomorrow
- Neon Horizon
- The Forgotten Orbit
- Chronicle of Veyra
- Project Aurora

Create fictional descriptions.

---

# 42. Development Priorities

Prioritize implementation in this order:

1. Overall streaming UI
2. Homepage
3. Movie catalog
4. Series catalog
5. Movie detail
6. Series detail
7. Episode system
8. Video player
9. Subtitle system
10. Search
11. Watchlist
12. Continue Watching
13. Authentication
14. Database integration
15. External video provider
16. Performance optimization
17. SEO
18. Accessibility
19. Error handling
20. Future admin architecture

Do not sacrifice performance for visual effects.

---

# 43. Acceptance Criteria

The project is successful when:

- Cineva clearly feels like a premium streaming service.
- Movies and Series have distinct catalog experiences.
- Categories can be dynamically managed.
- Movie detail pages work.
- Series detail pages work.
- Seasons and episodes work.
- Video playback works through an external media provider.
- Subtitles work through WebVTT.
- Watch progress can resume playback.
- Watchlist works.
- Search works.
- Mobile experience is polished.
- Desktop experience is polished.
- Vercel Functions are never used to proxy entire video files.
- Video storage is external to the application server.
- Video provider can be changed without rebuilding the entire architecture.
- Secrets are never exposed client-side.
- The site remains performant with a growing catalog.
- The design is original and only takes broad UX inspiration from established streaming platforms.

---

# Final Instruction to the Coding Agent

Build Cineva as a production-minded streaming platform, not a static mockup.

Use realistic component architecture, reusable data models, responsive layouts, loading/error states, accessibility, SEO, and performance optimization.

Prioritize a polished cinematic experience while keeping infrastructure lightweight.

Most importantly:

**Vercel is the application platform, not the video CDN.**

Design the media layer so that videos can be served directly from an external object-storage/CDN provider, with Google Drive treated only as a temporary testing option rather than the production streaming backend.

Brand:

# Cineva
### Stream with Comfortable
