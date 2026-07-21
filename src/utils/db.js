/* ============================================
   JeevanCare+ Database Client (Fetch API)
   ============================================ */

const API_BASE = 'http://localhost:5000/api';
const DB_KEY_SESSION = 'jeevancare_session';
const DB_KEY_TOKEN = 'jeevancare_token';

// Initialize mock data if empty (Not needed for real DB, but kept for compatibility)
export function initDB() {
  // DB is managed by MySQL now.
}

// Helper for fetch with auth
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem(DB_KEY_TOKEN);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };
  
  // If body is FormData, let the browser set the Content-Type with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }
  
  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Request Failed');
  }
  return response.json();
}

// Auth methods
export async function register(userData) {
  try {
    let options = { method: 'POST' };

    if (userData instanceof FormData) {
      options.body = userData;
      // Fetch automatically sets the correct multipart/form-data boundary when passing FormData
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(userData);
    }

    const data = await fetchWithAuth('/auth/register', options);
    if (data.token) {
      localStorage.setItem(DB_KEY_TOKEN, data.token);
      localStorage.setItem(DB_KEY_SESSION, JSON.stringify(data.user));
      return data.user;
    }
  } catch (error) {
    throw error;
  }
  return null;
}

export async function loginApi(email, password) {
  const data = await fetchWithAuth('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  localStorage.setItem(DB_KEY_TOKEN, data.token);
  localStorage.setItem(DB_KEY_SESSION, JSON.stringify(data.user));
  return data.user;
}

// Used by old mock UI to quickly login as a user ID
export function login(userId) {
  // The old code passed a raw ID. This won't work easily with real auth without credentials.
  // We'll throw an error if used, because we're moving to real auth.
  console.error("Mock login(userId) is deprecated. Use loginApi(email, password) instead.");
  return null;
}

export function logout() {
  localStorage.removeItem(DB_KEY_SESSION);
  localStorage.removeItem(DB_KEY_TOKEN);
}

export function getCurrentUser() {
  const session = localStorage.getItem(DB_KEY_SESSION);
  return session ? JSON.parse(session) : null;
}

export async function fetchCurrentUserProfile() {
  return await fetchWithAuth('/auth/me');
}

export function getUsers() {
  // Deprecated. We don't fetch all users anymore.
  return [];
}

// Appointment methods
export async function createAppointment(data) {
  return await fetchWithAuth('/appointments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAppointmentStatus(appointmentId, status) {
  return await fetchWithAuth(`/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function getAppointmentsForUser(userId, role) {
  return await fetchWithAuth('/appointments');
}

// Public Data methods
export async function getHospitals() {
  const res = await fetch(`${API_BASE}/public/hospitals`);
  return await res.json();
}

export async function getClinics() {
  const res = await fetch(`${API_BASE}/public/clinics`);
  return await res.json();
}

export async function getDoctors() {
  const res = await fetch(`${API_BASE}/public/doctors`);
  return await res.json();
}

export async function getNurses() {
  const res = await fetch(`${API_BASE}/public/nurses`);
  return await res.json();
}

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
