const express = require('express');
const cors = require('cors');
const path = require('path');

console.log('✅ Starting server.js');

const pool = require('./db'); // this may be crashing

console.log('✅ DB loaded');

const app = express();
app.use(cors());

// Serve images
app.use('/images', express.static(path.join(__dirname, 'images')));

// API: get random watch
app.get('/api/watch-of-the-day', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM watches ORDER BY RANDOM() LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
