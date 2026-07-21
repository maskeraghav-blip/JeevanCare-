const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jeevancare'
  });

  try {
    console.log("Applying ALTER TABLE statements...");
    
    // Add medical_history_doc to patient_profiles
    try {
      await connection.query('ALTER TABLE patient_profiles ADD COLUMN medical_history_doc VARCHAR(255)');
      console.log("Added medical_history_doc to patient_profiles");
    } catch(e) {
      if(e.code === 'ER_DUP_FIELDNAME') console.log("medical_history_doc already exists");
      else throw e;
    }

    // Add verification_doc to doctor_profiles
    try {
      await connection.query('ALTER TABLE doctor_profiles ADD COLUMN verification_doc VARCHAR(255)');
      console.log("Added verification_doc to doctor_profiles");
    } catch(e) {
      if(e.code === 'ER_DUP_FIELDNAME') console.log("verification_doc already exists in doctor_profiles");
      else throw e;
    }

    // Add verification_doc to nurse_profiles
    try {
      await connection.query('ALTER TABLE nurse_profiles ADD COLUMN verification_doc VARCHAR(255)');
      console.log("Added verification_doc to nurse_profiles");
    } catch(e) {
      if(e.code === 'ER_DUP_FIELDNAME') console.log("verification_doc already exists in nurse_profiles");
      else throw e;
    }

    console.log("Database altered successfully.");
  } catch (error) {
    console.error("Failed to alter db:", error);
  } finally {
    await connection.end();
  }
}

run();
