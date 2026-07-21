/* ============================================
   JeevanCare+ Mock Database (LocalStorage)
   ============================================ */

const DB_KEY_USERS = 'jeevancare_users';
const DB_KEY_APPOINTMENTS = 'jeevancare_appointments';
const DB_KEY_SESSION = 'jeevancare_session';

// Initialize mock data if empty
export function initDB() {
  if (!localStorage.getItem(DB_KEY_USERS)) {
    const mockUsers = [
      { id: 'p1', name: 'John Doe', role: 'patient', phone: '9876543210' },
      { id: 'd1', name: 'Dr. Ramesh Kumar', role: 'doctor', specialty: 'General Physician', phone: '9998887776' },
      { id: 'd2', name: 'Dr. Anita Sharma', role: 'physio', specialty: 'Physiotherapist', phone: '9998887777' },
      { id: 'n1', name: 'Nurse Priya', role: 'nurse', type: 'Registered Nurse', phone: '9998887778' }
    ];
    localStorage.setItem(DB_KEY_USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(DB_KEY_APPOINTMENTS)) {
    localStorage.setItem(DB_KEY_APPOINTMENTS, JSON.stringify([]));
  }
}

// Auth methods
export function login(userId) {
  const users = JSON.parse(localStorage.getItem(DB_KEY_USERS) || '[]');
  const user = users.find(u => u.id === userId);
  if (user) {
    localStorage.setItem(DB_KEY_SESSION, JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem(DB_KEY_SESSION);
}

export function getCurrentUser() {
  const session = localStorage.getItem(DB_KEY_SESSION);
  return session ? JSON.parse(session) : null;
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(DB_KEY_USERS) || '[]');
}

// Appointment methods
export function createAppointment(data) {
  const appointments = JSON.parse(localStorage.getItem(DB_KEY_APPOINTMENTS) || '[]');
  const newAppointment = {
    id: 'apt_' + Date.now(),
    patientId: data.patientId,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    providerId: data.providerId,
    providerName: data.providerName,
    providerRole: data.providerRole,
    type: data.type, // 'home-visit', 'clinic-visit', 'nursing'
    date: data.date,
    time: data.time,
    address: data.address,
    notes: data.notes,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  appointments.push(newAppointment);
  localStorage.setItem(DB_KEY_APPOINTMENTS, JSON.stringify(appointments));
  return newAppointment;
}

export function updateAppointmentStatus(appointmentId, status) {
  const appointments = JSON.parse(localStorage.getItem(DB_KEY_APPOINTMENTS) || '[]');
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index > -1) {
    appointments[index].status = status;
    appointments[index].updatedAt = new Date().toISOString();
    localStorage.setItem(DB_KEY_APPOINTMENTS, JSON.stringify(appointments));
    return appointments[index];
  }
  return null;
}

export function getAppointmentsForUser(userId, role) {
  const appointments = JSON.parse(localStorage.getItem(DB_KEY_APPOINTMENTS) || '[]');
  if (role === 'patient') {
    return appointments.filter(a => a.patientId === userId).reverse();
  } else {
    // For doctor or nurse
    return appointments.filter(a => a.providerId === userId).reverse();
  }
}
