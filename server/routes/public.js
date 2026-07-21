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
// @desc    Get all doctors (Clinic Doctors + Physios) that are verified
router.get('/doctors', async (req, res) => {
  try {
    const [doctors] = await db.query(`
      SELECT 
        u.id, u.name, u.role, 
        d.profile_photo_url, d.specialty, d.hospital, 
        d.is_clinic_doctor AS isClinicDoctor, 
        COALESCE(d.years_of_experience, '5+') as experience, 
        d.verification_status, 
        d.registration_number, 
        4.8 as rating
      FROM users u
      INNER JOIN doctor_profiles d ON u.id = d.user_id
      WHERE u.role IN ('doctor', 'physio') 
      AND d.verification_status = 'verified'
    `);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching doctors' });
  }
});

// @route   GET /api/public/nurses
// @desc    Get all nurses that are verified and background checked
router.get('/nurses', async (req, res) => {
  try {
    const [nurses] = await db.query(`
      SELECT 
        u.id, u.name, u.role, 
        n.profile_photo_url, n.specialty, 
        COALESCE(n.experience, n.previous_experience_text) as experience,
        n.verification_status, n.background_check_status,
        n.service_area, n.fee_onetime, n.fee_daily, n.fee_weekly, n.fee_livein,
        n.languages_spoken, n.availability_type, 4.9 as rating
      FROM users u
      INNER JOIN nurse_profiles n ON u.id = n.user_id
      WHERE u.role = 'nurse' 
      AND n.verification_status = 'verified' 
      AND n.background_check_status = 'cleared'
    `);
    res.json(nurses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching nurses' });
  }
});

module.exports = router;
