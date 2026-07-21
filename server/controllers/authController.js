const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, address, city, state } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, password_hash, address || null, city || 'Hyderabad', state || 'Telangana']
    );

    const token = generateToken({ id: result.insertId, email, name });

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: result.insertId, name, email, phone, city: city || 'Hyderabad' }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, address, city, state, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: users[0] });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state } = req.body;

    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address), city = COALESCE(?, city), state = COALESCE(?, state) WHERE id = ?',
      [name, phone, address, city, state, req.user.id]
    );

    const [users] = await pool.query(
      'SELECT id, name, email, phone, address, city, state FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile updated.', user: users[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
