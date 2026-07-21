const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper to generate UUID
const generateId = () => crypto.randomUUID();

// @route   POST /api/auth/doctor-register
router.post('/doctor-register', upload.single('profile_photo'), async (req, res) => {
  const { email, password, name, dob, gender, mobile_number, residential_address } = req.body;
  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = generateId();
    
    await db.query(
      'INSERT INTO users (id, email, password_hash, role, name, dob, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, 'doctor', name, dob || null, gender || null]
    );

    const profileId = generateId();
    const photoPath = req.file ? '/uploads/' + req.file.filename : null;
    
    await db.query(
      'INSERT INTO doctor_profiles (id, user_id, profile_photo_url, mobile_number, residential_address, verification_status) VALUES (?, ?, ?, ?, ?, "pending")',
      [profileId, userId, photoPath, mobile_number || null, residential_address || null]
    );

    const token = jwt.sign({ id: userId, role: 'doctor', name }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, email, role: 'doctor', name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during doctor registration' });
  }
});

// @route   POST /api/auth/nurse-register
router.post('/nurse-register', upload.single('profile_photo'), async (req, res) => {
  const { email, password, name, dob, gender, mobile_number, residential_address } = req.body;
  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = generateId();
    
    await db.query(
      'INSERT INTO users (id, email, password_hash, role, name, dob, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, 'nurse', name, dob || null, gender || null]
    );

    const profileId = generateId();
    const photoPath = req.file ? '/uploads/' + req.file.filename : null;
    
    await db.query(
      'INSERT INTO nurse_profiles (id, user_id, profile_photo_url, mobile_number, residential_address, verification_status) VALUES (?, ?, ?, ?, ?, "pending")',
      [profileId, userId, photoPath, mobile_number || null, residential_address || null]
    );

    const token = jwt.sign({ id: userId, role: 'nurse', name }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, email, role: 'nurse', name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during nurse registration' });
  }
});

// @route   POST /api/auth/patient-register
router.post('/patient-register', upload.single('profile_photo'), async (req, res) => {
  const { email, password, name, dob, gender, mobile_number, residential_address } = req.body;
  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = generateId();
    
    await db.query(
      'INSERT INTO users (id, email, password_hash, role, name, dob, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, 'patient', name, dob || null, gender || null]
    );

    const profileId = generateId();
    const docPath = req.file ? '/uploads/' + req.file.filename : null;

    await db.query(
      'INSERT INTO patient_profiles (id, user_id, phone, address, medical_history_doc) VALUES (?, ?, ?, ?, ?)',
      [profileId, userId, mobile_number || null, residential_address || null, docPath]
    );

    const token = jwt.sign({ id: userId, role: 'patient', name }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, email, role: 'patient', name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during patient registration' });
  }
});

// Keep existing generic register route for backward compatibility during transition if needed
router.post('/register', upload.single('document'), async (req, res) => {
  // We'll redirect to patient register for simplicity, or just keep it as is if needed. 
  // Let's actually implement a fallback if any old code hits this:
  const { email, password, role, name, phone, address, specialty, hospital, isClinicDoctor, experience } = req.body;
  try {
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = generateId();
    await db.query('INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)', [userId, email, passwordHash, role, name]);

    const profileId = generateId();
    const docPath = req.file ? '/uploads/' + req.file.filename : null;

    if (role === 'patient') {
      await db.query('INSERT INTO patient_profiles (id, user_id, phone, address, medical_history_doc) VALUES (?, ?, ?, ?, ?)', [profileId, userId, phone || null, address || null, docPath]);
    } else if (role === 'doctor' || role === 'physio') {
      await db.query('INSERT INTO doctor_profiles (id, user_id, specialty, hospital, is_clinic_doctor, verification_doc) VALUES (?, ?, ?, ?, ?, ?)', [profileId, userId, specialty || null, hospital || null, isClinicDoctor === 'true' ? 1 : 0, docPath]);
    } else if (role === 'nurse') {
      await db.query('INSERT INTO nurse_profiles (id, user_id, specialty, experience, verification_doc) VALUES (?, ?, ?, ?, ?)', [profileId, userId, specialty || null, experience || null, docPath]);
    }
    const token = jwt.sign({ id: userId, role, name }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, email, role, name } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
const authenticate = require('../middleware/auth');
router.get('/me', authenticate, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, role, name, created_at, dob, gender, blood_group, allergies, medical_conditions, current_medications FROM users WHERE id = ?', [req.user.id]);
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
