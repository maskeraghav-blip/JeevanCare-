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

// POST /api/search/ai-assist — Ollama API helper for Map and Care guidance
exports.aiMapAssist = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const axios = require('axios');

    // 1. Fetch relevant clinics/hospitals from database depending on keyword matching
    let contextItems = { hospitals: [], clinics: [] };
    const keywords = ['cardio', 'heart', 'neuro', 'brain', 'ortho', 'bone', 'joint', 'kids', 'child', 'pediatr', 'cancer', 'oncolog', 'kidney', 'nephro', 'stomach', 'gastro', 'lung', 'pulmono', 'urinary', 'uro', 'delivery', 'gyneco', 'pregnant', 'icu', 'trauma', 'emergency', 'fever', 'skin', 'derma', 'dent'];
    let matchedKeywords = keywords.filter(kw => message.toLowerCase().includes(kw));

    let hospitalQuery = 'SELECT name, address, type, facilities FROM hospitals LIMIT 4';
    let clinicQuery = 'SELECT name, specialization, clinic_name, clinic_address, consultation_fee, home_visit_fee FROM clinic_doctors LIMIT 4';

    if (matchedKeywords.length > 0) {
      const likeClause = matchedKeywords.map(() => 'name LIKE ? OR address LIKE ? OR description LIKE ?').join(' OR ');
      hospitalQuery = `SELECT name, address, type, facilities FROM hospitals WHERE ${likeClause} LIMIT 5`;
      clinicQuery = `SELECT name, specialization, clinic_name, clinic_address, consultation_fee, home_visit_fee FROM clinic_doctors WHERE ${matchedKeywords.map(() => 'name LIKE ? OR specialization LIKE ? OR clinic_address LIKE ?').join(' OR ')} LIMIT 5`;
      
      const hospitalParams = [];
      const clinicParams = [];
      matchedKeywords.forEach(kw => {
        hospitalParams.push(`%${kw}%`, `%${kw}%`, `%${kw}%`);
        clinicParams.push(`%${kw}%`, `%${kw}%`, `%${kw}%`);
      });
      
      const [[hospitals], [clinics]] = await Promise.all([
        pool.query(hospitalQuery, hospitalParams),
        pool.query(clinicQuery, clinicParams)
      ]);
      contextItems = { hospitals, clinics };
    } else {
      const [[hospitals], [clinics]] = await Promise.all([
        pool.query(hospitalQuery),
        pool.query(clinicQuery)
      ]);
      contextItems = { hospitals, clinics };
    }

    // 2. Build LLM prompt
    const systemPrompt = `You are the JeevanCare+ AI Healthcare Map Assistant. Your role is to help patients find the right hospitals, clinic doctors, and physiotherapists in Hyderabad, Telangana.
You have access to the following real-time database results from JeevanCare+ matching the query:
HOSPITALS:
${JSON.stringify(contextItems.hospitals, null, 2)}
CLINICS & DOCTORS:
${JSON.stringify(contextItems.clinics, null, 2)}

Instructions:
- Suggest specific hospitals/clinics from the lists above based on their query. Mention their address, specialization, and fees/facilities where applicable.
- Remind patients to use the map UI to locate these entries in Hyderabad.
- Keep your response brief, friendly, and structured (use bullet points).
- If the database results above do not contain the answer, give a helpful general medical advisory and suggest hospitals in Hyderabad.
- Keep in mind: This is for educational and directory routing assistance. Include a brief medical disclaimer at the bottom if clinical advice is implied.`;

    // 3. Connect to Ollama API
    const ollamaUrl = process.env.OLLAMA_HOST || 'http://localhost:11434/api/chat';
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-6),
      { role: 'user', content: message }
    ];

    try {
      const response = await axios.post(ollamaUrl, {
        model: process.env.OLLAMA_MODEL || 'llama3',
        messages: messages,
        stream: false
      }, { timeout: 8000 });

      res.json({ response: response.data.message.content });
    } catch (ollamaErr) {
      console.warn('Ollama connection failed, falling back to mock rule-based responder:', ollamaErr.message);
      
      let fallbackText = `👋 Hello! I am the JeevanCare+ AI Care Assistant. 
The local **Ollama** server is not currently running on your system (usually on port 11434).

However, I can still guide you using our database matching rules! Based on your interest, here are the top recommended providers in Hyderabad:

`;
      if (contextItems.hospitals && contextItems.hospitals.length > 0) {
        fallbackText += `🏥 **Hospitals:**\n`;
        contextItems.hospitals.slice(0, 3).forEach(h => {
          fallbackText += `* **${h.name}** (${h.type}) - Located at ${h.address}. Facilities: ${typeof h.facilities === 'string' ? h.facilities : JSON.stringify(h.facilities)}\n`;
        });
      }
      if (contextItems.clinics && contextItems.clinics.length > 0) {
        fallbackText += `\n🩺 **Clinics & Home Doctors:**\n`;
        contextItems.clinics.slice(0, 3).forEach(c => {
          fallbackText += `* **${c.name}** (${c.specialization}) - Clinic: ${c.clinic_name} at ${c.clinic_address}. Home visit fee: ₹${c.home_visit_fee}\n`;
        });
      }

      fallbackText += `\n*⚠️ Disclaimer: This is a directory assistant. For medical emergencies, please call 108 or visit the nearest trauma facility immediately.*`;
      
      res.json({ response: fallbackText, info: 'Ollama offline, fallback activated' });
    }
  } catch (err) {
    console.error('AI Assist error:', err);
    res.status(500).json({ error: 'Server error during AI search processing.' });
  }
};
