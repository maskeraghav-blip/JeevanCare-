const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

// Helper to generate UUID
const generateId = () => crypto.randomUUID();

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, role, name, phone, address, specialty, hospital, isClinicDoctor, experience } = req.body;

  try {
    // 1. Check if user exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create user
    const userId = generateId();
    await db.query(
      'INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)',
      [userId, email, passwordHash, role, name]
    );

    // 4. Create profile based on role
    const profileId = generateId();
    if (role === 'patient') {
      await db.query(
        'INSERT INTO patient_profiles (id, user_id, phone, address) VALUES (?, ?, ?, ?)',
        [profileId, userId, phone || null, address || null]
      );
    } else if (role === 'doctor' || role === 'physio') {
      await db.query(
        'INSERT INTO doctor_profiles (id, user_id, specialty, hospital, is_clinic_doctor) VALUES (?, ?, ?, ?, ?)',
        [profileId, userId, specialty || null, hospital || null, isClinicDoctor ? 1 : 0]
      );
    } else if (role === 'nurse') {
      await db.query(
        'INSERT INTO nurse_profiles (id, user_id, specialty, experience) VALUES (?, ?, ?, ?)',
        [profileId, userId, specialty || null, experience || null]
      );
    }

    // 5. Generate token
    const token = jwt.sign(
      { id: userId, role, name },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: userId, email, role, name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// Get current user profile (useful for populating UI after refresh)
const authenticate = require('../middleware/auth');
router.get('/me', authenticate, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, role, name, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = users[0];

    let profile = null;
    if (user.role === 'patient') {
      const [profiles] = await db.query('SELECT * FROM patient_profiles WHERE user_id = ?', [user.id]);
      profile = profiles[0] || {};
    } else if (user.role === 'doctor' || user.role === 'physio') {
      const [profiles] = await db.query('SELECT * FROM doctor_profiles WHERE user_id = ?', [user.id]);
      profile = profiles[0] || {};
    } else if (user.role === 'nurse') {
      const [profiles] = await db.query('SELECT * FROM nurse_profiles WHERE user_id = ?', [user.id]);
      profile = profiles[0] || {};
    }

    res.json({ user, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
