const fs = require('fs');

const path = 'c:/JeevanCare+/src/data/doctors.js';
let content = fs.readFileSync(path, 'utf8');

// Replace hospital name with 'Local Clinic' for doctors where isClinicDoctor is true
content = content.replace(/hospital:\s*'([^']+)',\s*city:\s*'([^']+)',\s*experience:\s*'([^']+)',\s*rating:\s*([0-9.]+)\s*,\s*verified:\s*true,\s*registration:\s*'([^']+)',\s*isClinicDoctor:\s*true/g, 
  "hospital: 'Local Clinic', city: '$2', experience: '$3', rating: $4, verified: true, registration: '$5', isClinicDoctor: true");

fs.writeFileSync(path, content);
console.log("Updated doctors.js");
