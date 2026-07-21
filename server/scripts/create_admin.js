const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const generateId = () => crypto.randomUUID();

async function createAdmin() {
  const email = 'admin@jeevancare.com';
  const password = 'admin123';
  const name = 'System Admin';

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = generateId();

    await db.query(
      'INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)',
      [userId, email, passwordHash, 'admin', name]
    );

    console.log('Successfully created admin user:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    process.exit(0);
  }
}

createAdmin();
