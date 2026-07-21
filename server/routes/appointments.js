const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/db');
const authenticate = require('../middleware/auth');

const generateId = () => crypto.randomUUID();

// @route   POST /api/appointments
// @desc    Create a new appointment
router.post('/', authenticate, async (req, res) => {
  const {
    patientName,
    patientPhone,
    providerId,
    providerName,
    providerRole,
    type,
    date,
    time,
    address,
    notes,
    status
  } = req.body;

  try {
    const id = generateId();
    await db.query(
      `INSERT INTO appointments 
       (id, patient_id, patient_name, patient_phone, provider_id, provider_name, provider_role, type, date, time, address, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, patientName, patientPhone, providerId, providerName, providerRole, type, date, time, address, notes, status || 'new']
    );

    res.status(201).json({ id, message: 'Appointment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating appointment' });
  }
});

// @route   GET /api/appointments
// @desc    Get appointments for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    let query = '';
    const params = [req.user.id];

    if (req.user.role === 'patient') {
      query = 'SELECT * FROM appointments WHERE patient_id = ? ORDER BY date DESC, time DESC';
    } else {
      query = 'SELECT * FROM appointments WHERE provider_id = ? ORDER BY date DESC, time DESC';
    }

    const [appointments] = await db.query(query, params);
    
    // Formatting for frontend: Convert DB fields to match what frontend expects
    const formattedApts = appointments.map(apt => ({
      id: apt.id,
      patientId: apt.patient_id,
      patientName: apt.patient_name,
      patientPhone: apt.patient_phone,
      providerId: apt.provider_id,
      providerName: apt.provider_name,
      providerRole: apt.provider_role,
      type: apt.type,
      // Date comes from mysql as Date object sometimes, we need a YYYY-MM-DD string
      date: typeof apt.date === 'object' ? apt.date.toISOString().split('T')[0] : apt.date,
      time: apt.time,
      address: apt.address,
      notes: apt.notes,
      status: apt.status
    }));

    res.json(formattedApts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching appointments' });
  }
});

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status
router.patch('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    // Only providers should be able to update status in this app, or patients can cancel.
    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating status' });
  }
});

module.exports = router;
