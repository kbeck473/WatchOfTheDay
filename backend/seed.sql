-- backend/seed.sql
CREATE TABLE IF NOT EXISTS watches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  image TEXT NOT NULL,
  notes TEXT
);

INSERT INTO watches (name, brand, image, notes) VALUES
('Omega Seamaster', 'Omega', '/images/seamaster.jpg', 'A classic diver\'s watch.'),
('G-Shock Mudmaster', 'Casio', '/images/mudmaster.jpg', 'Built for rough environments.');
