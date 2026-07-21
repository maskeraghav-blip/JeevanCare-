/* ============================================
   JeevanCare+ Doctor Data
   ============================================ */

export const doctors = [
  // ===== GENERAL MEDICINE =====
  { id: 'd001', name: 'Dr. Mohsin Wali', specialty: 'General Medicine', hospital: 'Local Clinic', city: 'New Delhi', experience: '45+ years', rating: 4.9, verified: true, registration: 'TSMC-1001', isClinicDoctor: true },
  { id: 'd002', name: 'Dr. Lekh Ram Sharma', specialty: 'General Medicine', hospital: 'Local Clinic', city: 'New Delhi', experience: '38+ years', rating: 4.8, verified: true, registration: 'TSMC-1002', isClinicDoctor: true },
  { id: 'd003', name: 'Dr. Arun Dewan', specialty: 'General Medicine', hospital: 'Local Clinic', city: 'New Delhi', experience: '38+ years', rating: 4.8, verified: true, registration: 'TSMC-1003', isClinicDoctor: true },
  { id: 'd004', name: 'Dr. K. Rama Murty', specialty: 'General Medicine', hospital: 'Local Clinic', city: 'Visakhapatnam', experience: '46+ years', rating: 4.9, verified: true, registration: 'TSMC-1004', isClinicDoctor: true },
  { id: 'd005', name: 'Dr. Vijay Arora', specialty: 'General Medicine', hospital: 'Max Healthcare', city: 'Gurugram', experience: '33+ years', rating: 4.7 , verified: true, registration: 'TSMC-1005', isClinicDoctor: false },
  { id: 'd006', name: 'Dr. Ajay Agarwal', specialty: 'General Medicine', hospital: 'Local Clinic', city: 'Noida', experience: '34+ years', rating: 4.7, verified: true, registration: 'TSMC-1006', isClinicDoctor: true },
  { id: 'd007', name: 'Dr. K. V. Harish', specialty: 'General Medicine', hospital: 'Local Clinic', city: 'Bengaluru', experience: '28+ years', rating: 4.6, verified: true, registration: 'TSMC-1007', isClinicDoctor: true },
  { id: 'd008', name: 'Dr. Aravind GM', specialty: 'General Surgery', hospital: 'Local Clinic', city: 'Bengaluru', experience: '25+ years', rating: 4.6, verified: true, registration: 'TSMC-1008', isClinicDoctor: true },
  { id: 'd009', name: 'Dr. T. J. Pradeep Kumar', specialty: 'General Medicine', hospital: 'Medicover Hospitals', city: 'Bengaluru', experience: '28+ years', rating: 4.6 , verified: true, registration: 'TSMC-1009', isClinicDoctor: false },
  { id: 'd010', name: 'Dr. Pradeep Kumar Mishra', specialty: 'General Medicine', hospital: 'Local Clinic', city: 'Secunderabad', experience: '25+ years', rating: 4.5, verified: true, registration: 'TSMC-1010', isClinicDoctor: true },

  // ===== GENERAL SURGERY =====
  { id: 'd011', name: 'Dr. Pradeep Chowbey', specialty: 'General Surgery', hospital: 'Local Clinic', city: 'New Delhi', experience: '35+ years', rating: 4.9, verified: true, registration: 'TSMC-1011', isClinicDoctor: true },
  { id: 'd012', name: 'Dr. Rajesh Khullar', specialty: 'General Surgery', hospital: 'Medanta – The Medicity', city: 'Gurugram', experience: '30+ years', rating: 4.8 , verified: true, registration: 'TSMC-1012', isClinicDoctor: false },
  { id: 'd013', name: 'Dr. Adarsh Chaudhary', specialty: 'General Surgery', hospital: 'Medanta – The Medicity', city: 'Gurugram', experience: '32+ years', rating: 4.8 , verified: true, registration: 'TSMC-1013', isClinicDoctor: false },
  { id: 'd014', name: 'Dr. Arvind Kumar', specialty: 'General Surgery', hospital: 'Fortis Hospital', city: 'New Delhi', experience: '30+ years', rating: 4.8 , verified: true, registration: 'TSMC-1014', isClinicDoctor: false },
  { id: 'd015', name: 'Dr. P. Balachandar', specialty: 'General Surgery', hospital: 'Apollo Hospitals', city: 'Chennai', experience: '28+ years', rating: 4.7 , verified: true, registration: 'TSMC-1015', isClinicDoctor: false },
  { id: 'd016', name: 'Dr. Sandeep Nayak', specialty: 'General Surgery', hospital: 'Local Clinic', city: 'Bengaluru', experience: '25+ years', rating: 4.7, verified: true, registration: 'TSMC-1016', isClinicDoctor: true },
  { id: 'd017', name: 'Dr. Nandakishore S. K.', specialty: 'General Surgery', hospital: 'Manipal Hospitals', city: 'Bengaluru', experience: '22+ years', rating: 4.6 , verified: true, registration: 'TSMC-1017', isClinicDoctor: false },
  { id: 'd018', name: 'Dr. K. N. Srivastava', specialty: 'General Surgery', hospital: 'Local Clinic', city: 'New Delhi', experience: '30+ years', rating: 4.7, verified: true, registration: 'TSMC-1018', isClinicDoctor: true },
  { id: 'd019', name: 'Dr. Jagdish Chander', specialty: 'General Surgery', hospital: 'Local Clinic', city: 'Greater Noida', experience: '28+ years', rating: 4.6, verified: true, registration: 'TSMC-1019', isClinicDoctor: true },
  { id: 'd020', name: 'Dr. Paritosh S. Gupta', specialty: 'General Surgery', hospital: 'Local Clinic', city: 'Gurugram', experience: '25+ years', rating: 4.6, verified: true, registration: 'TSMC-1020', isClinicDoctor: true },

  // ===== CARDIOLOGY & CARDIAC SURGERY =====
  { id: 'd021', name: 'Dr. Naresh Trehan', specialty: 'Cardiology', hospital: 'Medanta – The Medicity', city: 'Gurugram', experience: '45+ years', rating: 4.9 , verified: true, registration: 'TSMC-1021', isClinicDoctor: false },
  { id: 'd022', name: 'Dr. Devi Prasad Shetty', specialty: 'Cardiology', hospital: 'Local Clinic', city: 'Bengaluru', experience: '40+ years', rating: 4.9, verified: true, registration: 'TSMC-1022', isClinicDoctor: true },
  { id: 'd023', name: 'Dr. Ashok Seth', specialty: 'Cardiology', hospital: 'Local Clinic', city: 'New Delhi', experience: '38+ years', rating: 4.9, verified: true, registration: 'TSMC-1023', isClinicDoctor: true },
  { id: 'd024', name: 'Dr. Balbir Singh', specialty: 'Cardiology', hospital: 'Max Healthcare', city: 'New Delhi', experience: '35+ years', rating: 4.8 , verified: true, registration: 'TSMC-1024', isClinicDoctor: false },
  { id: 'd025', name: 'Dr. Ramakanta Panda', specialty: 'Cardiology', hospital: 'Local Clinic', city: 'Mumbai', experience: '35+ years', rating: 4.8, verified: true, registration: 'TSMC-1025', isClinicDoctor: true },
  { id: 'd026', name: 'Dr. T. S. Kler', specialty: 'Cardiology', hospital: 'Local Clinic', city: 'New Delhi', experience: '33+ years', rating: 4.8, verified: true, registration: 'TSMC-1026', isClinicDoctor: true },
  { id: 'd027', name: 'Dr. K. M. Cherian', specialty: 'Cardiology', hospital: 'Frontier Lifeline Hospital', city: 'Chennai', experience: '40+ years', rating: 4.8 , verified: true, registration: 'TSMC-1027', isClinicDoctor: false },
  { id: 'd028', name: 'Dr. Z. S. Meharwal', specialty: 'Cardiology', hospital: 'Fortis Escorts', city: 'New Delhi', experience: '30+ years', rating: 4.7 , verified: true, registration: 'TSMC-1028', isClinicDoctor: false },
  { id: 'd029', name: 'Dr. Upendra Kaul', specialty: 'Cardiology', hospital: 'Local Clinic', city: 'New Delhi', experience: '40+ years', rating: 4.8, verified: true, registration: 'TSMC-1029', isClinicDoctor: true },
  { id: 'd030', name: 'Dr. Y. K. Mishra', specialty: 'Cardiology', hospital: 'Local Clinic', city: 'New Delhi', experience: '30+ years', rating: 4.7, verified: true, registration: 'TSMC-1030', isClinicDoctor: true },

  // ===== NEUROLOGY & NEUROSURGERY =====
  { id: 'd031', name: 'Dr. Sandeep Vaishya', specialty: 'Neurology', hospital: 'Local Clinic', city: 'Gurugram', experience: '28+ years', rating: 4.8, verified: true, registration: 'TSMC-1031', isClinicDoctor: true },
  { id: 'd032', name: 'Dr. V. S. Mehta', specialty: 'Neurology', hospital: 'Local Clinic', city: 'Gurugram', experience: '40+ years', rating: 4.9, verified: true, registration: 'TSMC-1032', isClinicDoctor: true },
  { id: 'd033', name: 'Dr. Rana Patir', specialty: 'Neurology', hospital: 'Fortis Hospital', city: 'Gurugram', experience: '30+ years', rating: 4.7 , verified: true, registration: 'TSMC-1033', isClinicDoctor: false },
  { id: 'd034', name: 'Dr. Sudhir Kumar', specialty: 'Neurology', hospital: 'Apollo Hospitals', city: 'Hyderabad', experience: '25+ years', rating: 4.7 , verified: true, registration: 'TSMC-1034', isClinicDoctor: false },
  { id: 'd035', name: 'Dr. K. Sridhar', specialty: 'Neurology', hospital: 'Local Clinic', city: 'Chennai', experience: '28+ years', rating: 4.7, verified: true, registration: 'TSMC-1035', isClinicDoctor: true },
  { id: 'd036', name: 'Dr. Praveen Gupta', specialty: 'Neurology', hospital: 'Local Clinic', city: 'Gurugram', experience: '25+ years', rating: 4.6, verified: true, registration: 'TSMC-1036', isClinicDoctor: true },

  // ===== ORTHOPEDICS =====
  { id: 'd037', name: 'Dr. Ramneek Mahajan', specialty: 'Orthopedics', hospital: 'Local Clinic', city: 'New Delhi', experience: '30+ years', rating: 4.8, verified: true, registration: 'TSMC-1037', isClinicDoctor: true },
  { id: 'd038', name: 'Dr. IPS Oberoi', specialty: 'Orthopedics', hospital: 'Local Clinic', city: 'Gurugram', experience: '28+ years', rating: 4.7, verified: true, registration: 'TSMC-1038', isClinicDoctor: true },
  { id: 'd039', name: 'Dr. Ashok Rajgopal', specialty: 'Orthopedics', hospital: 'Medanta Hospital', city: 'Gurugram', experience: '35+ years', rating: 4.8 , verified: true, registration: 'TSMC-1039', isClinicDoctor: false },
  { id: 'd040', name: 'Dr. A. V. Gurava Reddy', specialty: 'Orthopedics', hospital: 'Sunshine Hospitals', city: 'Hyderabad', experience: '25+ years', rating: 4.7 , verified: true, registration: 'TSMC-1040', isClinicDoctor: false },

  // ===== ONCOLOGY =====
  { id: 'd041', name: 'Dr. Vinod Raina', specialty: 'Oncology', hospital: 'Fortis Hospital', city: 'Gurugram', experience: '35+ years', rating: 4.8 , verified: true, registration: 'TSMC-1041', isClinicDoctor: false },
  { id: 'd042', name: 'Dr. Suresh Advani', specialty: 'Oncology', hospital: 'Local Clinic', city: 'Mumbai', experience: '40+ years', rating: 4.9, verified: true, registration: 'TSMC-1042', isClinicDoctor: true },
  { id: 'd043', name: 'Dr. Rajendra Badwe', specialty: 'Oncology', hospital: 'Local Clinic', city: 'Mumbai', experience: '35+ years', rating: 4.9, verified: true, registration: 'TSMC-1043', isClinicDoctor: true },
  { id: 'd044', name: 'Dr. Vijay Anand Reddy', specialty: 'Oncology', hospital: 'Apollo Cancer Hospital', city: 'Hyderabad', experience: '30+ years', rating: 4.7 , verified: true, registration: 'TSMC-1044', isClinicDoctor: false },

  // ===== NEPHROLOGY =====
  { id: 'd045', name: 'Dr. H. Sudarshan Ballal', specialty: 'Nephrology', hospital: 'Manipal Hospitals', city: 'Bengaluru', experience: '35+ years', rating: 4.8 , verified: true, registration: 'TSMC-1045', isClinicDoctor: false },
  { id: 'd046', name: 'Dr. Georgi Abraham', specialty: 'Nephrology', hospital: 'Local Clinic', city: 'Chennai', experience: '30+ years', rating: 4.7, verified: true, registration: 'TSMC-1046', isClinicDoctor: true },
  { id: 'd047', name: 'Dr. Vivekanand Jha', specialty: 'Nephrology', hospital: 'George Institute', city: 'New Delhi', experience: '28+ years', rating: 4.7 , verified: true, registration: 'TSMC-1047', isClinicDoctor: false },

  // ===== GASTROENTEROLOGY =====
  { id: 'd048', name: 'Dr. D. Nageshwar Reddy', specialty: 'Gastroenterology', hospital: 'AIG Hospitals', city: 'Hyderabad', experience: '40+ years', rating: 4.9 , verified: true, registration: 'TSMC-1048', isClinicDoctor: false },
  { id: 'd049', name: 'Dr. Samiran Nundy', specialty: 'Gastroenterology', hospital: 'Sir Ganga Ram Hospital', city: 'New Delhi', experience: '45+ years', rating: 4.9 , verified: true, registration: 'TSMC-1049', isClinicDoctor: false },
  { id: 'd050', name: 'Dr. Randhir Sud', specialty: 'Gastroenterology', hospital: 'Local Clinic', city: 'Gurugram', experience: '35+ years', rating: 4.8, verified: true, registration: 'TSMC-1050', isClinicDoctor: true },

  // ===== PULMONOLOGY =====
  { id: 'd051', name: 'Dr. Arvind Kumar', specialty: 'Pulmonology', hospital: 'Local Clinic', city: 'Gurugram', experience: '30+ years', rating: 4.8, verified: true, registration: 'TSMC-1051', isClinicDoctor: true },
  { id: 'd052', name: 'Dr. Randeep Guleria', specialty: 'Pulmonology', hospital: 'Local Clinic', city: 'New Delhi', experience: '35+ years', rating: 4.9, verified: true, registration: 'TSMC-1052', isClinicDoctor: true },
  { id: 'd053', name: 'Dr. Deepak Talwar', specialty: 'Pulmonology', hospital: 'Local Clinic', city: 'Noida', experience: '30+ years', rating: 4.7, verified: true, registration: 'TSMC-1053', isClinicDoctor: true },

  // ===== UROLOGY =====
  { id: 'd054', name: 'Dr. Mahesh Desai', specialty: 'Urology', hospital: 'Local Clinic', city: 'Nadiad', experience: '35+ years', rating: 4.9, verified: true, registration: 'TSMC-1054', isClinicDoctor: true },
  { id: 'd055', name: 'Dr. Rajesh Ahlawat', specialty: 'Urology', hospital: 'Local Clinic', city: 'Gurugram', experience: '30+ years', rating: 4.8, verified: true, registration: 'TSMC-1055', isClinicDoctor: true },
  { id: 'd056', name: 'Dr. Anant Kumar', specialty: 'Urology', hospital: 'Local Clinic', city: 'New Delhi', experience: '30+ years', rating: 4.8, verified: true, registration: 'TSMC-1056', isClinicDoctor: true },

  // ===== OBSTETRICS & GYNECOLOGY =====
  { id: 'd057', name: 'Dr. Kamini Rao', specialty: 'Obstetrics & Gynecology', hospital: 'Milann Fertility Center', city: 'Bengaluru', experience: '35+ years', rating: 4.9 , verified: true, registration: 'TSMC-1057', isClinicDoctor: false },
  { id: 'd058', name: 'Dr. Shobha Gupta', specialty: 'Obstetrics & Gynecology', hospital: 'Local Clinic', city: 'New Delhi', experience: '28+ years', rating: 4.7, verified: true, registration: 'TSMC-1058', isClinicDoctor: true },
  { id: 'd059', name: 'Dr. Nandita Palshetkar', specialty: 'Obstetrics & Gynecology', hospital: 'Lilavati Hospital', city: 'Mumbai', experience: '30+ years', rating: 4.8 , verified: true, registration: 'TSMC-1059', isClinicDoctor: false },

  // ===== PEDIATRICS =====
  { id: 'd060', name: 'Dr. Krishna Chugh', specialty: 'Pediatrics', hospital: 'Local Clinic', city: 'Gurugram', experience: '35+ years', rating: 4.8, verified: true, registration: 'TSMC-1060', isClinicDoctor: true },
  { id: 'd061', name: 'Dr. Suresh Birajdar', specialty: 'Pediatrics', hospital: 'CARE Hospitals', city: 'Hyderabad', experience: '25+ years', rating: 4.6 , verified: true, registration: 'TSMC-1061', isClinicDoctor: false },
  { id: 'd062', name: 'Dr. S. K. Kabra', specialty: 'Pediatrics', hospital: 'Local Clinic', city: 'New Delhi', experience: '30+ years', rating: 4.8, verified: true, registration: 'TSMC-1062', isClinicDoctor: true },
  { id: 'd063', name: 'Dr. V. K. Paul', specialty: 'Pediatrics', hospital: 'Local Clinic', city: 'New Delhi', experience: '35+ years', rating: 4.9, verified: true, registration: 'TSMC-1063', isClinicDoctor: true },

  // ===== PHYSIOTHERAPISTS =====
  { id: 'p001', name: 'Dr. Ali Irani', specialty: 'Physiotherapy', hospital: 'Local Clinic', city: 'Mumbai', experience: '25+ years', rating: 4.8, verified: true, registration: 'TSMC-1064', isClinicDoctor: true },
  { id: 'p002', name: 'Dr. Nikhil Latey', specialty: 'Physiotherapy', hospital: 'Sports Physio Centre', city: 'Mumbai', experience: '20+ years', rating: 4.7 , verified: true, registration: 'TSMC-1065', isClinicDoctor: false },
  { id: 'p003', name: 'Dr. Deepa Narayan', specialty: 'Physiotherapy', hospital: 'Local Clinic', city: 'Bengaluru', experience: '22+ years', rating: 4.7, verified: true, registration: 'TSMC-1066', isClinicDoctor: true },
  { id: 'p004', name: 'Dr. G. Bakthavatchalam', specialty: 'Physiotherapy', hospital: 'Local Clinic', city: 'Chennai', experience: '25+ years', rating: 4.6, verified: true, registration: 'TSMC-1067', isClinicDoctor: true },
  { id: 'p005', name: 'Dr. S. Muthukumaran', specialty: 'Physiotherapy', hospital: 'Ortho Physio Centre', city: 'Chennai', experience: '20+ years', rating: 4.6 , verified: true, registration: 'TSMC-1068', isClinicDoctor: false },
  { id: 'p006', name: 'Dr. K. S. Rekha', specialty: 'Physiotherapy', hospital: "Women's Health Centre", city: 'Bengaluru', experience: '18+ years', rating: 4.5 , verified: true, registration: 'TSMC-1069', isClinicDoctor: false },
  { id: 'p007', name: 'Dr. Rakesh Patel', specialty: 'Physiotherapy', hospital: 'Spine & Sports Rehab', city: 'Ahmedabad', experience: '20+ years', rating: 4.6 , verified: true, registration: 'TSMC-1070', isClinicDoctor: false },
  { id: 'p008', name: 'Dr. S. Rajasekar', specialty: 'Physiotherapy', hospital: 'Musculoskeletal Clinic', city: 'Coimbatore', experience: '18+ years', rating: 4.5 , verified: true, registration: 'TSMC-1071', isClinicDoctor: false },
  { id: 'p009', name: 'Dr. Ashish Bhatia', specialty: 'Physiotherapy', hospital: 'Local Clinic', city: 'New Delhi', experience: '20+ years', rating: 4.6, verified: true, registration: 'TSMC-1072', isClinicDoctor: true },
  { id: 'p010', name: 'Dr. Rajesh K. Verma', specialty: 'Physiotherapy', hospital: 'Neuro Physio Centre', city: 'New Delhi', experience: '22+ years', rating: 4.6 , verified: true, registration: 'TSMC-1073', isClinicDoctor: false },
];

// Get all unique specialties
export const specialties = [...new Set(doctors.map(d => d.specialty))].sort();

// Search doctors
export function searchDoctors(query) {
  const q = query.toLowerCase();
  return doctors.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.specialty.toLowerCase().includes(q) ||
    d.hospital.toLowerCase().includes(q) ||
    d.city.toLowerCase().includes(q)
  );
}

// Get doctors by specialty
export function getDoctorsBySpecialty(specialty) {
  return doctors.filter(d => d.specialty === specialty);
}
