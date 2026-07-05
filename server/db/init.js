const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
  console.log('🏁 Starting JeevanCare+ Database Initialization...');

  // 1. Connect to MySQL without specifying database to create it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT) || 3306,
    multipleStatements: true // Allow executing multiple queries at once
  });

  console.log('✅ Connected to MySQL Server');

  const dbName = process.env.DB_NAME || 'jeevancare_db';
  console.log(`⏳ Ensuring database "${dbName}" exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.query(`USE \`${dbName}\`;`);

  // 2. Read schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  console.log('⏳ Running schema migration...');
  await connection.query(schemaSql);
  console.log('✅ Schema migration completed successfully');

  await connection.end();

  // 3. Run seed.js logic
  console.log('⏳ Running seed script...');
  // Require and run seed logic
  const seed = require('./seed.js');
  // Since seed is executed on import or requires execution, let's verify if seed is an exported function or self-executing.
  // In seed.js, we have self-executing seed() function: `seed().catch(...)`.
  // So requiring it will run it automatically!
}

init().catch(err => {
  console.error('\n❌ Initialization failed:', err.message);
  console.error('   Please check if MySQL server is running and credentials in server/.env are correct.\n');
  process.exit(1);
});
