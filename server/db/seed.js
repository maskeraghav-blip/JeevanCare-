// JeevanCare+ Comprehensive Database Seed Script
// Usage: cd server && node db/seed.js
// Populates all tables with real Hyderabad hospital/clinic data + mock nurse data

const mysql = require('mysql2/promise');
require('dotenv').config();

// =============================================
// HYDERABAD AREA CENTER COORDINATES
// =============================================
const AREAS = {
  'Kompally': { lat: 17.5345, lng: 78.4866 },
  'Bahadurpally': { lat: 17.5450, lng: 78.5100 },
  'Shapurnagar': { lat: 17.5150, lng: 78.4800 },
  'Dulapally': { lat: 17.5180, lng: 78.5030 },
  'Maisammaguda': { lat: 17.5250, lng: 78.4950 },
  'Medchal': { lat: 17.6297, lng: 78.4814 },
  'Dhulapally': { lat: 17.5220, lng: 78.5000 },
  'Gandimaisamma': { lat: 17.5100, lng: 78.4650 },
  'Jeedimetla': { lat: 17.5050, lng: 78.4450 },
  'Gundlapochampally': { lat: 17.5400, lng: 78.4750 },
  'Himayatnagar': { lat: 17.3950, lng: 78.4900 },
  'Koti': { lat: 17.3860, lng: 78.4870 },
  'LB Nagar': { lat: 17.3480, lng: 78.5530 },
  'Dilsukhnagar': { lat: 17.3680, lng: 78.5260 },
  'Nagaram': { lat: 17.4700, lng: 78.5700 },
  'Uppal': { lat: 17.4050, lng: 78.5600 },
  'Habsiguda': { lat: 17.4100, lng: 78.5230 },
  'Tarnaka': { lat: 17.4280, lng: 78.5230 },
  'Malkajgiri': { lat: 17.4480, lng: 78.5070 },
  'Suchitra Junction': { lat: 17.4950, lng: 78.4700 },
  'Kukatpally': { lat: 17.4850, lng: 78.4090 },
  'Hyder Nagar': { lat: 17.4930, lng: 78.3860 },
  'Miyapur': { lat: 17.4960, lng: 78.3580 },
  'Patancheru': { lat: 17.5330, lng: 78.2650 },
  'Beeramguda': { lat: 17.5200, lng: 78.3100 },
  'BHEL': { lat: 17.4810, lng: 78.3200 },
  'Chandanagar': { lat: 17.4790, lng: 78.3270 },
  'Lingampally': { lat: 17.4870, lng: 78.3180 },
  'Mehdipatnam': { lat: 17.3950, lng: 78.4420 },
  'Tolichowki': { lat: 17.3980, lng: 78.4190 },
  'Gachibowli': { lat: 17.4400, lng: 78.3480 },
  'Hitech City': { lat: 17.4480, lng: 78.3770 },
  'Ameerpet': { lat: 17.4370, lng: 78.4480 },
  'Punjagutta': { lat: 17.4310, lng: 78.4510 },
  'Begumpet': { lat: 17.4430, lng: 78.4710 },
  'Jubilee Hills': { lat: 17.4310, lng: 78.4070 },
  'Banjara Hills': { lat: 17.4150, lng: 78.4430 },
  'Somajiguda': { lat: 17.4380, lng: 78.4750 },
  'Secunderabad': { lat: 17.4400, lng: 78.4980 },
  'Kondapur': { lat: 17.4600, lng: 78.3530 },
};

// =============================================
// UTILITY FUNCTIONS
// =============================================
function getCoords(area, index) {
  const base = AREAS[area] || { lat: 17.3850, lng: 78.4867 };
  return {
    lat: +(base.lat + index * 0.0010).toFixed(4),
    lng: +(base.lng + ((index % 5) - 2) * 0.0012).toFixed(4),
  };
}

function inferFacilities(name) {
  const n = name.toLowerCase();
  if (n.includes('super special'))
    return '["Emergency 24/7","ICU","NICU","Blood Bank","Ambulance","Pharmacy","Laboratory","X-Ray","CT Scan","MRI","Dialysis"]';
  if (n.includes('women') || n.includes('children') || n.includes('maternity'))
    return '["Maternity Ward","NICU","Pediatric ICU","Pharmacy","Laboratory","Ambulance","Ultrasound"]';
  if (n.includes('eye') || n.includes('netralaya') || n.includes('vision') || n.includes('retina'))
    return '["Pharmacy","Laboratory","Laser Treatment","Day Care Surgery","Optical Shop"]';
  if (n.includes('kidney') || n.includes('nephro') || n.includes('urology'))
    return '["Emergency 24/7","ICU","Dialysis","Pharmacy","Laboratory","X-Ray"]';
  if (n.includes('heart') || n.includes('cardiac'))
    return '["Emergency 24/7","ICU","CCU","Cathlab","Ambulance","Pharmacy","Laboratory"]';
  if (n.includes('neuro'))
    return '["Emergency 24/7","ICU","MRI","CT Scan","Pharmacy","Laboratory"]';
  if (n.includes('cancer') || n.includes('oncol'))
    return '["ICU","Chemotherapy","Radiation","Pharmacy","Laboratory","Blood Bank"]';
  if (n.includes('nursing home') || n.includes('clinic') || n.includes('dispensary'))
    return '["Pharmacy","Laboratory","X-Ray"]';
  if (n.includes('multi'))
    return '["Emergency 24/7","ICU","Ambulance","Pharmacy","Laboratory","X-Ray","Ultrasound"]';
  return '["Emergency 24/7","ICU","Ambulance","Pharmacy","Laboratory","X-Ray"]';
}

function inferClinicSpecialty(name) {
  const n = name.toLowerCase();
  if (n.includes('dental') || n.includes('dentist') || n.includes('dent ')) return 'Dentistry';
  if (n.includes('skin') || n.includes('derm') || n.includes('cosmet')) return 'Dermatology';
  if (n.includes('eye') || n.includes('vision') || n.includes('nethra') || n.includes('retina') || n.includes('optic')) return 'Ophthalmology';
  if (n.includes('children') || n.includes('pediatr') || n.includes('paediatr')) return 'Pediatrics';
  if (n.includes('women') || n.includes('maternity') || n.includes('ivf') || n.includes('fertility') || n.includes('gynae') || n.includes('gyn')) return 'Obstetrics & Gynecology';
  if (n.includes('ortho') || n.includes('bone') || n.includes('joint') || n.includes('spine')) return 'Orthopedics';
  if (n.includes('ent')) return 'ENT';
  if (n.includes('piles') || n.includes('procto')) return 'Proctology';
  if (n.includes('kidney') || n.includes('nephro') || n.includes('uro')) return 'Nephrology & Urology';
  if (n.includes('hair') || n.includes('tricho')) return 'Trichology';
  if (n.includes('homeo')) return 'Homeopathy';
  if (n.includes('ayurved')) return 'Ayurveda';
  if (n.includes('thyroid') || n.includes('sugar') || n.includes('diabet') || n.includes('hormone') || n.includes('endocrin')) return 'Endocrinology';
  if (n.includes('pulmon') || n.includes('chest') || n.includes('lung')) return 'Pulmonology';
  if (n.includes('neuro') || n.includes('mind') || n.includes('psych')) return 'Neurology';
  if (n.includes('heart') || n.includes('cardi')) return 'Cardiology';
  if (n.includes('cancer') || n.includes('oncol')) return 'Oncology';
  if (n.includes('hear') || n.includes('audio')) return 'Audiology';
  if (n.includes('diagnostic') || n.includes('path') || n.includes('lab')) return 'Diagnostics';
  if (n.includes('wellness') || n.includes('vlcc')) return 'Wellness';
  if (n.includes('multispec') || n.includes('multi spec') || n.includes('poly')) return 'Multispecialty';
  if (n.includes('family')) return 'Family Medicine';
  return 'General Practice';
}

// =============================================
// PRIVATE HOSPITALS DATA (deduplicated per area)
// =============================================
const PRIVATE_HOSPITALS = {
  'Kompally': [
    'KIMS Hospitals', 'Srikara Hospitals', 'Renova Hospitals', 'Roma Hospital',
    'Wellness Hospitals - NXP', 'Stork Multispecialty Hospital', 'MedOne Hospitals',
    'Vijetha Hospitals', 'Surekha Multispeciality Hospital', 'Sai Siddhartha Super Speciality Hospital',
    'Arke Hospital', 'Lifespan Hospitals', 'Aashrita Hospital',
    'Suraksha Women & Children Hospital', 'Cloudnine Hospital', 'Ankura Hospital for Women & Children',
    'Harsha Hospitals', 'Srimeru Super Speciality Hospitals', 'Kompally Hospitals',
    'Balaji Hospital', 'Sri Srinivasa Hospital', 'Sree Netralaya Eye Hospital',
    'Aadya Hospitals', 'Pragnya Hospitals', 'Sri Sai Hospital',
  ],
  'Bahadurpally': [
    'SV Super Speciality Hospital',
  ],
  'Shapurnagar': [
    'Ram Hospital', 'Satya Sai Bhavani Hospital Pvt. Ltd.',
  ],
  'Maisammaguda': [
    'Srujana Hospitals',
  ],
  'Medchal': [
    'Medinova Super Speciality Hospital', 'Aditya Hospitals', 'Samprada Multi Speciality Hospital',
    'Leela Hospital', 'Jaitra Multispeciality Hospital', 'Shanvika Hospitals',
    'CMR Hospital', 'V V R Hospital', 'Hope Hospital', 'Navya Nursing Home',
  ],
  'Dhulapally': [
    'AAYURDHARA Hospital', 'Refracto Eye Hospitals',
  ],
  'Gandimaisamma': [
    'Arundathi Hospital', 'Surgeons Tree Hospitals', 'Vittala Hospital & Diagnostics',
    'Srinivasa Clinic', 'Srinivasa Hospital General and Diabetic',
  ],
  'Jeedimetla': [
    'Lifespan Super Speciality Hospital', 'Malla Reddy Narayana Multispeciality Hospital',
    'Konark Hospitals', 'AJUDA Hospitals', 'RamRaj Hospitals',
    'MEDIVISION Super Specialty Hospital', 'Bhaskara Multi Speciality Hospital',
    'Alavi Hospital', 'Ravi Hospital', 'SVK Hospital', 'Russh Super Speciality Hospital',
  ],
  'Gundlapochampally': [
    'Vivasvan Multispeciality Hospital', 'AB Hospital - Nithya Sai Charitable Trust',
  ],
  'Himayatnagar': [
    'Sathya Kidney Centre and Super Speciality Hospital', 'Sri Sai Srinivasa Speciality Hospital',
    'Sai Vani Super Speciality Hospital', 'Ravi Helios Hospital',
    'Lakshmi Hospital & Research Centre', 'Rainbow Children\'s Hospital',
    'BirthRight Maternity Hospital by Rainbow', 'Raaj Hospital',
    'Praja Sai Multi Speciality Hospital', 'Dr. Shankar\'s People\'s Hospital',
  ],
  'Koti': [
    'Kamineni Hospitals - King Koti', 'Fernandez Hospital', 'Aditya Hospital (Koti)',
    'Kirloskar Hospital', 'TX Hospitals Kachiguda', 'Prathima Hospitals',
  ],
  'LB Nagar': [
    'Kamineni Hospitals', 'Gleneagles AWARE Hospital', 'Srikara Hospitals (LB Nagar)',
    'Rushcare Hospitals', 'Orange Hospitals', 'Agastya Hospitals',
    'Himalaya Hospitals', 'Prasidh Hospitals', 'Nasa Hospitals',
    'Ankura Hospital for Women & Children - LB Nagar', 'Pride Hospital', 'LB Nagar Hospital',
  ],
  'Dilsukhnagar': [
    'Pranahitha Multi Speciality Hospitals', 'SAHASRA Hospitals', 'Nikhil Hospitals',
    'OMNI Hospitals - Kothapet', 'Geeta Multi Speciality Hospital',
    'Shalivahana Multi Speciality Hospital', 'Sreshta Sri Kamala Hospitals',
    'Sai Ram Super Speciality Hospitals', 'Saptagiri Hospital', 'Shalini Hospitals',
    'Asian Institute of Nephrology and Urology', 'Shanmukha Vaishnavi Hospitals',
    'Ozone Hospitals', 'G B R Hospital', 'Srihitha Hospital',
  ],
  'Nagaram': [
    'Vijaya Hospital', 'Janani Hospital', 'TRINITY Multi Speciality Hospitals',
    'RR Hospitals', 'Health Adda Hospitals', 'SV Hospital',
    'Life Line Multi Speciality Hospital', 'Siri Multi Speciality Hospital',
    'Alroyce MultiSpeciality Hospital', 'S Cure Super Specialty Hospital',
    'SigN Multi-specialty Hospital', 'Shri Adithya Hospitals',
  ],
  'Uppal': [
    'TX Hospitals Uppal', 'Onus Robotic Hospitals', 'Apex Hospitals',
    'Ankura Hospital for Women & Children - Uppal', 'ABR Neuro Multi Specialty Hospital',
    'Sri Abhaya Hospital', 'Abhaya Multi-specialty Trust Hospital',
    'Kakatiya Hospitals', 'Sumithra Hospital', 'Krishna Multi Speciality Hospital',
    'AB New Life Hospitals', 'New Life Care Hospital', 'Shreeda Children\'s Hospital',
    'KKR Hospitals (ENT & Multispecialty)', 'Apollo Clinic Uppal',
  ],
  'Habsiguda': [
    'AVR Hospital', 'Siris Hospital', 'Mithra Hospital',
    'Habsiguda Poly Clinic', 'Witus Hospital', 'Neo Vision Eye Care & Laser Centre',
    'Dr Padmaja IVF Fertility & Maternity', 'Aachi Orthopaedic Clinic & Nursing Home',
    'Jananii Hospital', 'Matrix Hospital',
  ],
  'Tarnaka': [
    'My Health Hospital', 'M G Hospital & Dialysis Center',
    'Padmavati Medical Center', 'Suraksha Children\'s Hospital',
    'Innova Hospital', 'Anand Vitero Retina Institute',
  ],
  'Malkajgiri': [
    'LK Hospital', 'ADR Hospitals', 'A1 Care Hospital',
    'Suryatej Hospital', 'Anukrishna Hospital',
    'Sree Krishna Hospital for Children and Maternity', 'God Help Hospital',
    'Sudha Hospital', 'Manjary Hospitals', 'Meena Hospital',
  ],
  'Suchitra Junction': [
    'Russh Super Speciality Hospital (Suchitra)',
  ],
  'Kukatpally': [
    'My Health Hospitals - KPHB', 'Remedy Hospitals', 'Prathima Hospitals (KPHB)',
    'Sree Manju Hospitals', 'Amor Hospitals', 'OMNI Hospitals (Kukatpally)',
    'Sankhya Hospitals', 'Medisure Hospital', 'Visishta Hospitals',
    'NextGen Hospitals', 'LandMark Hospitals', 'Ragavi Hospital',
    'Zen Hospital', 'Aster Prime Hospital', 'Sri Meenakshi Global Hospital',
  ],
  'Hyder Nagar': [
    'Rainbow Children\'s Hospital (Hyder Nagar)', 'S.V. Pooja Hospital',
    'Mythri Hospital', 'Sri Sri Holistic Hospitals', 'Prasad Hospitals',
    'Metrocare Hospital', 'People\'s Hospital',
  ],
  'Miyapur': [
    'Srikara Hospitals (Miyapur)', 'PULSE Heart Super Speciality Hospital',
    'Pranaam Hospitals', 'Sidarth Hospitals', 'Healix Hospital',
    'TX Hospitals Miyapur', 'Lotus Hospitals for Women & Children',
    'PACE Hospitals (Miyapur)', 'Archana Hospital', 'Jiva Hospitals',
    'Axis Hospital', 'Swasthika Hospital', 'Calvary Temple Hospital',
    'NEXGEN Hospital', 'Citi Neuro Centre',
  ],
  'Beeramguda': [
    'Tirumala Hospital - Multispeciality', 'Sree Aarogya Hospitals',
    'Nirvitha Hospital', 'PM Hospitals (Panacea Meridian)',
    'Shree Veda Multispeciality Hospital', 'Sreshta Multi Speciality Hospitals',
    'Mahima Hospitals', 'N Care Hospitals', 'RM Hospital',
    'Tirumala Hospital & Diagnostics', 'Sri Harinya Hospitals',
  ],
  'BHEL': [
    'Medicover Hospitals - Chandanagar', 'PANACEA MERIDIAN Hospitals',
    'Amedha Hospitals',
  ],
  'Chandanagar': [
    'PRK Hospitals', 'Sai Deepa Hospital', 'Sireesha Nursing Home',
    'Vijaya Nursing Home',
  ],
  'Lingampally': [
    'Citizens Specialty Hospital', 'SHREYA Hospitals',
    'Nandi Hospital', 'Aparna Hospitals', 'Aksha Hospitals',
  ],
  'Mehdipatnam': [
    'Premier Hospital', 'Olive Hospitals', 'Mythri Hospital (Mehdipatnam)',
    'Bliss Hospital', 'Mina Multispeciality Hospital', 'Apoorva Hospital',
    'IR Multispeciality Hospital', 'Integro Hospital',
    'Sai Preethi Lifeline Hospital', 'The Crescent Hospital',
    'Sri Vijaya Hospitals', 'Anusha Hospital',
  ],
  'Tolichowki': [
    'Apple Multi Speciality Hospital', 'Global Care Hospital',
    'Indo US Hospital', 'Ahrar Multispeciality Hospital',
    'MG Hospital (Muslim General Hospital)', 'Rose Multispeciality Hospital',
    'Neo Axis Hospital', 'SAP Kidney Center', 'Amaan Hospital',
  ],
  'Gachibowli': [
    'AIG Hospitals', 'Continental Hospitals', 'KIMS Hospitals (Gachibowli)',
    'Star Hospitals', 'Arete Hospitals', 'Himagiri Hospitals',
    'Omega Multi-speciality Hospital', 'Gaman Hospitals', 'LUX Hospitals',
    'CARE Hospitals - HITEC City', 'PACE Hospitals (Gachibowli)',
    'Apollo Spectra Hospitals - Kondapur', 'KIMS Hospitals (Kondapur)',
    'Preeti Urology & Kidney Hospital',
  ],
  'Hitech City': [
    'PACE Hospitals - HITEC City', 'Medicover Hospitals - Hitech City',
    'Yashoda Hospitals Hitec City', 'Image Hospitals',
    'SIMS - Sigma Hospitals', 'Cloudnine Hospital - Hitech City',
    'Health Valley Hospital', 'Medicover Women & Child Hospital',
  ],
  'Ameerpet': [
    'Aster Prime Hospital (Ameerpet)', 'Apollo Spectra Hospitals (Ameerpet)',
    'Pristyn Care Zoi Hospital', 'Wellness Hospitals (Ameerpet)',
    'Medi Star Hospitals', 'Shishira Hospitals', 'Nikhil Hospitals (Ameerpet)',
    'Image Hospitals (Ameerpet)', 'Raghava Multi Speciality Hospital',
    'Poornima Nursing Home', 'Sreshta Hospital', 'Green Med Hospital',
  ],
  'Punjagutta': [
    'Meditech Hospitals', 'Suvidha Hospital', 'Vivekananda Hospital',
    'The Deccan Hospital', 'Yashoda Hospitals - Somajiguda',
    'Zoi Hospitals', 'Star Hospitals - Banjara Hills',
    'Dr Agarwals Eye Hospital',
  ],
  'Begumpet': [
    'KIMS Hospitals (Begumpet)', 'Mahavir Hospital',
    'Win Vision Eye Hospitals', 'Prashamsa Hospital',
    'Vasan Eye Care Hospital', 'Neelima Hospital',
    'Virinchi Hospitals', 'LifeSpring Hospital',
  ],
};

// =============================================
// GOVERNMENT HOSPITALS
// =============================================
const GOVT_HOSPITALS = {
  'Medchal': [
    'Community Health Centre (CHC) Medchal',
    'UPHC Medchal Government Hospital',
    'Urban Primary Health Center (UPHC) Medchal',
    'ESI Dispensary Medchal',
  ],
  'Dhulapally': [
    'Basthi Dawakhana Dulapally',
  ],
  'Jeedimetla': [
    'ESI Hospital Jeedimetla',
    'Urban Primary Health Centre (UPHC) Jeedimetla',
    'UPHC Quthbullapur',
    'Ayushman Arogya Mandir',
  ],
};

// =============================================
// INDIA'S BEST MULTISPECIALTY HOSPITALS
// =============================================
const NATIONAL_HOSPITALS = [
  { name: 'Apollo Hospitals', area: 'Jubilee Hills' },
  { name: 'Manipal Hospitals', area: 'Secunderabad' },
  { name: 'CARE Hospitals', area: 'Banjara Hills' },
  { name: 'Medicover Hospitals', area: 'Hitech City' },
  { name: 'Yashoda Hospitals', area: 'Somajiguda' },
  { name: 'Narayana Health', area: 'Secunderabad' },
  { name: 'Aster DM Healthcare', area: 'Ameerpet' },
  { name: 'Fortis Healthcare', area: 'Kondapur' },
  { name: 'Max Healthcare', area: 'Gachibowli' },
];

// =============================================
// CLINICS BY AREA → clinic_doctors table
// =============================================
const CLINICS_BY_AREA = {
  'Kompally': [
    'Apollo Clinic', 'Avisha Clinics', 'Aloha Clinic', 'Plexus Diagnostics & Poly Clinics',
    'Mysha Clinic & Diagnostics', 'Shree Krushna Clinic', 'Kumar Clinic', 'Sri Jyothi Clinic',
    'Sanjeevani Thyroid, Sugar and Hormones Clinic', 'Apple Poly Clinic',
    'Anirudh Medical Centre & Polyclinic', 'Soujanya Poly Clinic', 'Mediclinic Multispecialty Clinic',
    'Rv Multi Speciality Clinic & Diagnostic', 'Arush Clinic', 'Reliance Day 2 Day Care Poly Clinic',
    'Divvi\'s Clinic', 'Aparna Nair Clinic', 'Gia Clinic', 'Sree Sai Poly Clinic And Medicals',
    'Lions Club Diagnostic Centre and Poly Clinic', 'Dr. Mithuns Poly Clinic', 'Echs Polyclinic',
    'Krisara Skin Clinic', 'Dr. Soumya\'s Aria Skin & Hair Clinic', 'Veda Skin and Hair Clinic',
    'Dr. Sr Madhav\'s Skin, Allergy, and Cosmetic Clinic', 'RK Skin Laser & Hair Transplant Clinic',
    'Dr. Vijay\'s Skin Clinic', 'Advanced Grohair & GloSkin Clinic',
  ],
  'Dulapally': [
    'SV Polyclinic & Day Care Center', 'Sri Nirvik Children Clinic And Diagnostic Centre',
    'Kk Clinic & Diagnostics', 'Scala Skin and Hair Transplant Clinic',
    'V Heal ENT, Ortho & Multi Speciality Centre', 'Janathaa Sri Hari Piles Clinic',
    'Narayana Clinics', 'Devi Clinic', 'Rk Childrens Clinic',
    'Dr. Ragghunandhan Skin Laser & Cosmetology Clinic', 'Homeocare International Pvt Ltd',
    'SV Super Speciality Outpatient Clinic', 'Lifespan Multi Specialty OPD Unit',
    'Metrocare Outpatient Centre',
  ],
  'Maisammaguda': [
    'KK Clinic & Diagnostics', 'Narayana Clinics (Maisammaguda)',
    'Balamitra Children\'s Clinic', 'Sri Nirvik Children\'s Clinic & Diagnostic Centre',
    'SV Polyclinic (Maisammaguda)', 'Max Pro Diagnostic Center & Clinic',
    'Apollo Diagnostics & Clinic (Gandi Maisamma)', 'Devi First Aid & General Clinic',
    'Janathaa Sri Hari Piles Clinic (Maisammaguda)', 'Scala Skin, Hair & Wellness Clinic',
    'V Heal ENT & Multi-Speciality Outpatient Centre', 'Metrocare Family Health Clinic',
  ],
  'Medchal': [
    'Aadi Children\'s Clinic', 'Tesla Polyclinics', 'Akruthi Dental Care',
    'Dr. Padmanabha Varma\'s Hormone India', 'Advitha Children and Multispecialty Outpatient Clinic',
    'Leela Medical Clinic', 'Jaitra Multispecialty Outpatient Unit',
    'Anushri Family Clinic', 'Sankalpa Ayurvedic Clinic & Hospital',
    'Goutam Neuro Care & ENT Clinic', 'Sankhya Outpatient & Poly Clinic',
    'SV Super Speciality Clinic Centre', 'Novacare Family Health Clinic',
    'Pragnya Health OPD Clinic', 'Srujana Skin & Hair Clinic',
    'Sri Kirthan Skin, Hair and Cosmetic Centre', 'Medicity Hospital Day Care Clinic',
    'Medinova Superspecialty Outpatient Center',
  ],
  'Dhulapally': [
    'Aayurdhara Multi Speciality Clinic & OPD', 'SV Super Speciality Clinic (Dhulapally)',
    'KK Clinic & Diagnostics (Dhulapally)', 'Sireesha Paediatric & Speciality Clinics',
    'Scala Skin and Hair Transplant Clinic (Dhulapally)', 'Janathaa Sri Hari Piles Clinic (Dhulapally)',
    'Narayana Clinics (Dhulapally)', 'Dr. Ragghunandhan Skin Laser & Cosmetology Clinic (Dhulapally)',
    'RiDiT Children Clinic', 'Roma Multi Speciality Outpatient Center',
  ],
  'Gandimaisamma': [
    'Sigma Clinic & Hospital Centre', 'Bhaskara Multi-Specialty Clinic',
    'Swikriti Children\'s Clinic', 'Galaxy Dental Care', 'Dantam Dental Shapur Nagar',
    'Rudra Kidney & Urology Clinic', 'Jeevan Rohit Women & Child Clinic',
    'Sri Venkateshwara Clinic', 'Dr. Bhavya\'s Family Dental Care',
    'SM Mind and Uro Clinic', 'Dr. Sagar\'s Homeopathy Clinic',
    'Siri Cosmetic Dental Care', 'Sri Raja Rajeshwara Ayurveda Clinic',
    'Lakshmi Clinic & Diagnostic Unit',
  ],
  'Jeedimetla': [
    'Sigma Polyclinic & Diagnostic Centre', 'Bhaskara Multi-Specialty Clinic (Jeedimetla)',
    'Swikriti Children\'s Clinic (Jeedimetla)', 'Galaxy Dental Care (Jeedimetla)',
    'Dantam Dental (Jeedimetla)', 'Rudra Kidney & Urology Clinic (Jeedimetla)',
    'Jeevan Rohit Women & Child Clinic (Jeedimetla)', 'Sri Venkateshwara General Clinic',
    'Dr. Bhavya\'s Family Dental Care (Jeedimetla)', 'SM Mind and Uro Clinic (Jeedimetla)',
    'Pulse Outpatient Medical Centre', 'Care Dental Clinic', 'Santhoshi Clinic',
    'New Sai Krupa Clinic', 'Sri Sai Krishna Poly Clinic',
    'Dr. Rama\'s First Aid & Health Care Clinic', 'Chintal Multi Specialty Poly Clinic',
    'Venkata Padma Clinic & Diagnostics', 'Dr. Reddy\'s Skin & Hair Clinic',
    'Sree Children\'s Clinic', 'Sree Dental Care & Implant Center',
    'Sri Sai Srinivasa Orthopaedic Clinic', 'Anusha Hospital & Outpatient Clinic',
    'Gayatri Clinic', 'Balaji Medical & General Clinic', 'Siri Poly Clinic',
    'Sri Krishna Clinic', 'Pragati Health Clinic', 'Suchitra Multi Specialty Poly Clinic',
    'Apollo Diagnostics & Clinic (Jeedimetla)', 'Lotus Children\'s Clinic',
    'Dr. Rao\'s ENT Super Speciality Clinic', 'Smile Dental Care',
    'Sri Sai Ram Poly Clinic', 'Priya Family Clinic', 'Vignesh Medical Clinic',
    'Pooja Health Care Centre', 'Sanjeevani Clinic', 'Sreeja First Aid Clinic',
    'Sri Venkateshwara Medical & General Clinic', 'Reddy Poly Clinic',
    'Dr. G.S. Rao General Medicine Clinic', 'Srinivasa Poly Clinic',
    'Ankura Hospital Outpatient Clinic', 'Sai Krupa Ortho Clinic',
    'Vedic Ayurveda Health Clinic', 'New Life Speciality Homeo Care',
    'Ira Clinic Suchitra', 'Harsha Dental Chintal',
    'Open Up With Pushpa Ragaveni', 'Shifa Clinic Chintal',
    'Vijaya Clinic Chintal', 'Bethesda Springs Clinic IDA Jeedimetla',
    'Qwikheal Homoeopathy', 'Tesla Diagnostics And Speciality Polyclinics',
    'Kool Smiles Multispecialty Dental Clinic', 'Sankar Skin and Hair Clinic',
    'Chest Clinic Suchitra', 'Dr Peddis Clinic', 'Prashanthi Childrens Clinic',
    'Soujanya Poly Clinic (Jeedimetla)', 'Janathaa Sri Hari Piles Clinic (Jeedimetla)',
    'Littlestar Childrens Clinic', 'Dr Ravinda Dental and Cosmetic Clinic',
    'Dr Divya\'s Dental Care IDA Jeedimetla', 'Smilife Dental & Implant Care',
    'Sirvi Dental Care & Implant Centre', 'Eversmiles Dental Solutions',
    'Eswar Dental Clinic Chintal', 'Sangamithra Dental Clinic',
    'Partha Dental Skin Hair Suchitra', 'Devi Dental Clinic',
    'Sanjeevani Children\'s Hospital', 'Happy Children\'s Hospital',
    'Laxman Childrens Hospital', 'Ragini Childrens Hospital',
    'Ravi Clinic', 'Vgk Hospital OPD', 'Medone Outpatient Clinic',
    'Suraksha Outpatient Care', 'Janapareddy Mother & Child Clinic',
    'VR Multispeciality Day Care', 'Blume Health Outpatient Unit',
    'S.V.K. Care Clinic', 'Sri Sai Dental Clinic Shapur Nagar',
    'Raghavendra First Aid Centre',
  ],
};

// =============================================
// NATIONAL CLINIC CHAINS (with specialties)
// =============================================
const NATIONAL_CLINICS = [
  { name: 'Apollo Clinic', specialty: 'Multispecialty' },
  { name: 'Express Clinics', specialty: 'Multispecialty' },
  { name: 'Clove Dental', specialty: 'Dentistry' },
  { name: 'Dr. Batra\'s', specialty: 'Homeopathy' },
  { name: 'Kaya Skin Clinic', specialty: 'Dermatology' },
  { name: 'Oliva Skin & Hair Clinic', specialty: 'Dermatology' },
  { name: 'Indira IVF', specialty: 'Fertility' },
  { name: 'Nova IVF Fertility', specialty: 'Fertility' },
  { name: 'Apollo Fertility', specialty: 'Fertility' },
  { name: 'Milann Fertility Center', specialty: 'Fertility' },
  { name: 'Oasis Fertility', specialty: 'Fertility' },
  { name: 'Birla Fertility & IVF', specialty: 'Fertility' },
  { name: 'CK Birla Fertility Clinic', specialty: 'Fertility' },
  { name: 'Asian Institute of Nephrology & Urology Clinics', specialty: 'Nephrology & Urology' },
  { name: 'Lifespan Diabetes Clinic', specialty: 'Endocrinology' },
  { name: 'Vasan Eye Care', specialty: 'Ophthalmology' },
  { name: 'Centre for Sight', specialty: 'Ophthalmology' },
  { name: 'Dr. Agarwal\'s Eye Hospital', specialty: 'Ophthalmology' },
  { name: 'ASG Eye Hospital', specialty: 'Ophthalmology' },
  { name: 'Sankara Eye Hospital', specialty: 'Ophthalmology' },
  { name: 'Nethradhama Eye Clinic', specialty: 'Ophthalmology' },
  { name: 'MedPlus Clinics', specialty: 'General Practice' },
  { name: 'Apollo Sugar Clinics', specialty: 'Endocrinology' },
  { name: 'Yashoda Clinics', specialty: 'Multispecialty' },
  { name: 'CARE Clinics', specialty: 'Multispecialty' },
  { name: 'KIMS Clinics', specialty: 'Multispecialty' },
  { name: 'Aster Clinics', specialty: 'Multispecialty' },
  { name: 'Manipal Clinics', specialty: 'Multispecialty' },
  { name: 'Narayana Clinics', specialty: 'Multispecialty' },
  { name: 'Max Smart Clinics', specialty: 'Multispecialty' },
  { name: 'Fortis Medical Centre', specialty: 'Multispecialty' },
  { name: 'Medicover Clinics', specialty: 'Multispecialty' },
  { name: 'HCG Clinics', specialty: 'Oncology' },
  { name: 'American Oncology Clinics', specialty: 'Oncology' },
  { name: 'Medall Clinics', specialty: 'Diagnostics' },
  { name: 'Dr. Lal PathLabs Collection Clinics', specialty: 'Diagnostics' },
  { name: 'SRL Diagnostics Centres', specialty: 'Diagnostics' },
  { name: 'Thyrocare Collection Centres', specialty: 'Diagnostics' },
  { name: 'Metropolis Healthcare Centres', specialty: 'Diagnostics' },
  { name: 'Vijaya Diagnostic Clinics', specialty: 'Diagnostics' },
  { name: 'PathCare Labs', specialty: 'Diagnostics' },
  { name: 'Neuberg Diagnostics', specialty: 'Diagnostics' },
  { name: 'Orange Health Clinics', specialty: 'Diagnostics' },
  { name: 'Healthians Collection Centres', specialty: 'Diagnostics' },
  { name: 'Lucid Medical Diagnostics', specialty: 'Diagnostics' },
  { name: 'RxDx Healthcare', specialty: 'Multispecialty' },
  { name: 'The Skin Clinic', specialty: 'Dermatology' },
  { name: 'SkinLab', specialty: 'Dermatology' },
  { name: 'Skin Alive Clinics', specialty: 'Dermatology' },
  { name: 'Kosmoderma Clinics', specialty: 'Dermatology' },
  { name: 'VLCC Wellness Clinic', specialty: 'Wellness' },
  { name: 'Bodycraft Clinic', specialty: 'Dermatology' },
  { name: 'RichFeel Trichology Centre', specialty: 'Trichology' },
  { name: 'Dr. Paul\'s Advanced Hair & Skin Solutions', specialty: 'Trichology' },
  { name: 'Berkowits Hair & Skin Clinic', specialty: 'Dermatology' },
  { name: 'AK Clinics', specialty: 'Hair Transplant' },
  { name: 'Eugenix Hair Sciences', specialty: 'Hair Transplant' },
  { name: 'DHI India', specialty: 'Hair Transplant' },
  { name: 'Hairline International', specialty: 'Trichology' },
  { name: 'Dermaclinix', specialty: 'Dermatology' },
  { name: 'Motherhood Clinic', specialty: 'Obstetrics & Gynecology' },
  { name: 'Cloudnine Clinic', specialty: 'Obstetrics & Gynecology' },
  { name: 'Fernandez Outpatient Clinics', specialty: 'Obstetrics & Gynecology' },
  { name: 'Rainbow Children\'s Clinic', specialty: 'Pediatrics' },
  { name: 'Ankura Clinics', specialty: 'Obstetrics & Gynecology' },
  { name: 'Smile Care Dental Clinic', specialty: 'Dentistry' },
  { name: 'Sabka Dentist', specialty: 'Dentistry' },
  { name: 'Partha Dental', specialty: 'Dentistry' },
  { name: 'Axiss Dental', specialty: 'Dentistry' },
  { name: 'Toothsi Clinics', specialty: 'Dentistry' },
  { name: 'Dentzz Dental Care', specialty: 'Dentistry' },
  { name: 'Smiles.ai Clinics', specialty: 'Dentistry' },
  { name: 'Dentique Dental Studio', specialty: 'Dentistry' },
  { name: 'MyDentist', specialty: 'Dentistry' },
  { name: 'FMS Dental Clinics', specialty: 'Dentistry' },
  { name: 'iDent Dental Clinic', specialty: 'Dentistry' },
  { name: 'Apollo White Dental', specialty: 'Dentistry' },
  { name: 'Cosmodontist', specialty: 'Dentistry' },
  { name: 'Dr. Sunny Medical Centre', specialty: 'Multispecialty' },
  { name: 'MedFine Clinics', specialty: 'Multispecialty' },
  { name: 'Pulse Clinics', specialty: 'General Practice' },
  { name: 'Quick Care Clinics', specialty: 'General Practice' },
  { name: 'Family Health Clinic', specialty: 'Family Medicine' },
  { name: 'Family Physician Clinics', specialty: 'Family Medicine' },
  { name: 'Care24 Clinics', specialty: 'Primary Care' },
  { name: 'Healthspring Clinics', specialty: 'Family Medicine' },
  { name: 'Currae Clinics', specialty: 'Multispecialty' },
  { name: 'Medcis Clinics', specialty: 'Multispecialty' },
  { name: 'ProHealth Clinics', specialty: 'Primary Care' },
  { name: 'OneHealth Clinics', specialty: 'Primary Care' },
  { name: 'Aayu Clinics', specialty: 'General Medicine' },
  { name: 'Shalby OPD Clinics', specialty: 'Orthopedics' },
  { name: 'Bone & Joint Clinic', specialty: 'Orthopedics' },
  { name: 'Spine Clinic India', specialty: 'Spine Care' },
  { name: 'Hearing Solutions Clinics', specialty: 'Audiology' },
  { name: 'Amplifon Hearing Clinics', specialty: 'Audiology' },
  { name: 'Ear Solutions Clinics', specialty: 'Audiology' },
  { name: 'Pristyn Care Clinics', specialty: 'Day Care Surgery' },
  { name: 'Nivaran Clinics', specialty: 'General Medicine' },
  { name: 'Medicover Family Clinics', specialty: 'Family Medicine' },
];

const SPECIALTY_DOCTORS = {
  'General Medicine': [
    { name: 'Dr. Mohsin Wali', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD', experience: 45, city: 'New Delhi' },
    { name: 'Dr. Lekh Ram Sharma', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD', experience: 38, city: 'New Delhi' },
    { name: 'Dr. K. Rama Murty', hospital: 'Medicover Hospitals', qualification: 'MBBS, MD', experience: 46, city: 'Visakhapatnam' },
    { name: 'Dr. Vijay Arora', hospital: 'Max Healthcare', qualification: 'MBBS, MD', experience: 33, city: 'Gurugram' },
    { name: 'Dr. Ajay Agarwal', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 34, city: 'Noida' },
    { name: 'Dr. K. V. Harish', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 28, city: 'Bengaluru' },
    { name: 'Dr. Aravind GM', hospital: 'Manipal Hospitals', qualification: 'MBBS, MS', experience: 25, city: 'Bengaluru' },
    { name: 'Dr. T. J. Pradeep Kumar', hospital: 'Medicover Hospitals', qualification: 'MBBS, MD', experience: 28, city: 'Bengaluru' },
    { name: 'Dr. Pradeep Kumar Mishra', hospital: 'Medicover Hospitals', qualification: 'MBBS, MD', experience: 25, city: 'Secunderabad' },
  ],
  'General Surgery': [
    { name: 'Dr. Pradeep Chowbey', hospital: 'Max Healthcare', qualification: 'MBBS, MS, FACS', experience: 40, city: 'New Delhi' },
    { name: 'Dr. Rajesh Khullar', hospital: 'Medicover Hospitals', qualification: 'MBBS, MS', experience: 30, city: 'Gurugram' },
    { name: 'Dr. Arvind Kumar', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS', experience: 35, city: 'New Delhi' },
    { name: 'Dr. P. Balachandar', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS', experience: 30, city: 'Chennai' },
    { name: 'Dr. Sandeep Nayak', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS, MCh', experience: 25, city: 'Bengaluru' },
    { name: 'Dr. Nandakishore S. K.', hospital: 'Manipal Hospitals', qualification: 'MBBS, MS', experience: 20, city: 'Bengaluru' },
  ],
  'Cardiology': [
    { name: 'Dr. Naresh Trehan', hospital: 'Medicover Hospitals', qualification: 'MBBS, MS, MCh', experience: 45, city: 'Gurugram' },
    { name: 'Dr. Devi Prasad Shetty', hospital: 'Narayana Health', qualification: 'MBBS, MS, MCh', experience: 40, city: 'Bengaluru' },
    { name: 'Dr. Ashok Seth', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD, DM', experience: 40, city: 'New Delhi' },
    { name: 'Dr. Balbir Singh', hospital: 'Max Healthcare', qualification: 'MBBS, MD, DM', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Ramakanta Panda', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, MCh', experience: 35, city: 'New Delhi' },
    { name: 'Dr. T. S. Kler', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD, DM', experience: 38, city: 'New Delhi' },
    { name: 'Dr. K. M. Cherian', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, MCh', experience: 42, city: 'Chennai' },
    { name: 'Dr. Z. S. Meharwal', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS, MCh', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Upendra Kaul', hospital: 'Max Healthcare', qualification: 'MBBS, MD, DM', experience: 40, city: 'New Delhi' },
    { name: 'Dr. Y. K. Mishra', hospital: 'Manipal Hospitals', qualification: 'MBBS, MS, MCh', experience: 35, city: 'New Delhi' }
  ],
  'Neurology': [
    { name: 'Dr. Sandeep Vaishya', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS, MCh', experience: 30, city: 'Gurugram' },
    { name: 'Dr. V. S. Mehta', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, MCh', experience: 40, city: 'New Delhi' },
    { name: 'Dr. Rana Patir', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS, MCh', experience: 32, city: 'New Delhi' },
    { name: 'Dr. Alok Ranjan', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, MCh', experience: 28, city: 'Hyderabad' },
    { name: 'Dr. Sudhir Kumar', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD, DM', experience: 25, city: 'Hyderabad' },
    { name: 'Dr. K. Sridhar', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, MCh', experience: 30, city: 'Chennai' },
    { name: 'Dr. Praveen Gupta', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD, DM', experience: 30, city: 'Gurugram' },
    { name: 'Dr. Man Mohan Mehndiratta', hospital: 'Max Healthcare', qualification: 'MBBS, MD, DM', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Rajendra Prasad', hospital: 'Apollo Hospitals', qualification: 'MBBS, FRCS', experience: 38, city: 'New Delhi' },
    { name: 'Dr. Atul Prasad', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD, DM', experience: 30, city: 'New Delhi' }
  ],
  'Orthopedics': [
    { name: 'Dr. Ramneek Mahajan', hospital: 'Max Healthcare', qualification: 'MBBS, MS', experience: 30, city: 'New Delhi' },
    { name: 'Dr. IPS Oberoi', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Ashok Rajgopal', hospital: 'Medicover Hospitals', qualification: 'MBBS, MS', experience: 40, city: 'Gurugram' },
    { name: 'Dr. Dinshaw Pardiwala', hospital: 'Kokilaben Hospital', qualification: 'MBBS, MS', experience: 28, city: 'Mumbai' },
    { name: 'Dr. Sanjay Desai', hospital: 'Hinduja Hospital', qualification: 'MBBS, MS', experience: 32, city: 'Mumbai' },
    { name: 'Dr. S. K. S. Marya', hospital: 'Max Healthcare', qualification: 'MBBS, MS', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Bipin Walia', hospital: 'Max Healthcare', qualification: 'MBBS, MS, MCh', experience: 30, city: 'New Delhi' },
    { name: 'Dr. H. S. Chhabra', hospital: 'Indian Spinal Injuries Centre', qualification: 'MBBS, MS', experience: 32, city: 'New Delhi' },
    { name: 'Dr. A. V. Gurava Reddy', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, MCh', experience: 25, city: 'Hyderabad' },
    { name: 'Dr. Abhay Nene', hospital: 'Wockhardt Hospital', qualification: 'MBBS, MS', experience: 24, city: 'Mumbai' }
  ],
  'Oncology': [
    { name: 'Dr. Vinod Raina', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD, DM', experience: 40, city: 'New Delhi' },
    { name: 'Dr. Suresh Advani', hospital: 'Jaslok Hospital', qualification: 'MBBS, MD', experience: 45, city: 'Mumbai' },
    { name: 'Dr. Rajendra Badwe', hospital: 'Tata Memorial Hospital', qualification: 'MBBS, MS', experience: 38, city: 'Mumbai' },
    { name: 'Dr. Vijay Anand Reddy', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD', experience: 30, city: 'Hyderabad' },
    { name: 'Dr. P. Jagannath', hospital: 'Lilavati Hospital', qualification: 'MBBS, MS', experience: 35, city: 'Mumbai' },
    { name: 'Dr. Harit Chaturvedi', hospital: 'Max Healthcare', qualification: 'MBBS, MS, MCh', experience: 30, city: 'New Delhi' },
    { name: 'Dr. G. V. Rao', hospital: 'AIG Hospitals', qualification: 'MBBS, MS, MCh', experience: 32, city: 'Hyderabad' },
    { name: 'Dr. Shailesh Shrikhande', hospital: 'Tata Memorial Hospital', qualification: 'MBBS, MS', experience: 25, city: 'Mumbai' },
    { name: 'Dr. Amit Agarwal', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS', experience: 24, city: 'Noida' },
    { name: 'Dr. Kumar Prabhash', hospital: 'Tata Memorial Hospital', qualification: 'MBBS, MD', experience: 26, city: 'Mumbai' }
  ],
  'Nephrology': [
    { name: 'Dr. H. Sudarshan Ballal', hospital: 'Manipal Hospitals', qualification: 'MBBS, MD, DM', experience: 40, city: 'Bengaluru' },
    { name: 'Dr. Georgi Abraham', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD, DM', experience: 35, city: 'Chennai' },
    { name: 'Dr. Vivekanand Jha', hospital: 'Medicover Hospitals', qualification: 'MBBS, MD, DM', experience: 30, city: 'New Delhi' },
    { name: 'Dr. Sunil Prakash', hospital: 'BLK-Max Hospital', qualification: 'MBBS, MD, DM', experience: 32, city: 'New Delhi' },
    { name: 'Dr. Raj Kumar Sharma', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD, DM', experience: 35, city: 'Mohali' },
    { name: 'Dr. Anil Kumar Bhansali', hospital: 'Max Healthcare', qualification: 'MBBS, MD, DM', experience: 30, city: 'New Delhi' },
    { name: 'Dr. Sandeep Guleria', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, DNB', experience: 34, city: 'New Delhi' },
    { name: 'Dr. Ajit Huilgol', hospital: 'Columbia Asia Hospital', qualification: 'MBBS, MD', experience: 32, city: 'Bengaluru' },
    { name: 'Dr. Kute V. B.', hospital: 'IKDRC', qualification: 'MBBS, MD, DM', experience: 22, city: 'Ahmedabad' },
    { name: 'Dr. Pradeep Varma', hospital: 'Care Hospitals', qualification: 'MBBS, MD, DM', experience: 25, city: 'Hyderabad' }
  ],
  'Gastroenterology': [
    { name: 'Dr. D. Nageshwar Reddy', hospital: 'AIG Hospitals', qualification: 'MBBS, MD, DM', experience: 40, city: 'Hyderabad' },
    { name: 'Dr. Samiran Nundy', hospital: 'Max Healthcare', qualification: 'MBBS, MS', experience: 45, city: 'New Delhi' },
    { name: 'Dr. Randhir Sud', hospital: 'Medicover Hospitals', qualification: 'MBBS, MS', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Mohan Thomas', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD', experience: 32, city: 'Chennai' },
    { name: 'Dr. Subhash Gupta', hospital: 'Max Healthcare', qualification: 'MBBS, MS', experience: 30, city: 'New Delhi' },
    { name: 'Dr. Arvinder Singh Soin', hospital: 'Medanta Hospital', qualification: 'MBBS, MS, FRCS', experience: 34, city: 'Gurugram' },
    { name: 'Dr. Deepak Govil', hospital: 'Max Healthcare', qualification: 'MBBS, MS', experience: 28, city: 'New Delhi' },
    { name: 'Dr. Vivek Vij', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS', experience: 25, city: 'Noida' },
    { name: 'Dr. S. M. Shuaib Zaidi', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS', experience: 24, city: 'New Delhi' },
    { name: 'Dr. A. S. Soin', hospital: 'Medanta Hospital', qualification: 'MBBS, MS', experience: 34, city: 'Gurugram' }
  ],
  'Pulmonology': [
    { name: 'Dr. Arvind Kumar', hospital: 'Medanta Hospital', qualification: 'MBBS, MS', experience: 35, city: 'Gurugram' },
    { name: 'Dr. S. K. Chhabra', hospital: 'Primus Super Speciality', qualification: 'MBBS, MD', experience: 38, city: 'New Delhi' },
    { name: 'Dr. Randeep Guleria', hospital: 'Medicover Hospitals', qualification: 'MBBS, MD', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Deepak Talwar', hospital: 'Max Healthcare', qualification: 'MBBS, MD', experience: 30, city: 'New Delhi' },
    { name: 'Dr. Raj B. Singh', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD', experience: 32, city: 'Chennai' },
    { name: 'Dr. Hemant Kalra', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 26, city: 'New Delhi' },
    { name: 'Dr. Sandeep Nayar', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 28, city: 'New Delhi' },
    { name: 'Dr. J. C. Suri', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 38, city: 'New Delhi' },
    { name: 'Dr. Bharat Gopal', hospital: 'Max Healthcare', qualification: 'MBBS, MD', experience: 25, city: 'New Delhi' },
    { name: 'Dr. Vikas Maurya', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 22, city: 'New Delhi' }
  ],
  'Urology': [
    { name: 'Dr. Mahesh Desai', hospital: 'Muljibhai Patel Urology', qualification: 'MBBS, MS, MCh', experience: 40, city: 'Nadiad' },
    { name: 'Dr. Rajesh Ahlawat', hospital: 'Medicover Hospitals', qualification: 'MBBS, MS, MCh', experience: 35, city: 'Gurugram' },
    { name: 'Dr. Anant Kumar', hospital: 'Max Healthcare', qualification: 'MBBS, MS, MCh', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Sanjay Gogoi', hospital: 'Manipal Hospitals', qualification: 'MBBS, MS, MCh', experience: 26, city: 'New Delhi' },
    { name: 'Dr. Ashish Sabharwal', hospital: 'Apollo Hospitals', qualification: 'MBBS, MS, MCh', experience: 25, city: 'New Delhi' },
    { name: 'Dr. Narmada Prasad Gupta', hospital: 'Medanta Hospital', qualification: 'MBBS, MS, MCh', experience: 42, city: 'Gurugram' },
    { name: 'Dr. Mohan Keshavamurthy', hospital: 'Fortis Healthcare', qualification: 'MBBS, MS, MCh', experience: 28, city: 'Bengaluru' },
    { name: 'Dr. Rakesh Kapoor', hospital: 'SGPGIMS', qualification: 'MBBS, MS, MCh', experience: 32, city: 'Lucknow' },
    { name: 'Dr. R. V. Prabhu', hospital: 'KMC Hospital', qualification: 'MBBS, MS, MCh', experience: 30, city: 'Mangaluru' },
    { name: 'Dr. Ravi Mohanka', hospital: 'Global Hospitals', qualification: 'MBBS, MS, MCh', experience: 22, city: 'Mumbai' }
  ],
  'Obstetrics & Gynecology': [
    { name: 'Dr. Kamini Rao', hospital: 'Manipal Hospitals', qualification: 'MBBS, MD, DGO', experience: 35, city: 'Bengaluru' },
    { name: 'Dr. Shobha Gupta', hospital: 'Mother\'s Lap IVF Center', qualification: 'MBBS, MD', experience: 24, city: 'New Delhi' },
    { name: 'Dr. Renu Raina Sehgal', hospital: 'Artemis Hospital', qualification: 'MBBS, MD', experience: 25, city: 'Gurugram' },
    { name: 'Dr. Indira Hinduja', hospital: 'Jaslok Hospital', qualification: 'MBBS, MD, PhD', experience: 42, city: 'Mumbai' },
    { name: 'Dr. Nandita Palshetkar', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD, DGO', experience: 30, city: 'Mumbai' },
    { name: 'Dr. Sadhna Desai', hospital: 'Fertility Clinic', qualification: 'MBBS, MD', experience: 38, city: 'Mumbai' },
    { name: 'Dr. Alka Kriplani', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Neerja Goel', hospital: 'Max Healthcare', qualification: 'MBBS, MD', experience: 32, city: 'New Delhi' },
    { name: 'Dr. Sunita Tandulwadkar', hospital: 'Ruby Hall Clinic', qualification: 'MBBS, MD', experience: 28, city: 'Pune' },
    { name: 'Dr. Shirish Sheth', hospital: 'Breach Candy Hospital', qualification: 'MBBS, MD', experience: 45, city: 'Mumbai' }
  ],
  'Pediatrics': [
    { name: 'Dr. Krishna Chugh', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 35, city: 'Gurugram' },
    { name: 'Dr. Suresh Birajdar', hospital: 'Narayana Health', qualification: 'MBBS, MD', experience: 25, city: 'Bengaluru' },
    { name: 'Dr. S. K. Kabra', hospital: 'AIIMS', qualification: 'MBBS, MD', experience: 32, city: 'New Delhi' },
    { name: 'Dr. V. K. Paul', hospital: 'NITI Aayog / AIIMS', qualification: 'MBBS, MD, PhD', experience: 38, city: 'New Delhi' },
    { name: 'Dr. Bakul Parekh', hospital: 'Apollo Hospitals', qualification: 'MBBS, MD', experience: 30, city: 'Mumbai' },
    { name: 'Dr. P. M. Nair', hospital: 'Amrita Hospital', qualification: 'MBBS, MD', experience: 40, city: 'Kochi' },
    { name: 'Dr. Meharban Singh', hospital: 'AIIMS', qualification: 'MBBS, MD', experience: 45, city: 'New Delhi' },
    { name: 'Dr. Gautham Suresh', hospital: 'Medanta Hospital', qualification: 'MBBS, MD', experience: 24, city: 'Gurugram' },
    { name: 'Dr. Santosh Soans', hospital: 'AJ Hospital', qualification: 'MBBS, MD', experience: 28, city: 'Mangaluru' },
    { name: 'Dr. Jacob Puliyel', hospital: 'St. Stephens Hospital', qualification: 'MBBS, MD', experience: 35, city: 'New Delhi' }
  ],
  'ICU & Critical Care': [
    { name: 'Dr. Sahish Vaikunth Kamat', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 24, city: 'Mumbai' },
    { name: 'Dr. Yatin Mehta', hospital: 'Medanta Hospital', qualification: 'MBBS, MD', experience: 35, city: 'Gurugram' },
    { name: 'Dr. Subhal Dixit', hospital: 'Sanjeevan Hospital', qualification: 'MBBS, MD', experience: 26, city: 'Pune' },
    { name: 'Dr. Dhruva Chaudhry', hospital: 'PGIMS', qualification: 'MBBS, MD', experience: 30, city: 'Rohtak' },
    { name: 'Dr. Rajesh Chawla', hospital: 'Indraprastha Apollo', qualification: 'MBBS, MD', experience: 32, city: 'New Delhi' },
    { name: 'Dr. Kapil Zirpe', hospital: 'Ruby Hall Clinic', qualification: 'MBBS, MD', experience: 28, city: 'Pune' },
    { name: 'Dr. Deepak Govil', hospital: 'Max Healthcare', qualification: 'MBBS, MD', experience: 28, city: 'New Delhi' },
    { name: 'Dr. Atul Kulkarni', hospital: 'Tata Memorial Hospital', qualification: 'MBBS, MD', experience: 30, city: 'Mumbai' },
    { name: 'Dr. Srinivas Samavedam', hospital: 'Care Hospitals', qualification: 'MBBS, MD', experience: 25, city: 'Hyderabad' },
    { name: 'Dr. Subhash Todi', hospital: 'AMRI Hospitals', qualification: 'MBBS, MD', experience: 34, city: 'Kolkata' }
  ],
  'Radiology & Imaging': [
    { name: 'Dr. Harsh Mahajan', hospital: 'Medicover Hospitals', qualification: 'MBBS, MD', experience: 35, city: 'New Delhi' },
    { name: 'Dr. Arjun Kalyanpur', hospital: 'Manipal Hospitals', qualification: 'MBBS, MD', experience: 30, city: 'Bengaluru' },
    { name: 'Dr. Jitendra Kumar', hospital: 'Max Healthcare', qualification: 'MBBS, MD', experience: 28, city: 'New Delhi' },
    { name: 'Dr. C. Amarnath', hospital: 'Government Stanley Hospital', qualification: 'MBBS, MD', experience: 32, city: 'Chennai' },
    { name: 'Dr. N. R. Jagannathan', hospital: 'AIIMS', qualification: 'PhD (MRI)', experience: 38, city: 'New Delhi' },
    { name: 'Dr. Sanjay Sharma', hospital: 'AIIMS', qualification: 'MBBS, MD', experience: 30, city: 'New Delhi' },
    { name: 'Dr. Sandeep Sharma', hospital: 'Fortis Healthcare', qualification: 'MBBS, MD', experience: 25, city: 'Noida' },
    { name: 'Dr. S. K. Gupta', hospital: 'Max Healthcare', qualification: 'MBBS, MD', experience: 34, city: 'New Delhi' },
    { name: 'Dr. N. K. Venkataramana', hospital: 'BGS Gleneagles', qualification: 'MBBS, MS', experience: 35, city: 'Bengaluru' },
    { name: 'Dr. Rahul Deep G', hospital: 'Altius Hospital', qualification: 'MBBS, MD', experience: 22, city: 'Bengaluru' }
  ]
};

// =============================================
// PHYSIOTHERAPISTS
// =============================================
const PHYSIOTHERAPISTS = [
  { name: 'Dr. Ali Irani', specialty: 'Sports Physiotherapy', city: 'Mumbai', experience: 20, qualification: 'BPTh, MPTh (Sports)' },
  { name: 'Dr. Nikhil Latey', specialty: 'Sports & Musculoskeletal Physiotherapy', city: 'Mumbai', experience: 18, qualification: 'BPTh, MPTh (Musculoskeletal)' },
  { name: 'Dr. Deepa Narayan', specialty: 'Neurological Rehabilitation', city: 'Bengaluru', experience: 22, qualification: 'BPTh, MPTh (Neuro)' },
  { name: 'Dr. G. Bakthavatchalam', specialty: 'Orthopedic & Sports Rehabilitation', city: 'Chennai', experience: 25, qualification: 'BPTh, MPTh (Ortho)' },
  { name: 'Dr. S. Muthukumaran', specialty: 'Orthopedic Physiotherapy', city: 'Chennai', experience: 20, qualification: 'BPTh, MPTh (Ortho)' },
  { name: 'Dr. K. S. Rekha', specialty: 'Women\'s Health & Physiotherapy', city: 'Bengaluru', experience: 18, qualification: 'BPTh, MPTh' },
  { name: 'Dr. Rakesh Patel', specialty: 'Spine & Sports Rehabilitation', city: 'Ahmedabad', experience: 15, qualification: 'BPTh, MPTh (Sports)' },
  { name: 'Dr. S. Rajasekar', specialty: 'Musculoskeletal Rehabilitation', city: 'Coimbatore', experience: 17, qualification: 'BPTh, MPTh' },
  { name: 'Dr. Ashish Bhatia', specialty: 'Sports Injury Rehabilitation', city: 'New Delhi', experience: 20, qualification: 'BPTh, MPTh (Sports)' },
  { name: 'Dr. Rajesh K. Verma', specialty: 'Neuro & Orthopedic Physiotherapy', city: 'New Delhi', experience: 22, qualification: 'BPTh, MPTh (Neuro-Ortho)' },
];

// =============================================
// MOCK NURSES (unchanged from original)
// =============================================
const MOCK_NURSES = [
  { name: 'Priya Sharma', experience: 8, specialization: 'elderly care', rating: 4.8, availability: 'all', rate: 1500, phone: '9876543201', bio: 'Experienced in geriatric care with 8 years of dedicated service. Certified in elderly patient management and palliative care.' },
  { name: 'Ravi Kumar', experience: 5, specialization: 'post-op', rating: 4.5, availability: 'daily', rate: 1800, phone: '9876543202', bio: 'Specialized in post-operative care with expertise in wound management and patient rehabilitation.' },
  { name: 'Anjali Reddy', experience: 12, specialization: 'ICU', rating: 4.9, availability: 'all', rate: 2500, phone: '9876543203', bio: 'Senior ICU nurse with 12 years of critical care experience. Trained in ventilator management and emergency protocols.' },
  { name: 'Mohammed Farhan', experience: 3, specialization: 'general', rating: 4.2, availability: 'one-time', rate: 1200, phone: '9876543204', bio: 'General nursing care specialist. Skilled in vital monitoring, medication administration, and patient comfort.' },
  { name: 'Lakshmi Devi', experience: 10, specialization: 'pediatric', rating: 4.7, availability: 'all', rate: 1600, phone: '9876543205', bio: 'Pediatric nursing specialist with a decade of experience in child healthcare, vaccinations, and neonatal care.' },
  { name: 'Suresh Babu', experience: 6, specialization: 'elderly care', rating: 4.4, availability: 'weekly', rate: 1400, phone: '9876543206', bio: 'Compassionate caregiver specializing in elderly home care. Certified in dementia care and mobility assistance.' },
  { name: 'Kavitha Nair', experience: 7, specialization: 'post-op', rating: 4.6, availability: 'daily', rate: 1700, phone: '9876543207', bio: 'Post-surgical recovery specialist with training in orthopedic and cardiac post-op care.' },
  { name: 'Deepak Verma', experience: 4, specialization: 'general', rating: 4.3, availability: 'all', rate: 1300, phone: '9876543208', bio: 'Versatile general nurse experienced in home healthcare, chronic disease management, and patient education.' },
  { name: 'Fatima Begum', experience: 15, specialization: 'ICU', rating: 5.0, availability: 'daily', rate: 3000, phone: '9876543209', bio: 'Head nurse with 15 years of ICU and critical care experience. Expert in trauma care and advanced life support.' },
  { name: 'Arjun Rao', experience: 2, specialization: 'pediatric', rating: 4.1, availability: 'one-time', rate: 1100, phone: '9876543210', bio: 'Young and energetic pediatric nurse passionate about child health and wellness. Recently certified in PALS.' },
];

const MOCK_REVIEWS = [
  { nurse_idx: 0, reviewer: 'Ramesh K.', rating: 5.0, comment: 'Priya took excellent care of my mother. Very patient and knowledgeable.' },
  { nurse_idx: 0, reviewer: 'Sunita P.', rating: 4.5, comment: 'Professional and caring. Highly recommended for elderly care.' },
  { nurse_idx: 0, reviewer: 'Venkat R.', rating: 4.8, comment: 'My father felt very comfortable with Priya. She is thorough and kind.' },
  { nurse_idx: 1, reviewer: 'Anil S.', rating: 4.5, comment: 'Ravi was very helpful during my recovery after knee surgery.' },
  { nurse_idx: 1, reviewer: 'Meena D.', rating: 4.5, comment: 'Good post-op care. He follows all protocols carefully.' },
  { nurse_idx: 2, reviewer: 'Srinivas M.', rating: 5.0, comment: 'Anjali is the best ICU nurse. Saved my father during a critical moment.' },
  { nurse_idx: 2, reviewer: 'Padma L.', rating: 4.8, comment: 'Extremely skilled and calm under pressure. A true professional.' },
  { nurse_idx: 3, reviewer: 'Rajesh T.', rating: 4.0, comment: 'Mohammed provided good basic care for a one-time visit.' },
  { nurse_idx: 3, reviewer: 'Swathi N.', rating: 4.3, comment: 'Reliable and punctual. Good for general check-ups at home.' },
  { nurse_idx: 4, reviewer: 'Harini V.', rating: 4.7, comment: 'Lakshmi is wonderful with children. My kids love her!' },
  { nurse_idx: 4, reviewer: 'Prakash G.', rating: 4.8, comment: 'Outstanding pediatric care. Very gentle and experienced.' },
  { nurse_idx: 5, reviewer: 'Bhavani S.', rating: 4.5, comment: 'Suresh took great care of my grandmother for two weeks.' },
  { nurse_idx: 6, reviewer: 'Madhavi R.', rating: 4.6, comment: 'Kavitha helped my husband recover smoothly after his surgery.' },
  { nurse_idx: 7, reviewer: 'Naresh B.', rating: 4.2, comment: 'Deepak is a competent general nurse. Handles everything professionally.' },
  { nurse_idx: 8, reviewer: 'Chandra K.', rating: 5.0, comment: 'Fatima is simply the best. Her ICU experience is unmatched.' },
  { nurse_idx: 8, reviewer: 'Sravani P.', rating: 5.0, comment: 'We were lucky to have Fatima during a medical emergency. Life saver!' },
  { nurse_idx: 9, reviewer: 'Keerthi M.', rating: 4.0, comment: 'Arjun is young but very dedicated. Good with children.' },
];

// =============================================
// SEEDING LOGIC
// =============================================
async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jeevancare_db',
    port: parseInt(process.env.DB_PORT) || 3306,
  });

  console.log('✅ Connected to MySQL. Starting comprehensive seed...\n');

  // Disable FK checks for truncation
  await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
  const tables = ['nurse_reviews', 'nurse_bookings', 'home_visit_appointments', 'consent_forms', 'complaints', 'hospital_doctors', 'clinic_doctors', 'physiotherapists', 'hospitals', 'nurses'];
  for (const table of tables) {
    await connection.execute(`TRUNCATE TABLE ${table}`);
    console.log(`   Truncated: ${table}`);
  }
  await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
  console.log('');

  // ---- 1. SEED MOCK NURSES ----
  console.log('🩺 Seeding mock nurses...');
  const nurseIds = [];
  for (const nurse of MOCK_NURSES) {
    const [result] = await connection.execute(
      `INSERT INTO nurses (name, experience_years, specialization, rating, availability_type, daily_rate, phone, bio, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Hyderabad', 'Telangana')`,
      [nurse.name, nurse.experience, nurse.specialization, nurse.rating, nurse.availability, nurse.rate, nurse.phone, nurse.bio]
    );
    nurseIds.push(result.insertId);
  }
  console.log(`   Inserted ${MOCK_NURSES.length} nurses`);

  // ---- SEED NURSE REVIEWS ----
  for (const review of MOCK_REVIEWS) {
    await connection.execute(
      `INSERT INTO nurse_reviews (nurse_id, reviewer_name, rating, comment) VALUES (?, ?, ?, ?)`,
      [nurseIds[review.nurse_idx], review.reviewer, review.rating, review.comment]
    );
  }
  console.log(`   Inserted ${MOCK_REVIEWS.length} nurse reviews\n`);

  // ---- 2. SEED PRIVATE HOSPITALS ----
  console.log('🏥 Seeding private hospitals...');
  let hospitalCount = 0;
  const hospitalNameToId = {};

  for (const [area, hospitals] of Object.entries(PRIVATE_HOSPITALS)) {
    for (let i = 0; i < hospitals.length; i++) {
      const name = hospitals[i];
      const coords = getCoords(area, i);
      const facilities = inferFacilities(name);

      const [result] = await connection.execute(
        `INSERT INTO hospitals (name, type, address, city, state, lat, lng, facilities, description) VALUES (?, 'private', ?, 'Hyderabad', 'Telangana', ?, ?, ?, ?)`,
        [name, `${area}, Hyderabad, Telangana`, coords.lat, coords.lng, facilities, `Private hospital in ${area}, Hyderabad`]
      );
      hospitalNameToId[name.toLowerCase()] = result.insertId;
      hospitalCount++;
    }
  }
  console.log(`   Inserted ${hospitalCount} private hospitals`);

  // ---- 3. SEED GOVERNMENT HOSPITALS ----
  console.log('🏛️  Seeding government hospitals...');
  let govtCount = 0;
  for (const [area, hospitals] of Object.entries(GOVT_HOSPITALS)) {
    for (let i = 0; i < hospitals.length; i++) {
      const name = hospitals[i];
      const coords = getCoords(area, i);

      const [result] = await connection.execute(
        `INSERT INTO hospitals (name, type, address, city, state, lat, lng, facilities, description) VALUES (?, 'government', ?, 'Hyderabad', 'Telangana', ?, ?, ?, ?)`,
        [name, `${area}, Hyderabad, Telangana`, coords.lat, coords.lng,
         '["Emergency 24/7","OPD","Pharmacy","Laboratory","X-Ray","Ambulance"]',
         `Government healthcare facility in ${area}, Hyderabad`]
      );
      hospitalNameToId[name.toLowerCase()] = result.insertId;
      govtCount++;
    }
  }
  console.log(`   Inserted ${govtCount} government hospitals`);

  // ---- 4. SEED NATIONAL FLAGSHIP HOSPITALS ----
  console.log('⭐ Seeding India\'s best multispecialty hospitals...');
  for (let i = 0; i < NATIONAL_HOSPITALS.length; i++) {
    const h = NATIONAL_HOSPITALS[i];
    const coords = getCoords(h.area, i);
    const [result] = await connection.execute(
      `INSERT INTO hospitals (name, type, address, city, state, lat, lng, facilities, description) VALUES (?, 'private', ?, 'Hyderabad', 'Telangana', ?, ?, ?, ?)`,
      [`${h.name} (Flagship)`, `${h.area}, Hyderabad, Telangana`, coords.lat, coords.lng,
       '["Emergency 24/7","ICU","NICU","Blood Bank","Ambulance","Pharmacy","Laboratory","X-Ray","CT Scan","MRI","Dialysis","Operation Theatre","Cathlab"]',
       `Flagship branch of ${h.name} - one of India's best multispecialty hospital chains`]
    );
    hospitalNameToId[h.name.toLowerCase()] = result.insertId;
  }
  console.log(`   Inserted ${NATIONAL_HOSPITALS.length} flagship hospitals\n`);

  // ---- 5. SEED HOSPITAL DOCTORS ----
  console.log('👨‍⚕️ Seeding specialty doctors...');
  let doctorCount = 0;
  for (const [specialty, doctors] of Object.entries(SPECIALTY_DOCTORS)) {
    for (const doc of doctors) {
      // Find the hospital ID (try exact match, then fuzzy)
      let hospitalId = null;
      const hospitalNameLower = doc.hospital.toLowerCase();
      
      // Try exact match
      if (hospitalNameToId[hospitalNameLower]) {
        hospitalId = hospitalNameToId[hospitalNameLower];
      } else {
        // Try partial match
        for (const [key, id] of Object.entries(hospitalNameToId)) {
          if (key.includes(hospitalNameLower) || hospitalNameLower.includes(key.replace(/\s*\(.*\)/, '').trim())) {
            hospitalId = id;
            break;
          }
        }
      }

      // If no hospital found, use first matching national hospital
      if (!hospitalId) {
        const fallbackKey = Object.keys(hospitalNameToId).find(k => k.includes('apollo') || k.includes('medicover'));
        hospitalId = fallbackKey ? hospitalNameToId[fallbackKey] : 1;
      }

      await connection.execute(
        `INSERT INTO hospital_doctors (hospital_id, name, specialization, qualification, experience_years, timings, bio) VALUES (?, ?, ?, ?, ?, 'Mon-Sat 9:00 AM - 5:00 PM', ?)`,
        [hospitalId, doc.name, specialty, doc.qualification, doc.experience,
         `${specialty} specialist with ${doc.experience}+ years of experience. Based in ${doc.city}.`]
      );
      doctorCount++;
    }
  }
  console.log(`   Inserted ${doctorCount} specialty doctors\n`);

  // ---- 5b. GENERATE DOCTORS FOR ALL REMAINING HOSPITALS ----
  console.log('👨‍⚕️ Generating and mapping doctors to all seeded hospitals...');
  const firstNames = ['Amit', 'Rajesh', 'Sanjay', 'Sunil', 'Vijay', 'Anil', 'Ramesh', 'Suresh', 'Karan', 'Arjun', 'Priya', 'Anjali', 'Kavitha', 'Shalini', 'Pooja', 'Deepak', 'Vikram', 'Aditya', 'Rahul', 'Neha'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Reddy', 'Rao', 'Kumar', 'Singh', 'Prasad', 'Nair', 'Chawla', 'Mehta', 'Patel', 'Joshi', 'Mishra', 'Yadav', 'Bhatia'];
  const qualifications = {
    'Cardiology': ['MBBS, MD, DM (Cardiology)', 'MBBS, DNB (Cardiology)'],
    'Neurology': ['MBBS, MD, DM (Neurology)', 'MBBS, MCh (Neurosurgery)'],
    'Orthopedics': ['MBBS, MS (Orthopedics)', 'MBBS, DNB (Orthopedics)'],
    'Oncology': ['MBBS, MD, DM (Oncology)', 'MBBS, MS, MCh (Surgical Oncology)'],
    'Pediatrics': ['MBBS, MD (Pediatrics)', 'MBBS, DCH'],
    'General Medicine': ['MBBS, MD (General Medicine)', 'MBBS, DNB'],
    'General Surgery': ['MBBS, MS (General Surgery)', 'MBBS, DNB'],
    'Radiology & Imaging': ['MBBS, MD (Radiology)', 'MBBS, DMRD'],
    'Nephrology': ['MBBS, MD, DM (Nephrology)'],
    'Gastroenterology': ['MBBS, MD, DM (Gastroenterology)'],
    'Pulmonology': ['MBBS, MD, DM (Pulmonology)'],
    'Urology': ['MBBS, MS, MCh (Urology)']
  };
  const specialties = Object.keys(qualifications);

  const [seededHospitals] = await connection.execute('SELECT id, name FROM hospitals');
  let extraDoctorCount = 0;
  for (const hosp of seededHospitals) {
    // Generate 2 to 4 doctors per hospital
    const numDocs = Math.floor(Math.random() * 3) + 2; 
    for (let d = 0; d < numDocs; d++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const docName = `Dr. ${fName} ${lName}`;
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];
      const qual = qualifications[specialty][Math.floor(Math.random() * qualifications[specialty].length)];
      const exp = Math.floor(Math.random() * 25) + 5; // 5 to 30 years
      
      await connection.execute(
        `INSERT INTO hospital_doctors (hospital_id, name, specialization, qualification, experience_years, timings, bio) VALUES (?, ?, ?, ?, ?, 'Mon-Sat 10:00 AM - 4:00 PM', ?)`,
        [hosp.id, docName, specialty, qual, exp, `${specialty} consultant at ${hosp.name}.`]
      );
      extraDoctorCount++;
    }
  }
  console.log(`   Generated and inserted ${extraDoctorCount} doctors across all ${seededHospitals.length} hospitals.\n`);


  // ---- 6. SEED CLINICS → clinic_doctors table ----
  console.log('🩻 Seeding area-specific clinics...');
  let clinicCount = 0;

  for (const [area, clinics] of Object.entries(CLINICS_BY_AREA)) {
    for (let i = 0; i < clinics.length; i++) {
      const name = clinics[i];
      const coords = getCoords(area, i);
      const specialty = inferClinicSpecialty(name);
      const fee = specialty === 'General Practice' ? 300 : specialty === 'Dentistry' ? 500 : specialty === 'Dermatology' ? 600 : 400;

      await connection.execute(
        `INSERT INTO clinic_doctors (name, specialization, clinic_name, clinic_address, city, state, lat, lng, consultation_fee, home_visit_fee, bio) VALUES (?, ?, ?, ?, 'Hyderabad', 'Telangana', ?, ?, ?, ?, ?)`,
        [name, specialty, name, `${area}, Hyderabad, Telangana`, coords.lat, coords.lng, fee, fee + 300,
         `${specialty} clinic in ${area}, Hyderabad. Walk-in and appointment consultations available.`]
      );
      clinicCount++;
    }
  }
  console.log(`   Inserted ${clinicCount} area-specific clinics`);

  // ---- 7. SEED NATIONAL CLINIC CHAINS ----
  console.log('🏪 Seeding national clinic chains...');
  const nationalClinicAreas = ['Jubilee Hills', 'Banjara Hills', 'Hitech City', 'Gachibowli', 'Kukatpally', 'Ameerpet', 'Kondapur', 'Begumpet', 'Somajiguda', 'Secunderabad'];
  
  for (let i = 0; i < NATIONAL_CLINICS.length; i++) {
    const clinic = NATIONAL_CLINICS[i];
    const area = nationalClinicAreas[i % nationalClinicAreas.length];
    const coords = getCoords(area, i + 20); // offset to avoid overlap with area clinics
    const fee = clinic.specialty === 'Diagnostics' ? 200 : clinic.specialty === 'Dentistry' ? 500 : 400;

    await connection.execute(
      `INSERT INTO clinic_doctors (name, specialization, clinic_name, clinic_address, city, state, lat, lng, consultation_fee, home_visit_fee, bio) VALUES (?, ?, ?, ?, 'Hyderabad', 'Telangana', ?, ?, ?, ?, ?)`,
      [clinic.name, clinic.specialty, clinic.name, `${area}, Hyderabad, Telangana`, coords.lat, coords.lng, fee, fee + 500,
       `${clinic.name} - National healthcare chain specializing in ${clinic.specialty}. Hyderabad branch.`]
    );
  }
  clinicCount += NATIONAL_CLINICS.length;
  console.log(`   Inserted ${NATIONAL_CLINICS.length} national clinic chains`);
  console.log(`   Total clinics: ${clinicCount}\n`);

  // ---- 8. SEED PHYSIOTHERAPISTS ----
  console.log('🦴 Seeding physiotherapists...');
  const physioAreas = ['Jubilee Hills', 'Banjara Hills', 'Hitech City', 'Gachibowli', 'Kukatpally', 'Ameerpet', 'Kondapur', 'Begumpet', 'Kompally', 'Somajiguda'];
  
  for (let i = 0; i < PHYSIOTHERAPISTS.length; i++) {
    const physio = PHYSIOTHERAPISTS[i];
    const area = physioAreas[i % physioAreas.length];
    const coords = getCoords(area, i + 15);

    await connection.execute(
      `INSERT INTO physiotherapists (name, specialization, qualification, experience_years, address, city, state, lat, lng, home_visit_fee, bio) VALUES (?, ?, ?, ?, ?, ?, 'Telangana', ?, ?, ?, ?)`,
      [physio.name, physio.specialty, physio.qualification, physio.experience,
       `${area}, Hyderabad, Telangana`, physio.city === 'Mumbai' || physio.city === 'Bengaluru' || physio.city === 'Chennai' || physio.city === 'New Delhi' || physio.city === 'Ahmedabad' || physio.city === 'Coimbatore' ? physio.city : 'Hyderabad',
       coords.lat, coords.lng, 1500,
       `${physio.specialty} specialist with ${physio.experience} years of experience. ${physio.qualification}. Provides home visit physiotherapy services.`]
    );
  }
  console.log(`   Inserted ${PHYSIOTHERAPISTS.length} physiotherapists\n`);

  // ---- SUMMARY ----
  const [[{ hc }]] = await connection.execute('SELECT COUNT(*) as hc FROM hospitals');
  const [[{ dc }]] = await connection.execute('SELECT COUNT(*) as dc FROM hospital_doctors');
  const [[{ cc }]] = await connection.execute('SELECT COUNT(*) as cc FROM clinic_doctors');
  const [[{ nc }]] = await connection.execute('SELECT COUNT(*) as nc FROM nurses');
  const [[{ pc }]] = await connection.execute('SELECT COUNT(*) as pc FROM physiotherapists');

  console.log('═══════════════════════════════════════');
  console.log('   JeevanCare+ Seed Complete! 🎉');
  console.log('═══════════════════════════════════════');
  console.log(`   Hospitals:        ${hc}`);
  console.log(`   Hospital Doctors: ${dc}`);
  console.log(`   Clinic Doctors:   ${cc}`);
  console.log(`   Nurses (mock):    ${nc}`);
  console.log(`   Physiotherapists: ${pc}`);
  console.log('═══════════════════════════════════════\n');

  await connection.end();
}

module.exports = seed;

if (require.main === module) {
  seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  });
}
