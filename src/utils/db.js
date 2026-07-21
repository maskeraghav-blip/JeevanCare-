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
  
  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Request Failed');
  }
  return response.json();
}

// Auth methods
export async function register(userData) {
  const data = await fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  localStorage.setItem(DB_KEY_TOKEN, data.token);
  localStorage.setItem(DB_KEY_SESSION, JSON.stringify(data.user));
  return data.user;
}

export async function loginApi(email, password) {
  const data = await fetchWithAuth('/auth/login', {
    method: 'POST',
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
