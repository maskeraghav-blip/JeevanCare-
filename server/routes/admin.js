const express = require('express');
const router = express.Router();
const db = require('../config/db');
// In a real app, you would have an admin auth middleware
// const adminAuth = require('../middleware/adminAuth');

// For simplicity, we just use a basic auth or even open it up for demonstration 
// depending on requirements, but let's make it a plain endpoint that assumes admin access for now.

// @route   PATCH /api/admin/verify/:type/:id
// @desc    Verify a doctor or nurse
router.patch('/verify/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const { verification_status, background_check_status } = req.body;

  try {
    if (type === 'doctor') {
      await db.query(
        'UPDATE doctor_profiles SET verification_status = ?, verified_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [verification_status || 'verified', id]
      );
      return res.json({ message: 'Doctor verified successfully' });
    } else if (type === 'nurse') {
      const updates = [];
      const params = [];
      
      if (verification_status) {
        updates.push('verification_status = ?');
        updates.push('verified_at = CURRENT_TIMESTAMP');
        params.push(verification_status);
      }
      if (background_check_status) {
        updates.push('background_check_status = ?');
        params.push(background_check_status);
      }

      if (updates.length > 0) {
        params.push(id);
        const query = `UPDATE nurse_profiles SET ${updates.join(', ')} WHERE user_id = ?`;
        await db.query(query, params);
      }
      
      return res.json({ message: 'Nurse verification updated successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// @route   GET /api/admin/providers
// @desc    Get all doctors and nurses with their full profile information
router.get('/providers', async (req, res) => {
  try {
    const [doctors] = await db.query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.created_at,
        d.verification_status, d.specialty, d.hospital,
        d.registration_number, d.registering_council, d.pg_qualification,
        d.years_of_experience, d.is_clinic_doctor,
        d.qualification_certificate_url AS qualification_certificate,
        d.pg_certificate_url AS pg_certificate,
        d.govt_id_proof_url AS govt_id_proof,
        d.photo_with_id_url AS photo_with_id,
        d.profile_photo_url
      FROM users u
      INNER JOIN doctor_profiles d ON u.id = d.user_id
      WHERE u.role IN ('doctor', 'physio')
    `);

    const [nurses] = await db.query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.created_at,
        n.verification_status, n.background_check_status,
        n.registration_number, n.registering_council, n.pg_qualification,
        n.years_of_experience, n.previous_experience_text,
        n.qualification_certificate_url AS qualification_certificate,
        n.additional_certifications_url AS additional_certifications,
        n.govt_id_proof_url AS govt_id_proof,
        n.background_check_doc_url AS background_check_doc,
        n.photo_with_id_url AS photo_with_id,
        n.profile_photo_url,
        n.specialty, n.service_area
      FROM users u
      INNER JOIN nurse_profiles n ON u.id = n.user_id
      WHERE u.role = 'nurse'
    `);

    res.json({ doctors, nurses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching providers' });
  }
});

module.exports = router;
