const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

console.log('✅ Starting server.js');

const pool = require('./db'); // PostgreSQL connection

console.log('✅ DB loaded');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'images')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// API: Get a random watch
app.get('/api/watch-of-the-day', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM watches ORDER BY RANDOM() LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// API: Add new watch (URL method)
app.post('/api/watches', async (req, res) => {
  const { name, image_url } = req.body;

  if (!name || !image_url) {
    return res.status(400).json({ error: 'Name and image URL are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO watches (name, image_url) VALUES ($1, $2) RETURNING *',
      [name, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Failed to insert watch:', err);
    res.status(500).send('Database error');
  }
});

// API: Add new watch with file upload
app.post('/api/watches/upload', upload.single('image'), async (req, res) => {
  const name = req.body.name;
  const imagePath = `/images/${req.file.filename}`;

  if (!name || !req.file) {
    return res.status(400).json({ error: 'Name and image file are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO watches (name, image_url) VALUES ($1, $2) RETURNING *',
      [name, imagePath]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Failed to insert watch via upload:', err);
    res.status(500).send('Database error');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
