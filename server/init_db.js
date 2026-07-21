const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });
    
    console.log('Connected to MySQL server. Running database.sql...');
    
    const sqlScript = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    
    await connection.query(sqlScript);
    
    console.log('Successfully executed database.sql! The jeevancare database and all tables are ready.');
    process.exit(0);
  } catch (err) {
    console.error('Error executing database schema:', err);
    process.exit(1);
  }
}

initDb();
