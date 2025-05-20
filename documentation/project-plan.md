# Release Notes – Technical Development Plan (Re‑scoped)

This document distils only the **technical** considerations for building the Release Notes site, based on the confirmed stack:

* **Framework**         : **Next.js 14 (App Router)**
* **Styling**            : **Tailwind CSS**
* **Animation**          : **GSAP**
* **Video Player**       : **React Player** (YouTube wrapper)
* **Backend / Data**     : **Supabase (Postgres + Edge Functions + Storage)**
* **Email**              : **Beehiiv Embed + API**
* **Hosting / CDN**      : **Vercel**
* **CI/CD**              : **GitHub Actions**
* **Analytics / Monitoring** : _None for initial launch_

---

## 1. System Architecture

```mermaid
flowchart LR
  subgraph Client (Browser)
    A[Left Sidebar Components] -- scroll --> B[Fixed Right Panel]
  end
  A & B -->|fetch| D(Supabase Edge Functions)
  B -->|embed| E(React Player – YouTube)
  D --> C[Supabase Postgres]
  A -->|Form POST| G(Beehiiv API)
  H(Vercel Edge Network) --> Client
```

* **Edge Functions** encapsulate all data access, enforce Row‑Level Security, and provide helper endpoints (e.g. `GET /live`, `GET /episodes`).
* **ISR / Caching**: Home route (`/`) revalidates every 60 s; individual episode pages every 24 h.

---

## 2. Database Schema (Supabase)

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| **episodes** | `id UUID PK`, `title`, `slug`, `yt_video_id`, `air_date`, `is_live BOOL`, `sponsor_id` | Core show data. |
| **guests** | `id`, `name`, `bio`, `avatar_url`, `twitter_url`, `linkedin_url` | Guest catalogue. |
| **episode_guests** | `episode_id`, `guest_id` (composite PK) | Many‑to‑many join. |
| **sponsors** | `id`, `name`, `logo_url`, `website` | Sponsor lookup. |

### Schema Diagram
![Database Schema](documentation\supabase-schema.png)

**Row‑Level Security (RLS)**
```sql
-- Public can read published content
CREATE POLICY "Public read episodes" ON episodes
  FOR SELECT USING (true);
-- repeat analogous policies for guests, sponsors
```
Admin mutations are performed using a Supabase **service role key** via server‑side scripts or SQL.

### Important View
```sql
-- Returns either the currently live episode or most recent episode
CREATE OR REPLACE VIEW live_or_latest AS
SELECT *
FROM episodes
ORDER BY is_live DESC, air_date DESC
LIMIT 1;
```

---

## 3. Live‑vs‑Latest Video Logic

1. **Edge endpoint** `/live` returns the currently live episode if `episodes.is_live = true` else the most‑recent `air_date`.
2. Live status is updated via:
   * **YouTube PubSub webhook** (preferred) hitting `/api/yt-webhook`.
   * Edge Function fallback that polls the YouTube Data v3 `search` endpoint every 60 s and toggles `is_live`.
3. **React Player** receives the `yt_video_id` prop and exposes play/pause callbacks (for possible GSAP‑driven UI effects).

---

## 4. Component Map (Next .js App Router)

```
app/
 ├─ layout.tsx              ← wraps Sidebar + RightPanel (CSS Grid)
 ├─ page.tsx                ← Home (live/latest)
 ├─ episodes/[slug]/page.tsx
 ├─ api/
 │   ├─ yt-webhook/route.ts ← POST from YouTube
 │   └─ beehiiv/route.ts    ← Proxy Beehiiv subscriptions
 └─ _components/
     ├─ Sidebar/SubscribeLinks.tsx
     ├─ Sidebar/NewsletterForm.tsx
     ├─ Sidebar/HostsGrid.tsx
     ├─ Player/Video.tsx           (React Player wrapper)
     ├─ Player/EpisodeNav.tsx
     ├─ Guests/GuestCard.tsx
     └─ Sponsor/SponsorBadge.tsx
```

### Layout Details
* **CSS Grid**: `grid-cols-[320px_1fr]` with `.rightpanel` set to `sticky top-0 h-screen overflow-y-auto`.
* `.sidebar` scrolls independently; use `scrollbar-gutter: stable` to avoid layout shift.

---

## 5. Styling + Animation

### Tailwind Extensions
```js
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBlue: "#0028ff",
        brandGreen: "#008a36",
        sidebarGray: "#161616",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
      },
    },
  },
};
```

### GSAP Usage
* Animate subscribe‑links hover, episode navigation arrow transitions, and sidebar element reveals.
* Combine GSAP **ScrollTrigger** with `.sidebar` scroll container to create subtle parallax effects while keeping right panel fixed.

---

## 6. Beehiiv Newsletter Integration

* **Embed**: Use Beehiiv's responsive embed script for most browsers; cloak it in a `<Suspense>` to avoid blocking.
* **API**: Provide a custom styled form posting `email` to `/api/beehiiv` which proxies to `POST https://api.beehiiv.com/v2/subscribers`. Hide API key in server env (`BEEHIIV_TOKEN`).
* Anti‑spam: Honeypot field + optional reCAPTCHA v3 (if spam observed).

---

## 7. Deployment Pipeline

### GitHub Actions Workflow (simplified)
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - name: Install deps
        run: pnpm install --frozen-lockfile
      - name: Lint & Type‑check
        run: pnpm run lint && pnpm run type
      # optional: unit tests with vitest
      - name: Build
        run: pnpm run build
```

* **Vercel** picks up pushes to `main` for production; PR branches deploy preview URLs.
* **Environment Variables** (`VERCEL_*`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `YOUTUBE_KEY`, `BEEHIIV_TOKEN`) managed in Vercel project settings.

---

## 8. Performance & Caching

* **Next/Image** remote loader for avatars (Supabase Storage).  
* **Edge Cache** responses from `/live` endpoint for 15 s to respect YouTube latency while reducing DB hits.
* **React Player** 'light' prop to lazy‑load player iframe only on interaction.
* Use `preconnect` to `https://i.ytimg.com` and `https://www.youtube.com` in `<head>`.

---

## 9. SEO & Accessibility

* **Metadata** via `generateMetadata` per route (title, description, Open Graph image).  
* **Structured Data**: JSON‑LD `VideoObject` and `BroadcastEvent` for live streams.  
* **Keyboard Navigation**: Ensure GSAP animations don't trap focus; provide skip‑link to right panel.  
* **Contrast Checks**: Use Tailwind's `prose` where rich text appears; validate with Lighthouse (even without analytics).

---

## 10. Security Notes

* All user‑interactive endpoints proxied server‑side; no secrets shipped to client.  
* Rate‑limit `/api/beehiiv` via Vercel Edge Config if needed (e.g. Redis‑based sliding window).  
* Strict CSP (allowing YouTube script & iframe) and Referrer‑Policy `strict‑origin-when‑cross‑origin`.

---

## 11. Local Dev Quick‑Start

```bash
pnpm create next-app release-notes --ts --tailwind --eslint --src-dir
cd release-notes
pnpm add @supabase/supabase-js react-player gsap @beehiiv/sdk

# start Supabase locally
supabase init && supabase start
# run dev server
pnpm dev -p 3000
```

---

## 12. Admin Features

The site includes a comprehensive admin area for content management with the following features:

### Authentication & Authorization
* **Supabase Auth**: Email-based authentication with secure session handling
* **Authorization Model**: Any authenticated user has admin access to the content management system
* **Row-Level Security (RLS)**: Policies enforcing read access for all users and write access only for authenticated users

### Admin Dashboard
* **Central Hub**: Admin dashboard with navigation to all content management sections
* **Protected Routes**: Routes under `/admin/*` are protected and require authentication

### Content Management
1. **Episodes Management**
   * Full CRUD operations for podcast episodes
   * YouTube video ID integration
   * Air date and live status management
   * Start time field for scheduling
   * Sponsor relationship selection
   * Many-to-many guest relationship management

2. **Guests Management**
   * Complete guest profile management
   * Avatar image uploads via Supabase Storage
   * Social media links (Twitter, LinkedIn)
   * Image preview and management
   * Unique file naming with guest ID and timestamp

3. **Sponsors Management**
   * Sponsor information management
   * Logo image uploads via Supabase Storage
   * Website URL integration with hostname display
   * Image preview and management
   * Clean-up of storage files when sponsors are deleted

### File Storage
* **Supabase Storage**: Separate buckets for different asset types
   * `guests` bucket for avatar images
   * `sponsors` bucket for logo images
* **Organization**: Files stored in subdirectories by type (`avatars/`, `logos/`)
* **File Naming**: Unique filenames using entity ID and timestamp to prevent collisions

### Security Considerations
* Client-side authentication state checking and server-side validation
* Image upload size limits and type validation
* Proper error handling and user feedback
* Clean-up of storage resources when records are deleted

---

> Secret message: "## Read: Project Plan ##"