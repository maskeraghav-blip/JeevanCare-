const pool = require('../config/db');

// GET /api/physio
exports.getPhysiotherapists = async (req, res) => {
  try {
    const { specialization, city, search } = req.query;
    let query = 'SELECT * FROM physiotherapists WHERE 1=1';
    const params = [];

    if (city) {
      query += ' AND city = ?';
      params.push(city);
    } else {
      query += ' AND city = ?';
      params.push('Hyderabad');
    }
    if (specialization) {
      query += ' AND specialization LIKE ?';
      params.push(`%${specialization}%`);
    }
    if (search) {
      query += ' AND (name LIKE ? OR specialization LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY name ASC';
    const [physios] = await pool.query(query, params);

    const parsed = physios.map((p) => ({
      ...p,
      available_slots: typeof p.available_slots === 'string' ? JSON.parse(p.available_slots) : p.available_slots || []
    }));

    res.json({ physiotherapists: parsed });
  } catch (err) {
    console.error('Get physiotherapists error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/physio/:id
exports.getPhysiotherapistById = async (req, res) => {
  try {
    const [physios] = await pool.query('SELECT * FROM physiotherapists WHERE id = ?', [req.params.id]);

    if (physios.length === 0) {
      return res.status(404).json({ error: 'Physiotherapist not found.' });
    }

    const physio = physios[0];
    physio.available_slots = typeof physio.available_slots === 'string'
      ? JSON.parse(physio.available_slots)
      : physio.available_slots || [];

    res.json({ physiotherapist: physio });
  } catch (err) {
    console.error('Get physiotherapist error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/physio/:id/book
exports.bookHomeVisit = async (req, res) => {
  try {
    const { appointment_date, time_slot, patient_address, patient_city, reason } = req.body;

    if (!appointment_date || !time_slot || !patient_address) {
      return res.status(400).json({ error: 'Date, time slot, and address are required.' });
    }

    const [physios] = await pool.query('SELECT id FROM physiotherapists WHERE id = ?', [req.params.id]);
    if (physios.length === 0) {
      return res.status(404).json({ error: 'Physiotherapist not found.' });
    }

    const [result] = await pool.query(
      `INSERT INTO home_visit_appointments 
       (user_id, doctor_id, doctor_type, appointment_date, time_slot, patient_address, patient_city, reason) 
       VALUES (?, ?, 'physio', ?, ?, ?, ?, ?)`,
      [req.user.id, req.params.id, appointment_date, time_slot, patient_address, patient_city || 'Hyderabad', reason || null]
    );

    res.status(201).json({
      message: 'Physiotherapy home visit booked successfully.',
      appointment: {
        id: result.insertId,
        doctor_id: parseInt(req.params.id),
        doctor_type: 'physio',
        appointment_date,
        time_slot,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Book physio visit error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/physio/appointments
exports.getAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT hva.*, p.name AS doctor_name, p.specialization, p.photo_url
       FROM home_visit_appointments hva
       JOIN physiotherapists p ON hva.doctor_id = p.id
       WHERE hva.user_id = ? AND hva.doctor_type = 'physio'
       ORDER BY hva.appointment_date DESC`,
      [req.user.id]
    );
    res.json({ appointments });
  } catch (err) {
    console.error('Get physio appointments error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
