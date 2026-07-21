const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jeevancare'
  });

  const alterQueries = [
    // users table additions
    'ALTER TABLE users ADD COLUMN dob DATE;',
    'ALTER TABLE users ADD COLUMN gender ENUM("Male", "Female", "Other");',
    'ALTER TABLE users ADD COLUMN blood_group VARCHAR(10);',
    'ALTER TABLE users ADD COLUMN allergies TEXT;',
    'ALTER TABLE users ADD COLUMN medical_conditions TEXT;',
    'ALTER TABLE users ADD COLUMN current_medications TEXT;',

    // patient_addresses table
    `CREATE TABLE IF NOT EXISTS patient_addresses (
      id VARCHAR(36) PRIMARY KEY,
      patient_id VARCHAR(36) NOT NULL,
      label ENUM('Home', 'Parent''s House', 'Other') DEFAULT 'Home',
      address_line TEXT,
      locality VARCHAR(255),
      city VARCHAR(100),
      pincode VARCHAR(20),
      lat DECIMAL(10,8),
      lng DECIMAL(11,8),
      is_default BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    // doctor_profiles table additions
    'ALTER TABLE doctor_profiles ADD COLUMN profile_photo_url VARCHAR(255);',
    'ALTER TABLE doctor_profiles ADD COLUMN dob DATE;',
    'ALTER TABLE doctor_profiles ADD COLUMN gender ENUM("Male", "Female", "Other");',
    'ALTER TABLE doctor_profiles ADD COLUMN mobile_number VARCHAR(20);',
    'ALTER TABLE doctor_profiles ADD COLUMN residential_address TEXT;',
    'ALTER TABLE doctor_profiles ADD COLUMN registration_number VARCHAR(100);',
    'ALTER TABLE doctor_profiles ADD COLUMN registering_council VARCHAR(255);',
    'ALTER TABLE doctor_profiles ADD COLUMN qualification_certificate_url VARCHAR(255);',
    'ALTER TABLE doctor_profiles ADD COLUMN pg_qualification VARCHAR(255);',
    'ALTER TABLE doctor_profiles ADD COLUMN pg_certificate_url VARCHAR(255);',
    'ALTER TABLE doctor_profiles ADD COLUMN years_of_experience INT;',
    'ALTER TABLE doctor_profiles ADD COLUMN govt_id_proof_url VARCHAR(255);',
    'ALTER TABLE doctor_profiles ADD COLUMN photo_with_id_url VARCHAR(255);',
    'ALTER TABLE doctor_profiles ADD COLUMN verification_status ENUM("pending", "verified", "rejected") DEFAULT "pending";',
    'ALTER TABLE doctor_profiles ADD COLUMN verified_by VARCHAR(36);',
    'ALTER TABLE doctor_profiles ADD COLUMN verified_at TIMESTAMP NULL DEFAULT NULL;',

    // nurse_profiles table additions
    'ALTER TABLE nurse_profiles ADD COLUMN profile_photo_url VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN dob DATE;',
    'ALTER TABLE nurse_profiles ADD COLUMN gender ENUM("Male", "Female", "Other");',
    'ALTER TABLE nurse_profiles ADD COLUMN mobile_number VARCHAR(20);',
    'ALTER TABLE nurse_profiles ADD COLUMN residential_address TEXT;',
    'ALTER TABLE nurse_profiles ADD COLUMN registration_number VARCHAR(100);',
    'ALTER TABLE nurse_profiles ADD COLUMN registering_council VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN qualification_certificate_url VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN pg_qualification VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN pg_certificate_url VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN govt_id_proof_url VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN photo_with_id_url VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN verification_status ENUM("pending", "verified", "rejected") DEFAULT "pending";',
    'ALTER TABLE nurse_profiles ADD COLUMN verified_by VARCHAR(36);',
    'ALTER TABLE nurse_profiles ADD COLUMN verified_at TIMESTAMP NULL DEFAULT NULL;',
    'ALTER TABLE nurse_profiles ADD COLUMN additional_certifications_url VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN previous_experience_text TEXT;',
    'ALTER TABLE nurse_profiles ADD COLUMN background_check_doc_url VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN background_check_status ENUM("pending", "cleared", "flagged") DEFAULT "pending";',
    'ALTER TABLE nurse_profiles ADD COLUMN service_area TEXT;',
    'ALTER TABLE nurse_profiles ADD COLUMN fee_onetime DECIMAL(10,2);',
    'ALTER TABLE nurse_profiles ADD COLUMN fee_daily DECIMAL(10,2);',
    'ALTER TABLE nurse_profiles ADD COLUMN fee_weekly DECIMAL(10,2);',
    'ALTER TABLE nurse_profiles ADD COLUMN fee_livein DECIMAL(10,2);',
    'ALTER TABLE nurse_profiles ADD COLUMN languages_spoken VARCHAR(255);',
    'ALTER TABLE nurse_profiles ADD COLUMN availability_type VARCHAR(255);'
  ];

  try {
    console.log("Applying ALTER TABLE statements for V2 schema...");

    for (const query of alterQueries) {
      try {
        await connection.query(query);
        console.log(`Executed: ${query.substring(0, 50)}...`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists, skipping: ${query.substring(0, 50)}...`);
        } else if (e.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`Table already exists, skipping: ${query.substring(0, 50)}...`);
        } else {
          console.error(`Failed to execute: ${query}`, e);
        }
      }
    }

    console.log("Database altered successfully.");
  } catch (error) {
    console.error("Failed to alter db:", error);
  } finally {
    await connection.end();
  }
}

run();
