const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticate = require('../middleware/auth');
const crypto = require('crypto');

const generateId = () => crypto.randomUUID();

// @route   GET /api/addresses
router.get('/', authenticate, async (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const [addresses] = await db.query('SELECT * FROM patient_addresses WHERE patient_id = ?', [req.user.id]);
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching addresses' });
  }
});

// @route   POST /api/addresses
router.post('/', authenticate, async (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { label, address_line, locality, city, pincode, lat, lng, is_default } = req.body;
  const id = generateId();

  try {
    if (is_default) {
      // Unset previous defaults
      await db.query('UPDATE patient_addresses SET is_default = false WHERE patient_id = ?', [req.user.id]);
    }

    await db.query(
      'INSERT INTO patient_addresses (id, patient_id, label, address_line, locality, city, pincode, lat, lng, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, req.user.id, label || 'Home', address_line, locality, city, pincode, lat || null, lng || null, is_default || false]
    );

    res.status(201).json({ message: 'Address added successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error adding address' });
  }
});

module.exports = router;
