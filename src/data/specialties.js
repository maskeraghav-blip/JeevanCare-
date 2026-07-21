/* ============================================
   JeevanCare+ Specialty & Symptom Mapping
   AI-based doctor recommendation engine
   ============================================ */

export const specialtyData = [
  { name: 'General Medicine', icon: '🩺', description: 'Fever, cold, infections, general health' },
  { name: 'General Surgery', icon: '🔪', description: 'Surgical procedures, hernia, appendix' },
  { name: 'Cardiology', icon: '❤️', description: 'Heart, blood pressure, chest pain' },
  { name: 'Neurology', icon: '🧠', description: 'Brain, nerves, headache, seizures' },
  { name: 'Orthopedics', icon: '🦴', description: 'Bones, joints, fractures, spine' },
  { name: 'Oncology', icon: '🎗️', description: 'Cancer diagnosis and treatment' },
  { name: 'Nephrology', icon: '🫘', description: 'Kidney diseases, dialysis' },
  { name: 'Gastroenterology', icon: '🫁', description: 'Stomach, liver, digestive system' },
  { name: 'Pulmonology', icon: '🫁', description: 'Lungs, breathing, asthma, COPD' },
  { name: 'Urology', icon: '🔬', description: 'Urinary tract, kidney stones, prostate' },
  { name: 'Obstetrics & Gynecology', icon: '🤰', description: 'Pregnancy, women\'s health, fertility' },
  { name: 'Pediatrics', icon: '👶', description: 'Child healthcare, vaccinations' },
  { name: 'Dermatology', icon: '🧴', description: 'Skin, hair, nails, allergies' },
  { name: 'ENT', icon: '👂', description: 'Ear, nose, throat problems' },
  { name: 'Ophthalmology', icon: '👁️', description: 'Eye care, vision, cataracts' },
  { name: 'Psychiatry', icon: '🧘', description: 'Mental health, anxiety, depression' },
  { name: 'Dentistry', icon: '🦷', description: 'Teeth, gums, oral health' },
  { name: 'Physiotherapy', icon: '🏃', description: 'Physical rehabilitation, sports injuries' },
  { name: 'Endocrinology', icon: '⚗️', description: 'Diabetes, thyroid, hormones' },
  { name: 'Rheumatology', icon: '🤲', description: 'Arthritis, autoimmune diseases' },
];

// Symptom to Specialty mapping for AI recommendations
export const symptomMapping = [
  // Cardiology
  { symptoms: ['chest pain', 'chest tightness', 'heart pain', 'palpitations', 'irregular heartbeat', 'high blood pressure', 'low blood pressure', 'shortness of breath', 'heart attack', 'cardiac arrest'], specialty: 'Cardiology', severity: 'high' },
  
  // Neurology
  { symptoms: ['headache', 'migraine', 'dizziness', 'vertigo', 'seizure', 'epilepsy', 'numbness', 'tingling', 'memory loss', 'confusion', 'fainting', 'paralysis', 'stroke', 'brain tumor'], specialty: 'Neurology', severity: 'high' },
  
  // Orthopedics
  { symptoms: ['bone pain', 'joint pain', 'back pain', 'knee pain', 'fracture', 'sprain', 'arthritis', 'neck pain', 'shoulder pain', 'hip pain', 'swelling in joints', 'difficulty walking', 'sports injury'], specialty: 'Orthopedics', severity: 'medium' },
  
  // Gastroenterology
  { symptoms: ['stomach pain', 'abdominal pain', 'acidity', 'bloating', 'vomiting', 'nausea', 'diarrhea', 'constipation', 'blood in stool', 'liver pain', 'jaundice', 'indigestion', 'gas', 'ulcer'], specialty: 'Gastroenterology', severity: 'medium' },
  
  // Pulmonology
  { symptoms: ['cough', 'chronic cough', 'wheezing', 'breathing difficulty', 'asthma', 'bronchitis', 'pneumonia', 'tuberculosis', 'chest congestion', 'sleep apnea', 'snoring'], specialty: 'Pulmonology', severity: 'medium' },
  
  // Nephrology
  { symptoms: ['kidney pain', 'kidney stone', 'blood in urine', 'frequent urination at night', 'swelling in legs', 'high creatinine', 'dialysis', 'kidney failure', 'protein in urine'], specialty: 'Nephrology', severity: 'high' },
  
  // Urology
  { symptoms: ['urinary infection', 'burning urination', 'frequent urination', 'urinary retention', 'prostate problem', 'erectile dysfunction', 'testicular pain', 'kidney stone'], specialty: 'Urology', severity: 'medium' },
  
  // Obstetrics & Gynecology
  { symptoms: ['pregnancy', 'missed period', 'menstrual problem', 'pelvic pain', 'vaginal bleeding', 'fertility issue', 'PCOS', 'fibroids', 'menopause', 'breast lump', 'pregnancy complication'], specialty: 'Obstetrics & Gynecology', severity: 'medium' },
  
  // Pediatrics
  { symptoms: ['child fever', 'baby not eating', 'child cough', 'child rash', 'child vomiting', 'vaccination', 'child growth', 'child development', 'newborn care', 'diaper rash'], specialty: 'Pediatrics', severity: 'medium' },
  
  // Dermatology
  { symptoms: ['skin rash', 'itching', 'acne', 'pimples', 'skin allergy', 'eczema', 'psoriasis', 'hair fall', 'dandruff', 'fungal infection', 'ringworm', 'pigmentation', 'skin infection'], specialty: 'Dermatology', severity: 'low' },
  
  // ENT
  { symptoms: ['ear pain', 'hearing loss', 'tinnitus', 'sore throat', 'tonsillitis', 'sinus', 'nasal congestion', 'nosebleed', 'snoring', 'voice problem', 'throat infection'], specialty: 'ENT', severity: 'low' },
  
  // Ophthalmology
  { symptoms: ['eye pain', 'blurred vision', 'red eye', 'dry eyes', 'watery eyes', 'cataract', 'glaucoma', 'vision loss', 'eye infection', 'eye allergy', 'squint'], specialty: 'Ophthalmology', severity: 'medium' },
  
  // Psychiatry
  { symptoms: ['anxiety', 'depression', 'stress', 'insomnia', 'panic attack', 'mood swings', 'suicidal thoughts', 'OCD', 'PTSD', 'addiction', 'eating disorder'], specialty: 'Psychiatry', severity: 'medium' },
  
  // General Medicine
  { symptoms: ['fever', 'cold', 'flu', 'body pain', 'fatigue', 'weakness', 'weight loss', 'weight gain', 'malaria', 'dengue', 'typhoid', 'viral infection', 'COVID', 'sore throat', 'runny nose'], specialty: 'General Medicine', severity: 'low' },
  
  // Dentistry
  { symptoms: ['toothache', 'tooth decay', 'gum bleeding', 'gum swelling', 'bad breath', 'tooth sensitivity', 'broken tooth', 'wisdom tooth pain', 'mouth ulcer', 'jaw pain'], specialty: 'Dentistry', severity: 'low' },
  
  // Endocrinology
  { symptoms: ['diabetes', 'high sugar', 'thyroid', 'hormonal imbalance', 'weight gain unexplained', 'excessive thirst', 'excessive hunger', 'adrenal problem', 'growth disorder'], specialty: 'Endocrinology', severity: 'medium' },

  // Oncology
  { symptoms: ['lump', 'unexplained weight loss', 'blood in cough', 'persistent fatigue', 'night sweats', 'unusual bleeding', 'cancer', 'tumor', 'chemotherapy'], specialty: 'Oncology', severity: 'high' },

  // Emergency
  { symptoms: ['accident', 'severe bleeding', 'unconscious', 'poisoning', 'burn', 'choking', 'drowning', 'electric shock', 'snake bite', 'dog bite', 'fall from height', 'road accident'], specialty: 'Emergency', severity: 'emergency' },
];

// AI self-care tips for minor issues
export const selfCareTips = {
  'fever': ['Rest well and stay hydrated', 'Take paracetamol (if no allergies)', 'Use cold compress on forehead', 'Wear light clothing', 'See a doctor if fever persists beyond 3 days'],
  'cold': ['Drink warm fluids like soups and teas', 'Steam inhalation helps', 'Rest and sleep well', 'Gargle with warm salt water', 'Use saline nasal drops'],
  'headache': ['Rest in a quiet, dark room', 'Stay hydrated', 'Try gentle neck stretches', 'Apply cold or warm compress', 'See a doctor if headaches are severe or recurring'],
  'acidity': ['Avoid spicy and oily food', 'Eat smaller, frequent meals', 'Don\'t lie down immediately after eating', 'Drink cold milk or buttermilk', 'Avoid caffeine and alcohol'],
  'body pain': ['Rest and avoid strenuous activity', 'Apply ice pack to affected area', 'Gentle stretching may help', 'Take OTC pain relief if needed', 'See a doctor if pain persists'],
  'skin rash': ['Keep the area clean and dry', 'Avoid scratching', 'Apply calamine lotion', 'Wear loose cotton clothing', 'Consult a dermatologist if it worsens'],
};

// Function to find specialty from symptoms
export function findSpecialtyFromSymptoms(userInput) {
  const input = userInput.toLowerCase();
  const matches = [];

  for (const mapping of symptomMapping) {
    for (const symptom of mapping.symptoms) {
      if (input.includes(symptom)) {
        matches.push({
          symptom,
          specialty: mapping.specialty,
          severity: mapping.severity
        });
      }
    }
  }

  // Sort by severity priority
  const severityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
  matches.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return matches;
}

// Get self-care tips for symptoms
export function getSelfCareTips(symptom) {
  const key = Object.keys(selfCareTips).find(k => symptom.toLowerCase().includes(k));
  return key ? selfCareTips[key] : null;
}
