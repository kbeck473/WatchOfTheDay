const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'watchuser',
  password: process.env.PGPASSWORD || 'watchpass',
  host: process.env.PGHOST || 'db',
  port: 5432,
  database: process.env.PGDATABASE || 'watchdb',
});

pool.on('connect', () => {
  console.log('✅ DB loaded');
});

module.exports = pool;
