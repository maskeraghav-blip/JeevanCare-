const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticate = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

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

const doctorUploads = upload.fields([
  { name: 'qualification_certificate', maxCount: 1 },
  { name: 'pg_certificate', maxCount: 1 },
  { name: 'govt_id_proof', maxCount: 1 },
  { name: 'photo_with_id', maxCount: 1 }
]);

router.patch('/doctor', authenticate, doctorUploads, async (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'physio') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { registration_number, registering_council, pg_qualification, years_of_experience, specialty, is_clinic_doctor, hospital } = req.body;
  
  const updates = [];
  const params = [];

  if (registration_number) { updates.push('registration_number = ?'); params.push(registration_number); }
  if (registering_council) { updates.push('registering_council = ?'); params.push(registering_council); }
  if (pg_qualification) { updates.push('pg_qualification = ?'); params.push(pg_qualification); }
  if (years_of_experience) { updates.push('years_of_experience = ?'); params.push(years_of_experience); }
  if (specialty) { updates.push('specialty = ?'); params.push(specialty); }
  if (is_clinic_doctor !== undefined) { updates.push('is_clinic_doctor = ?'); params.push(is_clinic_doctor === 'true' || is_clinic_doctor === true ? 1 : 0); }
  if (hospital) { updates.push('hospital = ?'); params.push(hospital); }

  if (req.files) {
    if (req.files.qualification_certificate) {
      updates.push('qualification_certificate_url = ?');
      params.push('/uploads/' + req.files.qualification_certificate[0].filename);
    }
    if (req.files.pg_certificate) {
      updates.push('pg_certificate_url = ?');
      params.push('/uploads/' + req.files.pg_certificate[0].filename);
    }
    if (req.files.govt_id_proof) {
      updates.push('govt_id_proof_url = ?');
      params.push('/uploads/' + req.files.govt_id_proof[0].filename);
    }
    if (req.files.photo_with_id) {
      updates.push('photo_with_id_url = ?');
      params.push('/uploads/' + req.files.photo_with_id[0].filename);
    }
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  params.push(req.user.id);

  try {
    const query = `UPDATE doctor_profiles SET ${updates.join(', ')} WHERE user_id = ?`;
    await db.query(query, params);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

const nurseUploads = upload.fields([
  { name: 'qualification_certificate', maxCount: 1 },
  { name: 'pg_certificate', maxCount: 1 },
  { name: 'govt_id_proof', maxCount: 1 },
  { name: 'photo_with_id', maxCount: 1 },
  { name: 'additional_certifications', maxCount: 1 },
  { name: 'background_check_doc', maxCount: 1 }
]);

router.patch('/nurse', authenticate, nurseUploads, async (req, res) => {
  if (req.user.role !== 'nurse') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const {
    registration_number, registering_council, pg_qualification, years_of_experience,
    specialty, previous_experience_text, service_area, fee_onetime, fee_daily,
    fee_weekly, fee_livein, languages_spoken, availability_type
  } = req.body;

  const updates = [];
  const params = [];

  const addUpdate = (field, value) => {
    if (value !== undefined && value !== null) {
      updates.push(`${field} = ?`);
      params.push(value);
    }
  };

  addUpdate('registration_number', registration_number);
  addUpdate('registering_council', registering_council);
  addUpdate('pg_qualification', pg_qualification);
  addUpdate('years_of_experience', years_of_experience);
  addUpdate('specialty', specialty);
  addUpdate('previous_experience_text', previous_experience_text);
  addUpdate('service_area', service_area);
  addUpdate('fee_onetime', fee_onetime);
  addUpdate('fee_daily', fee_daily);
  addUpdate('fee_weekly', fee_weekly);
  addUpdate('fee_livein', fee_livein);
  addUpdate('languages_spoken', languages_spoken);
  addUpdate('availability_type', availability_type);

  if (req.files) {
    if (req.files.qualification_certificate) { addUpdate('qualification_certificate_url', '/uploads/' + req.files.qualification_certificate[0].filename); }
    if (req.files.pg_certificate) { addUpdate('pg_certificate_url', '/uploads/' + req.files.pg_certificate[0].filename); }
    if (req.files.govt_id_proof) { addUpdate('govt_id_proof_url', '/uploads/' + req.files.govt_id_proof[0].filename); }
    if (req.files.photo_with_id) { addUpdate('photo_with_id_url', '/uploads/' + req.files.photo_with_id[0].filename); }
    if (req.files.additional_certifications) { addUpdate('additional_certifications_url', '/uploads/' + req.files.additional_certifications[0].filename); }
    if (req.files.background_check_doc) { addUpdate('background_check_doc_url', '/uploads/' + req.files.background_check_doc[0].filename); }
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  params.push(req.user.id);

  try {
    const query = `UPDATE nurse_profiles SET ${updates.join(', ')} WHERE user_id = ?`;
    await db.query(query, params);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

router.patch('/patient', authenticate, async (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { blood_group, allergies, medical_conditions, current_medications } = req.body;

  const updates = [];
  const params = [];

  const addUpdate = (field, value) => {
    if (value !== undefined) {
      updates.push(`${field} = ?`);
      params.push(value);
    }
  };

  addUpdate('blood_group', blood_group);
  addUpdate('allergies', allergies);
  addUpdate('medical_conditions', medical_conditions);
  addUpdate('current_medications', current_medications);

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
  params.push(req.user.id);

  try {
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(query, params);
    res.json({ message: 'Health profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

module.exports = router;
