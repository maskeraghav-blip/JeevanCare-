const pool = require('../config/db');

// GET /api/nurses
exports.getNurses = async (req, res) => {
  try {
    const { specialization, availability_type, search } = req.query;
    let query = 'SELECT * FROM nurses WHERE 1=1';
    const params = [];

    if (specialization) {
      query += ' AND specialization = ?';
      params.push(specialization);
    }
    if (availability_type) {
      query += ' AND (availability_type = ? OR availability_type = "all")';
      params.push(availability_type);
    }
    if (search) {
      query += ' AND (name LIKE ? OR specialization LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY rating DESC';
    const [nurses] = await pool.query(query, params);
    res.json({ nurses });
  } catch (err) {
    console.error('Get nurses error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/nurses/:id
exports.getNurseById = async (req, res) => {
  try {
    const [nurses] = await pool.query('SELECT * FROM nurses WHERE id = ?', [req.params.id]);

    if (nurses.length === 0) {
      return res.status(404).json({ error: 'Nurse not found.' });
    }

    const [reviews] = await pool.query(
      'SELECT * FROM nurse_reviews WHERE nurse_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({ nurse: nurses[0], reviews });
  } catch (err) {
    console.error('Get nurse error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// POST /api/nurses/:id/book
exports.bookNurse = async (req, res) => {
  try {
    const { duration_type, start_date, end_date, patient_address, patient_city, notes } = req.body;

    if (!duration_type || !start_date || !patient_address) {
      return res.status(400).json({ error: 'Duration type, start date, and address are required.' });
    }

    // Verify nurse exists
    const [nurses] = await pool.query('SELECT id FROM nurses WHERE id = ?', [req.params.id]);
    if (nurses.length === 0) {
      return res.status(404).json({ error: 'Nurse not found.' });
    }

    const [result] = await pool.query(
      `INSERT INTO nurse_bookings 
       (user_id, nurse_id, duration_type, start_date, end_date, patient_address, patient_city, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, req.params.id, duration_type, start_date, end_date || null, patient_address, patient_city || 'Hyderabad', notes || null]
    );

    res.status(201).json({
      message: 'Nurse booking confirmed.',
      booking: {
        id: result.insertId,
        nurse_id: parseInt(req.params.id),
        duration_type,
        start_date,
        end_date,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error('Book nurse error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/nurses/bookings
exports.getBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT nb.*, n.name AS nurse_name, n.specialization, n.photo_url
       FROM nurse_bookings nb
       JOIN nurses n ON nb.nurse_id = n.id
       WHERE nb.user_id = ?
       ORDER BY nb.start_date DESC`,
      [req.user.id]
    );
    res.json({ bookings });
  } catch (err) {
    console.error('Get nurse bookings error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
