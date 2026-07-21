/* ============================================
   JeevanCare+ Clinics Data (Condensed)
   ============================================ */

export const clinics = [
  // KOMPALLY CLINICS
  { id: 'c001', name: 'Apollo Clinic', area: 'Kompally', specialty: 'Multispecialty', lat: 17.5386, lng: 78.4882 },
  { id: 'c002', name: 'Avisha Clinics', area: 'Kompally', specialty: 'General', lat: 17.5388, lng: 78.4875 },
  { id: 'c003', name: 'Aloha Clinic', area: 'Kompally', specialty: 'Women & General', lat: 17.5382, lng: 78.4890 },
  { id: 'c004', name: 'Plexus Diagnostics & Poly Clinics', area: 'Kompally', specialty: 'Diagnostics', lat: 17.5378, lng: 78.4868 },
  { id: 'c005', name: 'Mysha Clinic & Diagnostics', area: 'Kompally', specialty: 'Diagnostics', lat: 17.5392, lng: 78.4885 },
  { id: 'c006', name: 'Sanjeevani Thyroid, Sugar and Hormones Clinic', area: 'Kompally', specialty: 'Endocrinology', lat: 17.5395, lng: 78.4878 },
  { id: 'c007', name: 'Krisara Skin Clinic', area: 'Kompally', specialty: 'Dermatology', lat: 17.5380, lng: 78.4895 },
  { id: 'c008', name: 'Dr. Soumya\'s Aria Skin & Hair Clinic', area: 'Kompally', specialty: 'Dermatology', lat: 17.5375, lng: 78.4892 },
  { id: 'c009', name: 'Veda Skin and Hair Clinic', area: 'Kompally', specialty: 'Dermatology', lat: 17.5398, lng: 78.4872 },
  { id: 'c010', name: 'RK Skin Laser & Hair Transplant Clinic', area: 'Kompally', specialty: 'Dermatology', lat: 17.5370, lng: 78.4888 },

  // DULAPALLY CLINICS
  { id: 'c011', name: 'SV Polyclinic & Day Care Center', area: 'Dulapally', specialty: 'Multispecialty', lat: 17.5522, lng: 78.4905 },
  { id: 'c012', name: 'Sri Nirvik Children Clinic & Diagnostic Centre', area: 'Dulapally', specialty: 'Pediatrics', lat: 17.5528, lng: 78.4895 },
  { id: 'c013', name: 'Kk Clinic & Diagnostics', area: 'Dulapally', specialty: 'Diagnostics', lat: 17.5518, lng: 78.4912 },
  { id: 'c014', name: 'Scala Skin and Hair Transplant Clinic', area: 'Dulapally', specialty: 'Dermatology', lat: 17.5525, lng: 78.4898 },
  { id: 'c015', name: 'V Heal ENT, Ortho & Multi Speciality Centre', area: 'Dulapally', specialty: 'ENT', lat: 17.5532, lng: 78.4908 },

  // MAISAMMAGUDA CLINICS
  { id: 'c016', name: 'KK Clinic & Diagnostics', area: 'Maisammaguda', specialty: 'Diagnostics', lat: 17.5452, lng: 78.4755 },
  { id: 'c017', name: 'Narayana Clinics', area: 'Maisammaguda', specialty: 'Multispecialty', lat: 17.5448, lng: 78.4762 },
  { id: 'c018', name: 'Balamitra Children\'s Clinic', area: 'Maisammaguda', specialty: 'Pediatrics', lat: 17.5455, lng: 78.4748 },
  { id: 'c019', name: 'Apollo Diagnostics & Clinic', area: 'Maisammaguda', specialty: 'Diagnostics', lat: 17.5445, lng: 78.4770 },

  // MEDCHAL CLINICS
  { id: 'c020', name: 'Aadi Children\'s Clinic', area: 'Medchal', specialty: 'Pediatrics', lat: 17.6298, lng: 78.4818 },
  { id: 'c021', name: 'Tesla Polyclinics', area: 'Medchal', specialty: 'Pulmonology', lat: 17.6302, lng: 78.4808 },
  { id: 'c022', name: 'Akruthi Dental Care', area: 'Medchal', specialty: 'Dental', lat: 17.6292, lng: 78.4822 },

  // GANDIMAISAMMA CLINICS
  { id: 'c023', name: 'Sigma Clinic & Hospital Centre', area: 'Gandimaisamma', specialty: 'Multispecialty', lat: 17.5182, lng: 78.4455 },
  { id: 'c024', name: 'Bhaskara Multi-Specialty Clinic', area: 'Gandimaisamma', specialty: 'Multispecialty', lat: 17.5188, lng: 78.4448 },
  { id: 'c025', name: 'Galaxy Dental Care', area: 'Gandimaisamma', specialty: 'Dental', lat: 17.5178, lng: 78.4462 },

  // JEEDIMETLA CLINICS (selected)
  { id: 'c026', name: 'Sigma Polyclinic & Diagnostic Centre', area: 'Jeedimetla', specialty: 'Diagnostics', lat: 17.5002, lng: 78.4452 },
  { id: 'c027', name: 'Pulse Outpatient Medical Centre', area: 'Jeedimetla', specialty: 'General', lat: 17.5008, lng: 78.4445 },
  { id: 'c028', name: 'Care Dental Clinic', area: 'Jeedimetla', specialty: 'Dental', lat: 17.4998, lng: 78.4458 },
  { id: 'c029', name: 'Apollo Diagnostics & Clinic', area: 'Jeedimetla', specialty: 'Diagnostics', lat: 17.5012, lng: 78.4442 },
  { id: 'c030', name: 'Sanjeevani Children\'s Hospital', area: 'Jeedimetla', specialty: 'Pediatrics', lat: 17.4995, lng: 78.4465 },

  // TOP INDIA CLINIC CHAINS
  { id: 'c100', name: 'Apollo Clinic', area: 'Multiple Locations', specialty: 'Multispecialty', lat: 17.4350, lng: 78.4480 },
  { id: 'c101', name: 'Express Clinics', area: 'Multiple Locations', specialty: 'Multispecialty', lat: 17.4355, lng: 78.4485 },
  { id: 'c102', name: 'Clove Dental', area: 'Multiple Locations', specialty: 'Dental', lat: 17.4360, lng: 78.4490 },
  { id: 'c103', name: 'Dr. Batra\'s', area: 'Multiple Locations', specialty: 'Homeopathy', lat: 17.4365, lng: 78.4495 },
  { id: 'c104', name: 'Kaya Skin Clinic', area: 'Multiple Locations', specialty: 'Dermatology', lat: 17.4370, lng: 78.4500 },
  { id: 'c105', name: 'Oliva Skin & Hair Clinic', area: 'Multiple Locations', specialty: 'Dermatology', lat: 17.4375, lng: 78.4505 },
  { id: 'c106', name: 'Indira IVF', area: 'Multiple Locations', specialty: 'Fertility', lat: 17.4380, lng: 78.4510 },
  { id: 'c107', name: 'Nova IVF Fertility', area: 'Multiple Locations', specialty: 'Fertility', lat: 17.4385, lng: 78.4515 },
  { id: 'c108', name: 'Vasan Eye Care', area: 'Multiple Locations', specialty: 'Eye Care', lat: 17.4390, lng: 78.4520 },
  { id: 'c109', name: 'Centre for Sight', area: 'Multiple Locations', specialty: 'Eye Care', lat: 17.4395, lng: 78.4525 },
  { id: 'c110', name: 'Dr. Agarwal\'s Eye Hospital', area: 'Multiple Locations', specialty: 'Eye Care', lat: 17.4400, lng: 78.4530 },
  { id: 'c111', name: 'Apollo Sugar Clinics', area: 'Multiple Locations', specialty: 'Diabetes', lat: 17.4405, lng: 78.4535 },
  { id: 'c112', name: 'Rainbow Children\'s Clinic', area: 'Multiple Locations', specialty: 'Pediatrics', lat: 17.4410, lng: 78.4540 },
  { id: 'c113', name: 'Ankura Clinics', area: 'Multiple Locations', specialty: 'Women & Children', lat: 17.4415, lng: 78.4545 },
  { id: 'c114', name: 'Sabka Dentist', area: 'Multiple Locations', specialty: 'Dental', lat: 17.4420, lng: 78.4550 },
  { id: 'c115', name: 'Partha Dental', area: 'Multiple Locations', specialty: 'Dental', lat: 17.4425, lng: 78.4555 },
  { id: 'c116', name: 'Motherhood Clinic', area: 'Multiple Locations', specialty: 'Women & Children', lat: 17.4430, lng: 78.4560 },
  { id: 'c117', name: 'Cloudnine Clinic', area: 'Multiple Locations', specialty: 'Women\'s Health', lat: 17.4435, lng: 78.4565 },
  { id: 'c118', name: 'Pristyn Care Clinics', area: 'Multiple Locations', specialty: 'Day Care Surgery', lat: 17.4440, lng: 78.4570 },
  { id: 'c119', name: 'Dr. Lal PathLabs Collection Clinics', area: 'Multiple Locations', specialty: 'Diagnostics', lat: 17.4445, lng: 78.4575 },
  { id: 'c120', name: 'Vijaya Diagnostic Clinics', area: 'Multiple Locations', specialty: 'Diagnostics', lat: 17.4450, lng: 78.4580 },
];

export const clinicAreas = [...new Set(clinics.map(c => c.area))].sort();

export function searchClinics(query) {
  const q = query.toLowerCase();
  return clinics.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.area.toLowerCase().includes(q) ||
    c.specialty.toLowerCase().includes(q)
  );
}
