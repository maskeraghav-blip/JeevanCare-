/* ============================================
   JeevanCare+ Services Data
   ============================================ */

export const additionalServices = [
  {
    id: 'svc-nurses',
    name: 'Nurses',
    icon: 'heart-pulse',
    description: 'Qualified and verified nurses for home care, post-surgery recovery, wound dressing, IV management, and elderly care.',
    features: ['24/7 availability', 'Verified professionals', 'Post-surgery care', 'Elderly care', 'Medication management']
  },
  {
    id: 'svc-physio',
    name: 'Physiotherapists',
    icon: 'activity',
    description: 'Expert physiotherapists for home rehabilitation, sports injury recovery, neurological rehab, and musculoskeletal treatment.',
    features: ['Home visits', 'Sports injury', 'Post-surgery rehab', 'Neurological rehab', 'Pain management']
  },
  {
    id: 'svc-lab',
    name: 'Lab Technicians',
    icon: 'flask-conical',
    description: 'At-home lab tests and sample collection by certified technicians. Blood tests, urine tests, and diagnostic services.',
    features: ['Home sample collection', 'Fast results', 'Blood tests', 'Health checkups', 'Digital reports']
  },
  {
    id: 'svc-caregivers',
    name: 'Caregivers',
    icon: 'hand-heart',
    description: 'Trained caregivers for elderly care, patient companionship, daily assistance, and chronic illness management.',
    features: ['Elderly companionship', 'Daily living assistance', 'Night care', 'Patient monitoring', 'Meal preparation']
  },
  {
    id: 'svc-ambulance',
    name: 'Ambulance Provider',
    icon: 'siren',
    description: 'One-tap ambulance booking with real-time tracking. Advanced life support, basic life support, and patient transport.',
    features: ['One-tap booking', 'Real-time tracking', 'Advanced Life Support', 'Basic Life Support', 'Patient transport']
  }
];

export const careProgrammes = [
  {
    id: 'care-elderly',
    name: 'Elderly Care',
    icon: 'user-round',
    description: 'Comprehensive care plans for senior citizens including regular health checkups, medication management, companion care, and emergency support.',
    color: '#818CF8'
  },
  {
    id: 'care-child',
    name: 'Child Care',
    icon: 'baby',
    description: 'Pediatric home visits, vaccination tracking, growth monitoring, and 24/7 teleconsultation for children\'s health.',
    color: '#F472B6'
  },
  {
    id: 'care-chronic',
    name: 'Chronic Disease Management',
    icon: 'clipboard-plus',
    description: 'Long-term management plans for diabetes, hypertension, heart disease, asthma, and other chronic conditions.',
    color: '#34D399'
  }
];

export const targetUsers = [
  { name: 'Senior Citizens', icon: 'user-round', description: 'Elderly care with home visits and monitoring' },
  { name: 'Children', icon: 'baby', description: 'Pediatric care and vaccination tracking' },
  { name: 'Busy Professionals', icon: 'briefcase', description: 'Quick consultations and home services' },
  { name: 'Post-Surgery Patients', icon: 'heart-pulse', description: 'Recovery support and home nursing' },
  { name: 'Chronic Illness Patients', icon: 'clipboard-plus', description: 'Long-term disease management' },
  { name: 'Mobility Challenged', icon: 'accessibility', description: 'Doorstep healthcare services' },
  { name: 'Rural & Semi-Urban', icon: 'map-pin', description: 'Bridging healthcare access gaps' }
];
