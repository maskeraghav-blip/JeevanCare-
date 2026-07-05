export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const HYDERABAD_CENTER = { lat: 17.385044, lng: 78.486671 };
export const DEFAULT_ZOOM = 12;

export const STATUS_COLORS = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
  open: 'badge-open',
  in_progress: 'badge-in-progress',
  resolved: 'badge-resolved',
};

export const HOSPITAL_TYPES = [
  { value: '', label: 'All Hospitals' },
  { value: 'government', label: 'Government' },
  { value: 'private', label: 'Private' },
];

export const NURSE_SPECIALIZATIONS = [
  { value: '', label: 'All Specializations' },
  { value: 'elderly care', label: 'Elderly Care' },
  { value: 'post-op', label: 'Post-Operative' },
  { value: 'pediatric', label: 'Pediatric' },
  { value: 'ICU', label: 'ICU / Critical Care' },
  { value: 'general', label: 'General' },
];

export const DURATION_TYPES = [
  { value: 'one-time', label: 'One-Time Visit' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

export const COMPLAINT_CATEGORIES = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'other', label: 'Other' },
];

export const FACILITY_ICONS = {
  'Emergency 24/7': '🚨',
  'ICU': '🏥',
  'NICU': '👶',
  'Blood Bank': '🩸',
  'Ambulance': '🚑',
  'Pharmacy': '',
  'Laboratory': '',
  'X-Ray': '',
  'CT Scan': '🖥️',
  'MRI': '🧲',
  'Dialysis': '💉',
  'Maternity Ward': '🤱',
  'Pediatric ICU': '👶',
  'Ultrasound': '📡',
  'Operation Theatre': '🔪',
  'Cathlab': '❤️',
  'Laser Treatment': '✨',
  'Day Care Surgery': '🏨',
  'Optical Shop': '👓',
  'OPD': '🏢',
  'Chemotherapy': '💉',
  'Radiation': '☢️',
  'CCU': '❤️',
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatStatus = (status) => {
  return status ? status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';
};
