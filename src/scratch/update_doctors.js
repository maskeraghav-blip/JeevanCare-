const fs = require('fs');
let content = fs.readFileSync('c:/JeevanCare+/src/data/doctors.js', 'utf8');
let index = 1000;
content = content.replace(/}(,|s*$)/gm, (match) => {
  index++;
  const isClinic = Math.random() > 0.5 ? 'true' : 'false';
  return `, verified: true, registration: 'TSMC-${index}', isClinicDoctor: ${isClinic} ${match}`;
});
fs.writeFileSync('c:/JeevanCare+/src/data/doctors.js', content);
console.log('Doctors updated.');
