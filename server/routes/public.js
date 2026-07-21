const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/public/hospitals
// @desc    Get all hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const [hospitals] = await db.query('SELECT * FROM hospitals ORDER BY rating DESC');
    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching hospitals' });
  }
});

// @route   GET /api/public/clinics
// @desc    Get all clinics
router.get('/clinics', async (req, res) => {
  try {
    const [clinics] = await db.query('SELECT * FROM clinics ORDER BY rating DESC');
    res.json(clinics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching clinics' });
  }
});

// @route   GET /api/public/doctors
// @desc    Get all doctors (Clinic Doctors + Physios)
router.get('/doctors', async (req, res) => {
  try {
    // Join users with doctor_profiles to get all details
    const [doctors] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, d.specialty, d.hospital, d.is_clinic_doctor
      FROM users u
      INNER JOIN doctor_profiles d ON u.id = d.user_id
      WHERE u.role IN ('doctor', 'physio')
    `);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching doctors' });
  }
});

// @route   GET /api/public/nurses
// @desc    Get all nurses
router.get('/nurses', async (req, res) => {
  try {
    // Join users with nurse_profiles
    const [nurses] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, n.specialty, n.experience
      FROM users u
      INNER JOIN nurse_profiles n ON u.id = n.user_id
      WHERE u.role = 'nurse'
    `);
    res.json(nurses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching nurses' });
  }
});

module.exports = router;
