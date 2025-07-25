-- backend/seed.sql

DROP TABLE IF EXISTS watches;

CREATE TABLE IF NOT EXISTS watches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  image_url TEXT NOT NULL,
  notes TEXT
);

INSERT INTO watches (name, brand, image_url, notes) VALUES
('Omega Seamaster', 'Omega', '/images/seamaster.jpg', E'A classic diver\'s watch.'),
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
('Khaki Field', 'Hamilton', '/images/khaki_field.webp', NULL);
