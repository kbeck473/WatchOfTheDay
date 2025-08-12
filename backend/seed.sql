-- backend/seed.sql
-- Idempotent seed for WatchOfTheDay
-- Run safely on every compose up (e.g., via a 'seed' job) without losing data.

-- 1) Ensure table exists (minimal schema)
CREATE TABLE IF NOT EXISTS watches (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  brand      TEXT NOT NULL,
  image_url  TEXT NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Add missing columns if your existing table was older/different
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'watches' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE watches ADD COLUMN image_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'watches' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE watches ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END
$$;

-- 3) If an old 'image_path' column exists, backfill image_url once
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'watches' AND column_name = 'image_path'
  ) THEN
    UPDATE watches SET image_url = COALESCE(image_url, image_path)
    WHERE image_url IS NULL;
  END IF;
END
$$;

-- 4) Unique key to prevent duplicates by (name, brand)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conname = 'watches_name_brand_key'
  ) THEN
    ALTER TABLE watches
      ADD CONSTRAINT watches_name_brand_key UNIQUE (name, brand);
  END IF;
END
$$;

-- 5) Seed data (ON CONFLICT updates notes/image_url without duplicating rows)
INSERT INTO watches (name, brand, image_url, notes) VALUES
('Omega Seamaster', 'Omega', '/images/seamaster.jpg', 'A classic diver''s watch.'),
('G-Shock Mudmaster', 'Casio', '/images/mudmaster.jpg', 'Built for rough environments.'),
('Seiko 5 Sports', 'Seiko', '/images/seiko.jpg', NULL),
('Casio G-Shock', 'Casio', '/images/gshock.jpg', NULL),
('Tudor Black Bay 58 Blue', 'Tudor', '/images/blackbay58blue.webp', NULL),
('Tudor Black Bay 58 Black', 'Tudor', '/images/blackbay58black.webp', NULL),
('Tudor Black Bay Red', 'Tudor', '/images/blackbayred.webp', NULL),
('Tudor Black Bay GMT S&G', 'Tudor', '/images/blackbaygmt.webp', NULL),
('Tudor Pelagos 39', 'Tudor', '/images/pelagos39.webp', NULL),
('Omega Aqua Terra Black', 'Omega', '/images/aquaterra_black.webp', NULL),
('Omega Speedmaster Moonwatch', 'Omega', '/images/speedmaster_moonwatch.webp', NULL),
('Omega Speedmaster White Dial', 'Omega', '/images/speedmaster_white.webp', NULL),
('Omega Speedmaster ''57 Blue', 'Omega', '/images/speedmaster57blue.webp', NULL),
('Omega Speedmaster First in Space', 'Omega', '/images/speedmaster_firstinspace.webp', NULL),
('Swatch Moonswatch', 'Swatch', '/images/moonswatch.webp', NULL),
('Christopher Ward C60 300 Pro', 'Christopher Ward', '/images/c60300pro.webp', NULL),
('Christopher Ward C60 300 White', 'Christopher Ward', '/images/c60300white.webp', NULL),
('Christopher Ward C63 GMT', 'Christopher Ward', '/images/c63gmt.webp', NULL),
('Seiko 5 GMT Blue', 'Seiko', '/images/seiko5gmt_blue.webp', NULL),
('Seiko 5 GMT Black', 'Seiko', '/images/seiko5gmt_black.webp', NULL),
('Christopher Ward C12 Twelve Blue', 'Christopher Ward', '/images/cw_twelve_blue.webp', NULL),
('Christopher Ward C63 Black', 'Christopher Ward', '/images/c63_black.webp', NULL),
('Grand Seiko GMT Black', 'Grand Seiko', '/images/gs_gmt_black.webp', NULL),
('Grand Seiko Blue Snowflake', 'Grand Seiko', '/images/gs_blue_snowflake.webp', NULL),
('Khaki Field', 'Hamilton', '/images/khaki_field.webp', NULL)
ON CONFLICT (name, brand) DO UPDATE
SET image_url = EXCLUDED.image_url,
    notes     = EXCLUDED.notes;

-- 6) Helpful index for brand filters (safe if re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'idx_watches_brand' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_watches_brand ON watches (brand);
  END IF;
END
$$;
