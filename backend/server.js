const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Ensure images dir exists and serve it
const imagesDir = path.join(__dirname, 'images');
fs.mkdirSync(imagesDir, { recursive: true });
app.use('/images', express.static(imagesDir));

// Multer (images only, 5 MB)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imagesDir),
  filename: (_req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^\w.\-]/g, '_');
    cb(null, safe);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only')),
});

// Ensure table exists
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS watches(
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      image_url TEXT NOT NULL,
      notes TEXT
    )
  `);
}
ensureTable().catch(e => console.error('DB init error:', e));

app.get('/healthz', (_req, res) => res.send('ok'));

// Random watch
app.get('/api/watch-of-the-day', async (_req, res) => {
  try {
    const q = await pool.query('SELECT * FROM watches ORDER BY random() LIMIT 1');
    if (q.rows.length === 0) return res.status(404).json({ error: 'no_watches' });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error', details: e.message });
  }
});

// List
app.get('/api/watches', async (_req, res) => {
  try {
    const q = await pool.query('SELECT * FROM watches ORDER BY id DESC LIMIT 100');
    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error', details: e.message });
  }
});

// Create via JSON
app.post('/api/watches', async (req, res) => {
  try {
    const { name, brand, image_url, notes } = req.body;
    if (!name || !brand || !image_url) {
      return res.status(400).json({ error: 'name_brand_image_url_required' });
    }
    const q = await pool.query(
      'INSERT INTO watches(name, brand, image_url, notes) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, brand, image_url, notes || null]
    );
    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'create_failed', details: e.message });
  }
});

// Create via upload
app.post('/api/watches/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, brand, notes } = req.body;
    if (!name || !brand) return res.status(400).json({ error: 'name_and_brand_required' });
    if (!req.file) return res.status(400).json({ error: 'image_required' });

    const image_url = '/images/' + req.file.filename;
    const q = await pool.query(
      'INSERT INTO watches(name, brand, image_url, notes) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, brand, image_url, notes || null]
    );
    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'upload_failed', details: e.message });
  }
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}`);
});
