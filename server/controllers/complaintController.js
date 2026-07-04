const pool = require('../config/db');

// POST /api/complaints
exports.submitComplaint = async (req, res) => {
  try {
    const { name, email, category, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }

    const userId = req.user ? req.user.id : null;

    const [result] = await pool.query(
      'INSERT INTO complaints (user_id, name, email, category, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, category || 'other', subject, message]
    );

    // TODO: Optionally trigger email notification to support address
    console.log(`📧 New complaint submitted: #${result.insertId} — "${subject}" from ${email}`);

    res.status(201).json({
      message: 'Complaint submitted successfully. We will get back to you soon.',
      complaint: {
        id: result.insertId,
        subject,
        category: category || 'other',
        status: 'open'
      }
    });
  } catch (err) {
    console.error('Submit complaint error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/complaints — user's complaints
exports.getComplaints = async (req, res) => {
  try {
    const [complaints] = await pool.query(
      'SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ complaints });
  } catch (err) {
    console.error('Get complaints error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
