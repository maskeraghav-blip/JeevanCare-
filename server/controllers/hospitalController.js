const pool = require('../config/db');

// GET /api/hospitals — list all hospitals with optional filters
exports.getHospitals = async (req, res) => {
  try {
    const { type, city, search } = req.query;
    let query = 'SELECT * FROM hospitals WHERE 1=1';
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    if (search) {
      const searchLower = search.toLowerCase().trim();
      
      const diseaseMapping = {
        'Cardiology': ['heart', 'cardiac', 'chest pain', 'bp', 'blood pressure', 'angina', 'stroke', 'cardio'],
        'Neurology': ['brain', 'stroke', 'neuro', 'headache', 'migraine', 'seizure', 'paralysis', 'nerve'],
        'Orthopedics': ['fracture', 'bone', 'joint', 'arthritis', 'ortho', 'knee pain', 'back pain', 'spine', 'sprain'],
        'Oncology': ['cancer', 'tumor', 'chemo', 'oncology', 'leukemia', 'lymphoma'],
        'Pediatrics': ['child', 'kids', 'baby', 'pediatrician', 'infant', 'childhood', 'pedia'],
        'Gastroenterology': ['stomach', 'liver', 'acid reflux', 'acidity', 'digestion', 'gut', 'ulcer', 'piles', 'gastro'],
        'Pulmonology': ['asthma', 'lung', 'cough', 'breathing', 'copd', 'pneumonia', 'tuberculosis'],
        'Urology': ['kidney stone', 'urinary', 'urine', 'prostate', 'urology'],
        'Nephrology': ['kidney', 'dialysis', 'renal', 'nephro']
      };

      const matchedSpecialties = [];
      for (const [specialty, keywords] of Object.entries(diseaseMapping)) {
        if (keywords.some(keyword => searchLower.includes(keyword) || keyword.includes(searchLower))) {
          matchedSpecialties.push(specialty);
        }
      }

      if (matchedSpecialties.length > 0) {
        const placeholders = matchedSpecialties.map(() => '?').join(',');
        query += ` AND (name LIKE ? OR address LIKE ? OR id IN (
          SELECT DISTINCT hospital_id FROM hospital_doctors WHERE specialization IN (${placeholders})
        ))`;
        params.push(`%${search}%`, `%${search}%`, ...matchedSpecialties);
      } else {
        query += ' AND (name LIKE ? OR address LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
    }

    query += ' ORDER BY name ASC';

    const [hospitals] = await pool.query(query, params);

    // Parse facilities JSON
    const parsed = hospitals.map((h) => ({
      ...h,
      facilities: typeof h.facilities === 'string' ? JSON.parse(h.facilities) : h.facilities || []
    }));

    res.json({ hospitals: parsed });
  } catch (err) {
    console.error('Get hospitals error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/hospitals/:id — hospital detail with doctors
exports.getHospitalById = async (req, res) => {
  try {
    const [hospitals] = await pool.query('SELECT * FROM hospitals WHERE id = ?', [req.params.id]);

    if (hospitals.length === 0) {
      return res.status(404).json({ error: 'Hospital not found.' });
    }

    const hospital = hospitals[0];
    hospital.facilities = typeof hospital.facilities === 'string'
      ? JSON.parse(hospital.facilities)
      : hospital.facilities || [];

    const [doctors] = await pool.query(
      'SELECT * FROM hospital_doctors WHERE hospital_id = ? ORDER BY name ASC',
      [req.params.id]
    );

    res.json({ hospital, doctors });
  } catch (err) {
    console.error('Get hospital error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/hospitals/:id/doctors — doctors at a hospital
exports.getHospitalDoctors = async (req, res) => {
  try {
    const [doctors] = await pool.query(
      'SELECT * FROM hospital_doctors WHERE hospital_id = ? ORDER BY name ASC',
      [req.params.id]
    );
    res.json({ doctors });
  } catch (err) {
    console.error('Get hospital doctors error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/hospitals/doctors/:doctorId — individual hospital doctor profile
exports.getDoctorById = async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT hd.*, h.name AS hospital_name, h.address AS hospital_address, h.contact_number AS hospital_contact
       FROM hospital_doctors hd
       JOIN hospitals h ON hd.hospital_id = h.id
       WHERE hd.id = ?`,
      [req.params.doctorId]
    );

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    res.json({ doctor: doctors[0] });
  } catch (err) {
    console.error('Get doctor error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/hospitals/:id/book — book a hospital appointment and trigger mock email
exports.bookHospitalAppointment = async (req, res) => {
  try {
    const { appointment_date, time_slot, patient_name, patient_phone, reason, doctor_id } = req.body;
    const hospitalId = req.params.id;

    if (!appointment_date || !time_slot || !patient_name || !patient_phone) {
      return res.status(400).json({ error: 'Date, time slot, patient name, and phone are required.' });
    }

    // Check if hospital exists
    const [hospitals] = await pool.query('SELECT name, address FROM hospitals WHERE id = ?', [hospitalId]);
    if (hospitals.length === 0) {
      return res.status(404).json({ error: 'Hospital not found.' });
    }
    const hospitalName = hospitals[0].name;

    // Check if doctor exists if selected
    let doctorName = 'General Outpatient';
    if (doctor_id) {
      const [doctors] = await pool.query('SELECT name FROM hospital_doctors WHERE id = ?', [doctor_id]);
      if (doctors.length > 0) {
        doctorName = doctors[0].name;
      }
    }

    // Fetch user details for email notification
    const [users] = await pool.query('SELECT email, name FROM users WHERE id = ?', [req.user.id]);
    const userEmail = users[0]?.email || 'patient@jeevancare.com';

    // Insert appointment into database
    const [result] = await pool.query(
      `INSERT INTO hospital_appointments 
       (user_id, hospital_id, doctor_id, appointment_date, time_slot, patient_name, patient_phone, reason) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, hospitalId, doctor_id || null, appointment_date, time_slot, patient_name, patient_phone, reason || null]
    );

    // MOCK EMAIL NOTIFICATION DISPATCH
    const fs = require('fs');
    const path = require('path');
    
    const emailSubject = `🏥 Appointment Confirmation - ${hospitalName}`;
    const emailBody = `
=========================================
📧 EMAIL DISPATCH NOTIFICATION
=========================================
To: ${userEmail}
Subject: ${emailSubject}
Status: SENT SUCCESSFUL (Mock Mail API)
-----------------------------------------
Dear ${patient_name},

Your appointment has been successfully scheduled at JeevanCare+.

APPOINTMENT DETAILS:
- Hospital: ${hospitalName}
- Department/Doctor: ${doctorName}
- Date: ${appointment_date}
- Time Slot: ${time_slot}
- Patient Contact: ${patient_phone}
- Booking Reference ID: JC-HOSP-${result.insertId}

Please arrive 15 minutes before your scheduled slot. 
To cancel or reschedule, visit your dashboard profile page.

Best regards,
JeevanCare+ Helpdesk Team
=========================================
`;

    // Print to server logs
    console.log(emailBody);

    // Save to server log file
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(path.join(logDir, 'emails.log'), emailBody + '\n');

    res.status(201).json({
      message: 'Hospital appointment booked successfully.',
      bookingId: result.insertId,
      emailSent: true,
      appointment: {
        id: result.insertId,
        hospital_name: hospitalName,
        doctor_name: doctorName,
        appointment_date,
        time_slot,
        patient_name,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Book hospital appointment error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/hospitals/appointments/history — list appointments of logged in user
exports.getAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT ha.*, h.name AS hospital_name, h.address AS hospital_address, hd.name AS doctor_name, hd.specialization
       FROM hospital_appointments ha
       JOIN hospitals h ON ha.hospital_id = h.id
       LEFT JOIN hospital_doctors hd ON ha.doctor_id = hd.id
       WHERE ha.user_id = ?
       ORDER BY ha.appointment_date DESC`,
      [req.user.id]
    );
    res.json({ appointments });
  } catch (err) {
    console.error('Get hospital appointments history error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
