const pool = require('../config/db');

// GET /api/search?q=<query>&category=<doctors|hospitals|specialization|location>
exports.globalSearch = async (req, res) => {
  try {
    const { q, category } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ hospitals: [], doctors: [], clinicDoctors: [], physiotherapists: [], nurses: [] });
    }

    const searchTerm = `%${q.trim()}%`;
    const results = {};

    // Search hospitals
    if (!category || category === 'hospitals' || category === 'location') {
      const [hospitals] = await pool.query(
        'SELECT id, name, type, address, city FROM hospitals WHERE name LIKE ? OR address LIKE ? OR city LIKE ? LIMIT 10',
        [searchTerm, searchTerm, searchTerm]
      );
      results.hospitals = hospitals;
    }

    // Search hospital doctors
    if (!category || category === 'doctors' || category === 'specialization') {
      const [doctors] = await pool.query(
        `SELECT hd.id, hd.name, hd.specialization, hd.qualification, h.name AS hospital_name, 'hospital' AS source
         FROM hospital_doctors hd
         JOIN hospitals h ON hd.hospital_id = h.id
         WHERE hd.name LIKE ? OR hd.specialization LIKE ? LIMIT 10`,
        [searchTerm, searchTerm]
      );
      results.hospitalDoctors = doctors;
    }

    // Search clinic doctors
    if (!category || category === 'doctors' || category === 'specialization') {
      const [clinicDoctors] = await pool.query(
        `SELECT id, name, specialization, qualification, clinic_name, 'clinic' AS source
         FROM clinic_doctors
         WHERE name LIKE ? OR specialization LIKE ? OR clinic_name LIKE ? LIMIT 10`,
        [searchTerm, searchTerm, searchTerm]
      );
      results.clinicDoctors = clinicDoctors;
    }

    // Search physiotherapists
    if (!category || category === 'doctors' || category === 'specialization') {
      const [physios] = await pool.query(
        `SELECT id, name, specialization, qualification, 'physio' AS source
         FROM physiotherapists
         WHERE name LIKE ? OR specialization LIKE ? LIMIT 10`,
        [searchTerm, searchTerm]
      );
      results.physiotherapists = physios;
    }

    // Search nurses
    if (!category || category === 'doctors') {
      const [nurses] = await pool.query(
        'SELECT id, name, specialization, experience_years, rating FROM nurses WHERE name LIKE ? OR specialization LIKE ? LIMIT 10',
        [searchTerm, searchTerm]
      );
      results.nurses = nurses;
    }

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
