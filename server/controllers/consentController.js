const pool = require('../config/db');

// POST /api/consent
exports.submitConsent = async (req, res) => {
  try {
    const {
      patient_name, patient_age, patient_gender,
      procedure_description, doctor_name, hospital_name,
      agreed, consent_text, signature_name
    } = req.body;

    if (!patient_name || !procedure_description || !signature_name) {
      return res.status(400).json({ error: 'Patient name, procedure description, and signature are required.' });
    }

    if (!agreed) {
      return res.status(400).json({ error: 'You must agree to the consent terms.' });
    }

    // Capture IP and user agent
    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const user_agent = req.headers['user-agent'] || 'unknown';

    const [result] = await pool.query(
      `INSERT INTO consent_forms 
       (user_id, patient_name, patient_age, patient_gender, procedure_description, doctor_name, hospital_name, agreed, consent_text, signature_name, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, patient_name, patient_age || null, patient_gender || null,
       procedure_description, doctor_name || null, hospital_name || null,
       agreed, consent_text || null, signature_name, ip_address, user_agent]
    );

    res.status(201).json({
      message: 'Consent form submitted successfully.',
      consent: {
        id: result.insertId,
        patient_name,
        procedure_description,
        signed_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Submit consent error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/consent — user's consent records
exports.getConsents = async (req, res) => {
  try {
    const [consents] = await pool.query(
      'SELECT * FROM consent_forms WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ consents });
  } catch (err) {
    console.error('Get consents error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/consent/:id
exports.getConsentById = async (req, res) => {
  try {
    const [consents] = await pool.query(
      'SELECT * FROM consent_forms WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (consents.length === 0) {
      return res.status(404).json({ error: 'Consent form not found.' });
    }

    res.json({ consent: consents[0] });
  } catch (err) {
    console.error('Get consent error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
