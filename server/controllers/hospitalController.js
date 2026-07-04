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
    } else {
      query += ' AND city = ?';
      params.push('Hyderabad');
    }
    if (search) {
      query += ' AND (name LIKE ? OR address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
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
