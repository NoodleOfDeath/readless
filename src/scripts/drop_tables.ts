#!/usr/bin/env ts-node

import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query('DROP TABLE IF EXISTS "references"');
pool.query('DROP TABLE IF EXISTS sources');
pool.query('DROP TABLE IF EXISTS articles');
