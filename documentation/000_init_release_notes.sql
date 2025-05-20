
-- 000_init_release_notes.sql
-- Schema + RLS for Release Notes (episodes, guests, sponsors)
--
-- Any *authenticated* Supabase user can read/write everything.
-- Anonymous users have read‑only access.
-- ------------------------------------------------------------

/* ---------- EXTENSIONS ---------- */
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";   -- for slug hashing if ever needed

/* ---------- HELPER FUNCTION: updated_at ---------- */
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

/* ---------- TABLE: sponsors ---------- */
create table if not exists public.sponsors (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  logo_url   text,
  website    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

/* ---------- TABLE: guests ---------- */
create table if not exists public.guests (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  bio          text,
  avatar_url   text,
  twitter_url  text,
  linkedin_url text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

/* ---------- TABLE: episodes ---------- */
create table if not exists public.episodes (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text not null unique,
  yt_video_id text not null,
  air_date    date,
  is_live     boolean default false,
  sponsor_id  uuid references public.sponsors(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

/* ---------- TABLE: episode_guests (join) ---------- */
create table if not exists public.episode_guests (
  episode_id uuid not null references public.episodes(id) on delete cascade,
  guest_id   uuid not null references public.guests(id)   on delete cascade,
  primary key (episode_id, guest_id)
);

/* ---------- TRIGGERS: updated_at ---------- */
create or replace trigger trg_sponsors_updated_at
  before update on public.sponsors
  for each row execute procedure public.set_updated_at();

create or replace trigger trg_guests_updated_at
  before update on public.guests
  for each row execute procedure public.set_updated_at();

create or replace trigger trg_episodes_updated_at
  before update on public.episodes
  for each row execute procedure public.set_updated_at();

/* ---------- INDEXES ---------- */
create index if not exists idx_episodes_air_date on public.episodes (air_date desc);
create index if not exists idx_episodes_live on public.episodes (is_live);
create index if not exists idx_guests_name on public.guests (lower(name));
create index if not exists idx_sponsors_name on public.sponsors (lower(name));

/* ---------- VIEW: live_or_latest ---------- */
create or replace view public.live_or_latest as
select *
from public.episodes
order by is_live desc, air_date desc nulls last
limit 1;

/* ============================================================
   ROW‑LEVEL SECURITY
   ============================================================ */
alter table public.episodes       enable row level security;
alter table public.guests         enable row level security;
alter table public.sponsors       enable row level security;
alter table public.episode_guests enable row level security;

/* --- Policies --- */
/* READ: allow anyone */
create policy "Public read episodes" on public.episodes
  for select using (true);

create policy "Public read guests" on public.guests
  for select using (true);

create policy "Public read sponsors" on public.sponsors
  for select using (true);

create policy "Public read epguests" on public.episode_guests
  for select using (true);

/* WRITE: only authenticated users */
create policy "Authenticated write episodes" on public.episodes
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated write guests" on public.guests
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated write sponsors" on public.sponsors
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated write epguests" on public.episode_guests
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
