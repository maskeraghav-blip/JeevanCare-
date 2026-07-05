const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost',
  'http://localhost:80',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/clinic-doctors', require('./routes/clinicDoctors'));
app.use('/api/nurses', require('./routes/nurses'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/consent', require('./routes/consent'));
app.use('/api/physio', require('./routes/physio'));
app.use('/api/search', require('./routes/search'));

// Database initialization/migration endpoint for Vercel/Production deployment
app.get('/api/admin/db-init', async (req, res) => {
  try {
    const mysql = require('mysql2/promise');
    const fs = require('fs');
    const path = require('path');

    console.log('🏁 Starting JeevanCare+ Database Initialization via API...');

    // 1. Connect to MySQL without specifying database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL Server');

    const dbName = process.env.DB_NAME || 'jeevancare_db';
    console.log(`⏳ Ensuring database "${dbName}" exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    // 2. Read schema.sql
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('⏳ Running schema migration...');
    await connection.query(schemaSql);
    console.log('✅ Schema migration completed successfully');

    await connection.end();

    // 3. Run seed.js logic (clear cache so it runs every time the endpoint is hit)
    console.log('⏳ Running seed script...');
    const seedPath = require.resolve('./db/seed.js');
    delete require.cache[seedPath];
    require('./db/seed.js');

    res.json({
      status: 'ok',
      message: 'JeevanCare+ database schema initialized and seeded successfully.'
    });
  } catch (err) {
    console.error('❌ Database initialization via API failed:', err);
    res.status(500).json({
      status: 'error',
      message: 'Database initialization failed.',
      error: err.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'JeevanCare+ API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🏥 JeevanCare+ API Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
