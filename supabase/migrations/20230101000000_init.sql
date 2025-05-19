
-- Release Notes database schema
--
-- Run with: supabase db reset
-- or: psql <db-url> -f 001_release_notes_schema.sql

-- Ensure UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* ---------- Sponsors ---------- */
CREATE TABLE IF NOT EXISTS sponsors (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    logo_url    TEXT,
    website     TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

/* ---------- Episodes ---------- */
CREATE TABLE IF NOT EXISTS episodes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    yt_video_id TEXT NOT NULL,
    air_date    DATE,
    is_live     BOOLEAN DEFAULT FALSE,
    sponsor_id  UUID REFERENCES sponsors(id),
    created_at  TIMESTAMPTZ DEFAULT now()
);

/* ---------- Guests ---------- */
CREATE TABLE IF NOT EXISTS guests (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         TEXT NOT NULL,
    bio          TEXT,
    avatar_url   TEXT,
    twitter_url  TEXT,
    linkedin_url TEXT,
    created_at   TIMESTAMPTZ DEFAULT now()
);

/* ---------- Episode ⇄ Guest (M2M) ---------- */
CREATE TABLE IF NOT EXISTS episode_guests (
    episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    guest_id   UUID NOT NULL REFERENCES guests(id)   ON DELETE CASCADE,
    PRIMARY KEY (episode_id, guest_id)
);

/* ---------- Hosts ---------- */
CREATE TABLE IF NOT EXISTS hosts (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         TEXT NOT NULL,
    bio          TEXT,
    avatar_url   TEXT,
    youtube_url  TEXT,
    twitter_url  TEXT,
    linkedin_url TEXT,
    created_at   TIMESTAMPTZ DEFAULT now()
);

/* ---------- Indexes ---------- */
CREATE INDEX IF NOT EXISTS idx_episodes_air_date ON episodes (air_date DESC);
CREATE INDEX IF NOT EXISTS idx_guests_name       ON guests   (name);
CREATE INDEX IF NOT EXISTS idx_hosts_name        ON hosts    (name);

/* ---------- Row Level Security ---------- */
ALTER TABLE episodes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosts          ENABLE ROW LEVEL SECURITY;

/* Public read-only policies */
CREATE POLICY "Public read episodes"
  ON episodes FOR SELECT USING (true);

CREATE POLICY "Public read guests"
  ON guests FOR SELECT USING (true);

CREATE POLICY "Public read episode_guests"
  ON episode_guests FOR SELECT USING (true);

CREATE POLICY "Public read sponsors"
  ON sponsors FOR SELECT USING (true);

CREATE POLICY "Public read hosts"
  ON hosts FOR SELECT USING (true);

/* ---------- Helper View: live_or_latest ---------- */
CREATE OR REPLACE VIEW live_or_latest AS
SELECT *
FROM episodes
ORDER BY is_live DESC, air_date DESC
LIMIT 1;
