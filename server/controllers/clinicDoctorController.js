const pool = require('../config/db');

// GET /api/clinic-doctors
exports.getClinicDoctors = async (req, res) => {
  try {
    const { specialization, city, search } = req.query;
    let query = 'SELECT * FROM clinic_doctors WHERE 1=1';
    const params = [];

    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    if (specialization) {
      query += ' AND specialization LIKE ?';
      params.push(`%${specialization}%`);
    }
    if (search) {
      query += ' AND (name LIKE ? OR specialization LIKE ? OR clinic_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY name ASC';
    const [doctors] = await pool.query(query, params);

    const parsed = doctors.map((d) => ({
      ...d,
      available_slots: typeof d.available_slots === 'string' ? JSON.parse(d.available_slots) : d.available_slots || []
    }));

    res.json({ doctors: parsed });
  } catch (err) {
    console.error('Get clinic doctors error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/clinic-doctors/:id
exports.getClinicDoctorById = async (req, res) => {
  try {
    const [doctors] = await pool.query('SELECT * FROM clinic_doctors WHERE id = ?', [req.params.id]);

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const doctor = doctors[0];
    doctor.available_slots = typeof doctor.available_slots === 'string'
      ? JSON.parse(doctor.available_slots)
      : doctor.available_slots || [];

    res.json({ doctor });
  } catch (err) {
    console.error('Get clinic doctor error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/clinic-doctors/:id/book
exports.bookHomeVisit = async (req, res) => {
  try {
    const { appointment_date, time_slot, patient_address, patient_city, reason } = req.body;

    if (!appointment_date || !time_slot || !patient_address) {
      return res.status(400).json({ error: 'Date, time slot, and address are required.' });
    }

    // Verify doctor exists
    const [doctors] = await pool.query('SELECT id FROM clinic_doctors WHERE id = ?', [req.params.id]);
    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const [result] = await pool.query(
      `INSERT INTO home_visit_appointments 
       (user_id, doctor_id, doctor_type, appointment_date, time_slot, patient_address, patient_city, reason) 
       VALUES (?, ?, 'clinic', ?, ?, ?, ?, ?)`,
      [req.user.id, req.params.id, appointment_date, time_slot, patient_address, patient_city || 'Hyderabad', reason || null]
    );

    res.status(201).json({
      message: 'Home visit booked successfully.',
      appointment: {
        id: result.insertId,
        doctor_id: parseInt(req.params.id),
        doctor_type: 'clinic',
        appointment_date,
        time_slot,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Book home visit error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/clinic-doctors/appointments
exports.getAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT hva.*, cd.name AS doctor_name, cd.specialization, cd.photo_url
       FROM home_visit_appointments hva
       JOIN clinic_doctors cd ON hva.doctor_id = cd.id
       WHERE hva.user_id = ? AND hva.doctor_type = 'clinic'
       ORDER BY hva.appointment_date DESC`,
      [req.user.id]
    );
    res.json({ appointments });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
