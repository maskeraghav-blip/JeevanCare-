const fs = require('fs');
const path = require('path');

const dbJsPath = path.join(__dirname, '../src/utils/db.js');
let dbJs = fs.readFileSync(dbJsPath, 'utf8');

const newDataExports = `
export let hospitals = [];
export let doctors = [];
export let clinics = [];
export let nurses = [];
export let areas = [];

export const searchHospitals = (q) => hospitals.filter(h => h.name.toLowerCase().includes(q.toLowerCase()) || (h.area && h.area.toLowerCase().includes(q.toLowerCase())));
export const searchDoctors = (q) => doctors.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || (d.specialty && d.specialty.toLowerCase().includes(q.toLowerCase())));
export const getDoctorsBySpecialty = (s) => doctors.filter(d => d.specialty === s);
export const searchClinics = (q) => clinics.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || (c.area && c.area.toLowerCase().includes(q.toLowerCase())));

export async function loadPublicData() {
  try {
    hospitals = await getHospitals();
    doctors = await getDoctors();
    clinics = await getClinics();
    nurses = await getNurses();
    areas = [...new Set(hospitals.map(h => h.area || h.location || ''))].filter(Boolean);
    
    // Attach to window for openBookingModal legacy support
    window.hospitals = hospitals;
    window.doctors = doctors;
    window.clinics = clinics;
    window.nurses = nurses;
  } catch (err) {
    console.error("Failed to load public data", err);
  }
}
`;

dbJs += newDataExports;
fs.writeFileSync(dbJsPath, dbJs);
console.log('db.js updated');

const mainJsPath = path.join(__dirname, '../src/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Replace imports in main.js
mainJs = mainJs.replace(/import \{.*?\} from '\.\/utils\/db\.js';/, 
`import { 
  initDB, getCurrentUser, logout, 
  getHospitals, getClinics, getDoctors, getNurses,
  hospitals, doctors, clinics, nurses, areas,
  searchHospitals, searchDoctors, getDoctorsBySpecialty, searchClinics,
  loadPublicData
} from './utils/db.js';`);

// Add top-level await for loadPublicData() before router starts
mainJs = mainJs.replace('initDB();', 'await loadPublicData();\ninitDB();');

fs.writeFileSync(mainJsPath, mainJs);
console.log('main.js updated');
