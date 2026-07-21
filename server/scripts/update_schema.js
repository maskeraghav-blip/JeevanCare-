const db = require('../config/db');

async function updateSchema() {
  console.log("Updating database schema...");
  try {
    // Helper function to safely add column if not exists
    const addColumn = async (table, columnDef) => {
      try {
        await db.query(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
        console.log(`Added column ${columnDef} to ${table}`);
      } catch (err) {
        // Ignore duplicate column name error (1060)
        if (err.errno !== 1060 && err.code !== 'ER_DUP_FIELDNAME') {
          console.error(`Error adding ${columnDef} to ${table}:`, err.message);
        }
      }
    };

    // Columns for doctor_profiles
    await addColumn('doctor_profiles', 'profile_photo_url VARCHAR(255)');
    await addColumn('doctor_profiles', 'mobile_number VARCHAR(20)');
    await addColumn('doctor_profiles', 'residential_address TEXT');
    await addColumn('doctor_profiles', "verification_status VARCHAR(50) DEFAULT 'pending'");
    await addColumn('doctor_profiles', 'verified_at TIMESTAMP NULL');
    await addColumn('doctor_profiles', 'registration_number VARCHAR(100)');
    await addColumn('doctor_profiles', 'registering_council VARCHAR(100)');
    await addColumn('doctor_profiles', 'pg_qualification VARCHAR(255)');
    await addColumn('doctor_profiles', 'years_of_experience VARCHAR(50)');
    await addColumn('doctor_profiles', 'qualification_certificate_url VARCHAR(255)');
    await addColumn('doctor_profiles', 'pg_certificate_url VARCHAR(255)');
    await addColumn('doctor_profiles', 'govt_id_proof_url VARCHAR(255)');
    await addColumn('doctor_profiles', 'photo_with_id_url VARCHAR(255)');

    // Columns for nurse_profiles
    await addColumn('nurse_profiles', 'profile_photo_url VARCHAR(255)');
    await addColumn('nurse_profiles', 'mobile_number VARCHAR(20)');
    await addColumn('nurse_profiles', 'residential_address TEXT');
    await addColumn('nurse_profiles', "verification_status VARCHAR(50) DEFAULT 'pending'");
    await addColumn('nurse_profiles', "background_check_status VARCHAR(50) DEFAULT 'pending'");
    await addColumn('nurse_profiles', 'verified_at TIMESTAMP NULL');
    await addColumn('nurse_profiles', 'previous_experience_text TEXT');
    await addColumn('nurse_profiles', 'registration_number VARCHAR(100)');
    await addColumn('nurse_profiles', 'registering_council VARCHAR(100)');
    await addColumn('nurse_profiles', 'pg_qualification VARCHAR(255)');
    await addColumn('nurse_profiles', 'years_of_experience VARCHAR(50)');
    await addColumn('nurse_profiles', 'service_area VARCHAR(255)');
    await addColumn('nurse_profiles', 'fee_onetime DECIMAL(10,2) DEFAULT 0');
    await addColumn('nurse_profiles', 'fee_daily DECIMAL(10,2) DEFAULT 0');
    await addColumn('nurse_profiles', 'fee_weekly DECIMAL(10,2) DEFAULT 0');
    await addColumn('nurse_profiles', 'fee_livein DECIMAL(10,2) DEFAULT 0');
    await addColumn('nurse_profiles', 'languages_spoken VARCHAR(255)');
    await addColumn('nurse_profiles', 'availability_type VARCHAR(100)');
    await addColumn('nurse_profiles', 'qualification_certificate_url VARCHAR(255)');
    await addColumn('nurse_profiles', 'pg_certificate_url VARCHAR(255)');
    await addColumn('nurse_profiles', 'govt_id_proof_url VARCHAR(255)');
    await addColumn('nurse_profiles', 'photo_with_id_url VARCHAR(255)');
    await addColumn('nurse_profiles', 'additional_certifications_url VARCHAR(255)');
    await addColumn('nurse_profiles', 'background_check_doc_url VARCHAR(255)');

    // Also update users table for dob and gender if missing
    await addColumn('users', 'dob DATE NULL');
    await addColumn('users', 'gender VARCHAR(20) NULL');
    await addColumn('users', 'blood_group VARCHAR(10) NULL');
    await addColumn('users', 'allergies TEXT NULL');
    await addColumn('users', 'medical_conditions TEXT NULL');
    await addColumn('users', 'current_medications TEXT NULL');

    console.log("Schema update finished successfully.");
  } catch (err) {
    console.error("Schema update error:", err);
  } finally {
    process.exit(0);
  }
}

updateSchema();
