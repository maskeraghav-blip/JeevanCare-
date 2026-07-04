const pool = require('../config/db');

// GET /api/search?q=<query>&category=<doctors|hospitals|specialization|location>
// GET /api/search?q=<query>&category=<doctors|hospitals|specialization|location>
exports.globalSearch = async (req, res) => {
  try {
    const { q, category } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ hospitals: [], hospitalDoctors: [], clinicDoctors: [], physiotherapists: [], nurses: [] });
    }

    const axios = require('axios');
    let parsedFilters = { type: null, specialization: null, area: null, facility: null, searchTerm: q.trim() };
    let aiParsed = false;

    // 1. Try to parse query using local Ollama model
    try {
      const ollamaUrl = process.env.OLLAMA_HOST || 'http://localhost:11434/api/generate';
      const prompt = `You are a query parsing assistant for a healthcare map directory.
Your job is to parse a search query and return ONLY a JSON object containing search filters. Do not return any explanation, warnings, or markdown.

Schema:
{
  "type": "government" | "private" | null,
  "specialization": string | null, 
  "area": string | null,
  "facility": string | null,
  "searchTerm": string | null
}

Query: "${q.trim()}"
Parsed JSON:`;

      const response = await axios.post(ollamaUrl, {
        model: process.env.OLLAMA_MODEL || 'llama3',
        prompt: prompt,
        system: "You output only valid raw JSON. Never output markdown codeblocks, text, or warnings.",
        stream: false,
        options: { temperature: 0.1 }
      }, { timeout: 3500 }); // Fast 3.5s timeout for map search responsiveness

      const rawText = response.data.response.trim();
      // Remove potential markdown wrappers if the model ignores system instruction
      const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedFilters = JSON.parse(jsonText);
      aiParsed = true;
      console.log('🤖 AI Parsed Query Filters:', parsedFilters);
    } catch (ollamaErr) {
      console.warn('Ollama offline or parsing timed out. Using standard database search matching.');
    }

    const results = {
      hospitals: [],
      hospitalDoctors: [],
      clinicDoctors: [],
      physiotherapists: [],
      nurses: []
    };

    // 2. Perform intelligent queries based on parsed filters
    const searchVal = parsedFilters.searchTerm || q.trim();
    const searchTerm = `%${searchVal}%`;
    const areaTerm = parsedFilters.area ? `%${parsedFilters.area}%` : searchTerm;
    const specialtyTerm = parsedFilters.specialization ? `%${parsedFilters.specialization}%` : searchTerm;
    const facilityTerm = parsedFilters.facility ? `%${parsedFilters.facility}%` : searchTerm;

    // Search hospitals
    if (!category || category === 'hospitals' || category === 'location') {
      let hospitalQuery = 'SELECT id, name, type, address, city, lat, lng, facilities FROM hospitals WHERE 1=1';
      const hParams = [];

      if (aiParsed) {
        if (parsedFilters.type) {
          hospitalQuery += ' AND type = ?';
          hParams.push(parsedFilters.type);
        }
        if (parsedFilters.area) {
          hospitalQuery += ' AND address LIKE ?';
          hParams.push(areaTerm);
        }
        if (parsedFilters.facility) {
          hospitalQuery += ' AND facilities LIKE ?';
          hParams.push(facilityTerm);
        }
        // Fallback match if filters result in too broad query
        if (!parsedFilters.type && !parsedFilters.area && !parsedFilters.facility) {
          hospitalQuery += ' AND (name LIKE ? OR address LIKE ?)';
          hParams.push(searchTerm, searchTerm);
        }
      } else {
        hospitalQuery += ' AND (name LIKE ? OR address LIKE ?)';
        hParams.push(searchTerm, searchTerm);
      }
      
      hospitalQuery += ' LIMIT 15';
      const [hospitals] = await pool.query(hospitalQuery, hParams);
      results.hospitals = hospitals.map(h => ({
        ...h,
        facilities: typeof h.facilities === 'string' ? JSON.parse(h.facilities) : h.facilities || []
      }));
    }

    // Search hospital doctors
    if (!category || category === 'doctors' || category === 'specialization') {
      let docQuery = `SELECT hd.id, hd.name, hd.specialization, hd.qualification, h.name AS hospital_name, 'hospital' AS source
                     FROM hospital_doctors hd
                     JOIN hospitals h ON hd.hospital_id = h.id
                     WHERE 1=1`;
      const dParams = [];

      if (aiParsed && parsedFilters.specialization) {
        docQuery += ' AND hd.specialization LIKE ?';
        dParams.push(specialtyTerm);
        if (parsedFilters.area) {
          docQuery += ' AND h.address LIKE ?';
          dParams.push(areaTerm);
        }
      } else {
        docQuery += ' AND (hd.name LIKE ? OR hd.specialization LIKE ?)';
        dParams.push(searchTerm, searchTerm);
      }

      docQuery += ' LIMIT 10';
      const [doctors] = await pool.query(docQuery, dParams);
      results.hospitalDoctors = doctors;
    }

    // Search clinic doctors
    if (!category || category === 'doctors' || category === 'specialization') {
      let clinicQuery = 'SELECT id, name, specialization, qualification, clinic_name, lat, lng, ' +
                        'consultation_fee, home_visit_fee, \'clinic\' AS source FROM clinic_doctors WHERE 1=1';
      const cParams = [];

      if (aiParsed) {
        if (parsedFilters.specialization) {
          clinicQuery += ' AND specialization LIKE ?';
          cParams.push(specialtyTerm);
        }
        if (parsedFilters.area) {
          clinicQuery += ' AND clinic_address LIKE ?';
          cParams.push(areaTerm);
        }
        if (!parsedFilters.specialization && !parsedFilters.area) {
          clinicQuery += ' AND (name LIKE ? OR specialization LIKE ? OR clinic_name LIKE ?)';
          cParams.push(searchTerm, searchTerm, searchTerm);
        }
      } else {
        clinicQuery += ' AND (name LIKE ? OR specialization LIKE ? OR clinic_name LIKE ?)';
        cParams.push(searchTerm, searchTerm, searchTerm);
      }

      clinicQuery += ' LIMIT 10';
      const [clinicDoctors] = await pool.query(clinicQuery, cParams);
      results.clinicDoctors = clinicDoctors;
    }

    // Search physiotherapists
    if (!category || category === 'doctors' || category === 'specialization') {
      let physioQuery = 'SELECT id, name, specialization, qualification, lat, lng, home_visit_fee, \'physio\' AS source FROM physiotherapists WHERE 1=1';
      const pParams = [];

      if (aiParsed) {
        if (parsedFilters.specialization) {
          physioQuery += ' AND specialization LIKE ?';
          pParams.push(specialtyTerm);
        }
        if (parsedFilters.area) {
          physioQuery += ' AND address LIKE ?';
          pParams.push(areaTerm);
        }
        if (!parsedFilters.specialization && !parsedFilters.area) {
          physioQuery += ' AND (name LIKE ? OR specialization LIKE ?)';
          pParams.push(searchTerm, searchTerm);
        }
      } else {
        physioQuery += ' AND (name LIKE ? OR specialization LIKE ?)';
        pParams.push(searchTerm, searchTerm);
      }

      physioQuery += ' LIMIT 10';
      const [physios] = await pool.query(physioQuery, pParams);
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


