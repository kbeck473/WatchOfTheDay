const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'watchuser',
  password: process.env.PGPASSWORD || 'watchpass',
  host: process.env.PGHOST || (process.env.DOCKER ? 'db' : 'localhost'),
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'watchdb',
});

module.exports = pool;
