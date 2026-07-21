/* ============================================
   JeevanCare+ Main Application
   ============================================ */

import { Router } from './utils/router.js';
import { specialtyData, findSpecialtyFromSymptoms, getSelfCareTips } from './data/specialties.js';
import { additionalServices, careProgrammes, targetUsers } from './data/services.js';
import {
  debounce, starRating, getInitials, animateCounter,
  initScrollReveal, toggleTheme, loadTheme, getDirectionsUrl,
  getUserLocation, calculateDistance, formatDistance,
  toggleFavorite, isFavorite
} from './utils/helpers.js';
import { 
  initDB, getCurrentUser, logout, 
  getHospitals, getClinics, getDoctors, getNurses,
  hospitals, doctors, clinics, nurses, areas,
  searchHospitals, searchDoctors, getDoctorsBySpecialty, searchClinics,
  loadPublicData
} from './utils/db.js';

await loadPublicData();
initDB();

// ===== Initialize App =====
const router = new Router();
let currentTheme = loadTheme();
let userLocation = null;
let mapInstance = null;

// Try to get user location
getUserLocation().then(loc => { userLocation = loc; }).catch(() => {});

// ===== NAVBAR =====
function renderNavbar() {
  const navbar = document.getElementById('navbar');
  const user = getCurrentUser();
  navbar.className = 'navbar';
  
  let authLinks = `<a class="nav-link" data-route="/login" onclick="location.hash='/login'">Login</a>`;
  let mobileAuthLinks = `<a class="nav-link" onclick="closeMobileNav();location.hash='/login'">🔑 Login</a>`;
  
  if (user) {
    const dashRoute = user.role === 'patient' ? '/patient-dashboard' : user.role === 'nurse' ? '/nurse-dashboard' : '/doctor-dashboard';
    authLinks = `
      <a class="nav-link" data-route="${dashRoute}" onclick="location.hash='${dashRoute}'">Dashboard</a>
      <a class="nav-link" style="cursor:pointer;" onclick="window.handleLogout()">Logout</a>
    `;
    mobileAuthLinks = `
      <a class="nav-link" onclick="closeMobileNav();location.hash='${dashRoute}'">📊 Dashboard</a>
      <a class="nav-link" onclick="closeMobileNav();window.handleLogout()">🚪 Logout</a>
    `;
  }

  let navLinksHtml = '';
  let mobileNavLinksHtml = '';
  
  if (!user || user.role === 'patient') {
    navLinksHtml = `
      <a class="nav-link active" data-route="/" onclick="location.hash='/'">Home</a>
      <a class="nav-link" data-route="/hospitals" onclick="location.hash='/hospitals'">Hospitals</a>
      <a class="nav-link" data-route="/doctors" onclick="location.hash='/doctors'">Doctors</a>
      <a class="nav-link" data-route="/clinics" onclick="location.hash='/clinics'">Clinics</a>
      <a class="nav-link" data-route="/home-visit" onclick="location.hash='/home-visit'">Home Visit</a>
      <a class="nav-link" data-route="/nursing" onclick="location.hash='/nursing'">Nursing</a>
      <a class="nav-link" data-route="/services" onclick="location.hash='/services'">Services</a>
    `;
    mobileNavLinksHtml = `
      <a class="nav-link" onclick="closeMobileNav();location.hash='/'">🏠 Home</a>
      <a class="nav-link" onclick="closeMobileNav();location.hash='/hospitals'">🏥 Hospitals</a>
      <a class="nav-link" onclick="closeMobileNav();location.hash='/doctors'">👨‍⚕️ Doctors</a>
      <a class="nav-link" onclick="closeMobileNav();location.hash='/clinics'">🏪 Clinics</a>
      <a class="nav-link" onclick="closeMobileNav();location.hash='/home-visit'">🏠 Home Visit</a>
      <a class="nav-link" onclick="closeMobileNav();location.hash='/nursing'">🩺 Nursing</a>
      <a class="nav-link" onclick="closeMobileNav();location.hash='/services'">⚕️ Services</a>
    `;
  }

  navbar.innerHTML = `
    <div class="navbar-inner">
      <div class="navbar-logo" onclick="location.hash='/'">
        <div class="logo-icon"><i data-lucide="heart-pulse"></i></div>
        <span>JeevanCare<span class="logo-plus">+</span></span>
      </div>
      <div class="navbar-links">
        ${navLinksHtml}
        ${authLinks}
      </div>
      <div class="navbar-actions">
        <button class="theme-toggle" id="theme-toggle" title="Toggle theme">
          <i data-lucide="\${currentTheme === 'dark' ? 'sun' : 'moon'}"></i>
        </button>
        <button class="mobile-menu-btn" id="mobile-menu-btn">
          <i data-lucide="menu"></i>
        </button>
      </div>
    </div>
    <div class="mobile-nav" id="mobile-nav">
      ${mobileNavLinksHtml}
      ${mobileAuthLinks}
    </div>
  `;

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    currentTheme = toggleTheme();
    document.querySelector('#theme-toggle i').setAttribute('data-lucide', currentTheme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  });

  // Mobile menu
  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('open');
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

window.closeMobileNav = () => {
  document.getElementById('mobile-nav').classList.remove('open');
};

window.handleLogout = () => {
  logout();
  renderNavbar();
  location.hash = '/';
};

function renderBookingPage() {
  const parts = window.location.hash.split('/');
  const providerId = parts[2];
  const providerRole = parts[3];
  const type = parts[4];

  const user = getCurrentUser();
  if (!user || user.role !== 'patient') {
    alert('Please login as a Patient to book an appointment.');
    location.hash = '/login';
    return;
  }
  
  const isHospital = type === 'hospital';
  let hospital = null;
  let hospitalDocs = [];
  let providerName = '';

  if (providerRole === 'doctor') {
    const doc = window.doctors && window.doctors.find(d => d.id === providerId);
    providerName = doc ? doc.name : 'Doctor';
  } else if (providerRole === 'nurse') {
    const nurse = window.nurses && window.nurses.find(n => n.id === providerId);
    providerName = nurse ? nurse.name : 'Nurse';
  } else if (providerRole === 'hospital') {
    hospital = (window.hospitals && window.hospitals.find(h => h.id === providerId)) || 
               (window.clinics && window.clinics.find(c => c.id === providerId));
    providerName = hospital ? hospital.name : 'Hospital';
    if (hospital && window.doctors) {
      hospitalDocs = window.doctors.filter(d => d.hospital && d.hospital.toLowerCase().includes(hospital.name.toLowerCase().split(' ')[0]));
    }
  }

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="container" style="padding-top: var(--space-2xl); padding-bottom: var(--space-4xl);">
      <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px;"><i data-lucide="arrow-left" style="width:16px;"></i> Back</button>
      <div class="card" style="max-width: 600px; margin: 0 auto; padding: var(--space-xl);">
        <h2 style="margin-bottom: 16px;">Book ${isHospital ? 'Hospital Visit' : type === 'nursing' ? 'Nurse' : 'Appointment'}</h2>
        <p style="margin-bottom: 24px; color: var(--text-secondary);">Booking with <strong>${providerName}</strong></p>
        
        <form id="booking-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Patient Name</label>
              <input type="text" id="b-name" required value="${user.name}" style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);" />
            </div>
            <div style="flex: 1; min-width: 200px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Contact Number</label>
              <input type="tel" id="b-phone" required value="${user.phone || ''}" style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);" />
            </div>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Date</label>
            <input type="date" id="b-date" required style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);" />
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Time</label>
            <input type="time" id="b-time" required style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);" />
          </div>
          ${isHospital ? `
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Department</label>
              <select id="b-dept" required style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);">
                <option value="">Select Department</option>
                ${hospital && hospital.specialties ? hospital.specialties.map(s => `<option value="${s}">${s}</option>`).join('') : '<option value="General">General</option>'}
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Doctor (Optional)</label>
              <select id="b-doc" style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);">
                <option value="">Any Available Doctor</option>
                ${hospitalDocs.map(d => `<option value="${d.id}">${d.name} - ${d.specialty}</option>`).join('')}
              </select>
            </div>
          ` : type === 'clinic-visit' ? `
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Clinic Location</label>
              <input type="text" id="b-address" disabled value="Doctor's Clinic / Hospital" style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-secondary); border: 1px solid var(--border);" />
            </div>
          ` : `
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Your Address (For Home Visit/Nursing)</label>
              <input type="text" id="b-address" required placeholder="Enter your full address" style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);" />
            </div>
          `}
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Reason / Notes</label>
            <textarea id="b-notes" rows="3" placeholder="Any specific requirements or symptoms?" style="width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border);"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 16px;">Confirm Booking</button>
        </form>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
  
  document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    import('./utils/db.js').then(async ({ createAppointment }) => {
      let notesText = document.getElementById('b-notes').value;
      if (isHospital) {
         const dept = document.getElementById('b-dept').value;
         const docSel = document.getElementById('b-doc');
         const docText = docSel.options[docSel.selectedIndex].text;
         notesText = `Dept: ${dept} | Doc: ${docText} | ${notesText}`;
      }

      try {
        await createAppointment({
          patientId: user.id,
          patientName: document.getElementById('b-name').value,
          patientPhone: document.getElementById('b-phone').value,
          providerId: providerId,
          providerName: providerName,
          providerRole: providerRole,
          type: type,
          date: document.getElementById('b-date').value,
          time: document.getElementById('b-time').value,
          address: isHospital ? 'In-person Hospital Visit' : document.getElementById('b-address').value,
          notes: notesText,
          status: isHospital ? 'pending' : 'new'
        });
        if (isHospital) {
          alert('Your request has been sent. Please call the hospital to confirm your slot.');
        } else {
          alert('Booking confirmed! It is now pending provider acceptance. You can check the status on your dashboard.');
        }
        location.hash = '/patient-dashboard';
      } catch (err) {
        alert("Failed to create appointment: " + err.message);
      }
    });
  });
}

// ===== FOOTER =====
function renderFooter() {
  const footer = document.getElementById('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="navbar-logo" style="margin-bottom: 8px;">
            <div class="logo-icon"><i data-lucide="heart-pulse"></i></div>
            <span>JeevanCare<span class="logo-plus">+</span></span>
          </div>
          <p>AI-powered healthcare ecosystem making healthcare accessible, faster, and smarter for everyone. From symptom to care, we guide your health journey.</p>
        </div>
        <div>
          <h4 class="footer-heading">Platform</h4>
          <ul class="footer-links">
            <li><a href="#/hospitals">Find Hospitals</a></li>
            <li><a href="#/doctors">Find Doctors</a></li>
            <li><a href="#/clinics">Find Clinics</a></li>
            <li><a href="#/home-visit">Home Visit Doctor</a></li>
            <li><a href="#/nursing">Nursing</a></li>
            <li><a href="#/services">Home Services</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Services</h4>
          <ul class="footer-links">
            <li><a href="#/services">Home Doctor</a></li>
            <li><a href="#/services">Nursing Care</a></li>
            <li><a href="#/services">Lab Tests at Home</a></li>
            <li><a href="#/services">Physiotherapy</a></li>
            <li><a href="#/emergency">Ambulance</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Support</h4>
          <ul class="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 JeevanCare+. All rights reserved.</span>
        <span>Made with ❤️ for healthcare access</span>
      </div>
    </div>
  `;
}

// ===== MAP HELPER =====
function createMap(containerId, markers = [], center = [17.45, 78.45], zoom = 11) {
  // Destroy previous map
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  const container = document.getElementById(containerId);
  if (!container) return null;

  mapInstance = L.map(containerId).setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(mapInstance);

  const markerCluster = L.markerClusterGroup();

  markers.forEach(m => {
    const color = m.type === 'government' ? '#34D399' : m.type === 'clinic' ? '#60A5FA' : '#818CF8';
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const marker = L.marker([m.lat, m.lng], { icon });
    const typeBadge = m.type === 'government' ? '<span class="popup-badge govt">GOVT</span>' : m.type === 'clinic' ? '<span class="popup-badge" style="background:#EFF6FF;color:#3B82F6;">CLINIC</span>' : '<span class="popup-badge private">PRIVATE</span>';
    marker.bindPopup(`
      <div class="map-popup">
        ${typeBadge}
        <h3>${m.name}</h3>
        <p>📍 ${m.area}</p>
        <a class="popup-directions" href="${getDirectionsUrl(m.lat, m.lng)}" target="_blank">🧭 Get Directions</a>
      </div>
    `);
    markerCluster.addLayer(marker);
  });

  mapInstance.addLayer(markerCluster);

  // Add user location marker
  if (userLocation) {
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background:#EF4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(239,68,68,0.5);"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(mapInstance)
      .bindPopup('<b>📍 Your Location</b>');
  }

  // Fix map rendering
  setTimeout(() => mapInstance.invalidateSize(), 200);
  return mapInstance;
}

// ===== PAGE: HOME =====
function renderHome() {
  const main = document.getElementById('main-content');
  const totalHospitals = hospitals.length;
  const totalDoctors = doctors.length;
  const totalAreas = areas.length;

  main.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <div class="container" style="position:relative;z-index:1;">
        <div class="hero-content">
          <div class="hero-badge">
            <i data-lucide="sparkles" style="width:14px;height:14px;"></i>
            AI-Powered Healthcare Platform
          </div>
          <h1>Healthcare Made<br><span class="gradient-text">Simple & Accessible</span></h1>
          <p class="hero-description">Find the best hospitals, doctors, and clinics near you. Book home doctor visits, request nursing services, and access emergency services — all from one platform.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="location.hash='/hospitals'">
              <i data-lucide="search" style="width:18px;height:18px;"></i> Find Hospital
            </button>
            <button class="btn btn-secondary btn-lg" onclick="location.hash='/home-visit'">
              <i data-lucide="home" style="width:18px;height:18px;"></i> Home Visit Doctor
            </button>
          </div>
          <div class="hero-search">
            <div class="search-input-wrapper">
              <i data-lucide="search"></i>
              <input class="search-input" id="hero-search" type="text" placeholder="Search hospitals, doctors, or symptoms..." />
            </div>
            <div class="search-results-dropdown hidden" id="hero-search-results"></div>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-float-card" style="top:15%;right:10%;">
          <div class="float-icon" style="background:rgba(0,212,170,0.15);color:var(--accent);border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <i data-lucide="hospital" style="width:20px;height:20px;"></i>
          </div>
          <div>
            <div style="font-weight:600;color:var(--text-primary);">${totalHospitals}+ Hospitals</div>
            <div style="font-size:12px;color:var(--text-muted);">Across Hyderabad</div>
          </div>
        </div>
        <div class="hero-float-card" style="top:45%;right:0;">
          <div class="float-icon" style="background:rgba(99,102,241,0.15);color:#818CF8;border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <i data-lucide="stethoscope" style="width:20px;height:20px;"></i>
          </div>
          <div>
            <div style="font-weight:600;color:var(--text-primary);">${totalDoctors}+ Doctors</div>
            <div style="font-size:12px;color:var(--text-muted);">Verified Specialists</div>
          </div>
        </div>
        <div class="hero-float-card" style="top:75%;right:15%;">
          <div class="float-icon" style="background:rgba(239,68,68,0.15);color:#EF4444;border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <i data-lucide="siren" style="width:20px;height:20px;"></i>
          </div>
          <div>
            <div style="font-weight:600;color:var(--text-primary);">24/7 Emergency</div>
            <div style="font-size:12px;color:var(--text-muted);">One-Tap Ambulance</div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK ACTIONS -->
    <section class="quick-actions">
      <div class="container">
        <div class="grid grid-4 stagger-children" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
          <div class="quick-action-card" onclick="location.hash='/hospitals'">
            <div class="quick-action-icon" style="background:rgba(99,102,241,0.15);color:#818CF8;">🏥</div>
            <h3>Find Hospital</h3>
            <p>Discover hospitals near you</p>
          </div>
          <div class="quick-action-card" onclick="location.hash='/doctors'">
            <div class="quick-action-icon" style="background:rgba(0,212,170,0.15);color:var(--accent);">👨‍⚕️</div>
            <h3>Find Doctor</h3>
            <p>Best doctors by specialty</p>
          </div>
          <div class="quick-action-card" onclick="location.hash='/home-visit'">
            <div class="quick-action-icon" style="background:rgba(245,158,11,0.15);color:#F59E0B;">🏠</div>
            <h3>Home Visit</h3>
            <p>Call clinic doctors to home</p>
          </div>
          <div class="quick-action-card" onclick="location.hash='/services'">
            <div class="quick-action-icon" style="background:rgba(236,72,153,0.15);color:#EC4899;">🏠</div>
            <h3>Home Doctor</h3>
            <p>Doctor visits at your door</p>
          </div>
          <div class="quick-action-card" onclick="location.hash='/emergency'">
            <div class="quick-action-icon" style="background:rgba(239,68,68,0.15);color:#EF4444;">🚑</div>
            <h3>Emergency</h3>
            <p>One-tap ambulance booking</p>
          </div>
          <div class="quick-action-card" onclick="location.hash='/clinics'">
            <div class="quick-action-icon" style="background:rgba(59,130,246,0.15);color:#3B82F6;">🏪</div>
            <h3>Find Clinics</h3>
            <p>Local clinics & diagnostics</p>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section how-it-works">
      <div class="container">
        <div class="section-header reveal">
          <h2>How JeevanCare+ Works</h2>
          <p>From your first symptom to the right level of care — in three simple steps</p>
        </div>
        <div class="steps-container reveal">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>Find a Doctor</h3>
            <p>Search for specialists, general physicians, or clinic doctors in your area.</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>Book Home Visit</h3>
            <p>Many people now prefer calling doctors to their home for small issues or checkups.</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>Connect & Heal</h3>
            <p>Book appointments, find nearby hospitals, or request a home doctor visit — all in one tap.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SPECIALTIES -->
    <section class="section" style="padding-top:0;">
      <div class="container">
        <div class="section-header reveal">
          <h2>Explore Specialties</h2>
          <p>Browse our wide range of medical specialties</p>
        </div>
        <div class="specialties-scroll reveal">
          ${specialtyData.map(s => `
            <div class="specialty-pill" onclick="location.hash='/doctors'">
              <span class="emoji">${s.icon}</span>
              <span>${s.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="grid grid-4 reveal" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
          <div class="stat-card">
            <div class="stat-number" data-count="${totalHospitals}">${totalHospitals}+</div>
            <div class="stat-label">Hospitals Listed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" data-count="${totalDoctors}">${totalDoctors}+</div>
            <div class="stat-label">Verified Doctors</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" data-count="${totalAreas}">${totalAreas}+</div>
            <div class="stat-label">Areas Covered</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" data-count="20">20+</div>
            <div class="stat-label">Specialties</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES PREVIEW -->
    <section class="section">
      <div class="container">
        <div class="section-header reveal">
          <h2>Additional Services</h2>
          <p>Healthcare beyond the hospital — right at your doorstep</p>
        </div>
        <div class="grid reveal" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
          ${additionalServices.map(s => `
            <div class="card service-card hover-lift">
              <div class="service-icon"><i data-lucide="${s.icon}"></i></div>
              <h3>${s.name}</h3>
              <p>${s.description.substring(0, 80)}...</p>
            </div>
          `).join('')}
        </div>
        <div style="text-align:center;margin-top:var(--space-2xl);">
          <button class="btn btn-secondary" onclick="location.hash='/services'">View All Services →</button>
        </div>
      </div>
    </section>

    <!-- MAP PREVIEW -->
    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="section-header reveal">
          <h2>Hospitals Near You</h2>
          <p>Interactive map with all hospitals and clinics across Hyderabad</p>
        </div>
        <div class="map-legend">
          <div class="legend-item"><div class="legend-dot private"></div> Private Hospitals</div>
          <div class="legend-item"><div class="legend-dot govt"></div> Government Hospitals</div>
          <div class="legend-item"><div class="legend-dot clinic"></div> Clinics</div>
        </div>
        <div class="map-container reveal" id="home-map" style="height:450px;"></div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container text-center">
        <div class="reveal">
          <h2 style="font-size:var(--fs-3xl);margin-bottom:var(--space-md);">Ready to Take Control of <span style="background:var(--accent-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Your Health?</span></h2>
          <p style="color:var(--text-secondary);max-width:600px;margin:0 auto var(--space-2xl);">Book a home visit with a clinic doctor or browse hospitals near you. Healthcare has never been this easy.</p>
          <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary btn-lg" onclick="location.hash='/home-visit'">
              <i data-lucide="home" style="width:18px;height:18px;"></i> Book Home Visit
            </button>
            </div>
        </div>
      </div>
    </section>
  `;

  // Initialize hero search
  const heroSearch = document.getElementById('hero-search');
  const heroResults = document.getElementById('hero-search-results');
  heroSearch.addEventListener('input', debounce((e) => {
    const q = e.target.value.trim();
    if (q.length < 2) { heroResults.classList.add('hidden'); return; }
    const hResults = searchHospitals(q).slice(0, 3);
    const dResults = searchDoctors(q).slice(0, 3);
    if (hResults.length === 0 && dResults.length === 0) { heroResults.classList.add('hidden'); return; }
    heroResults.classList.remove('hidden');
    heroResults.innerHTML = [
      ...hResults.map(h => `<div class="search-result-item" onclick="location.hash='/hospitals'"><div class="search-result-icon hospital"><i data-lucide="hospital" style="width:18px;height:18px;"></i></div><div><div style="font-weight:500;">${h.name}</div><div style="font-size:12px;color:var(--text-muted);">${h.area} • ${h.type}</div></div></div>`),
      ...dResults.map(d => `<div class="search-result-item" onclick="location.hash='/doctors'"><div class="search-result-icon doctor"><i data-lucide="stethoscope" style="width:18px;height:18px;"></i></div><div><div style="font-weight:500;">${d.name}</div><div style="font-size:12px;color:var(--text-muted);">${d.specialty} • ${d.hospital}</div></div></div>`)
    ].join('');
    if (window.lucide) lucide.createIcons();
  }, 200));

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-search')) heroResults.classList.add('hidden');
  });

  // Initialize map
  setTimeout(() => {
    const allMapMarkers = [
      ...hospitals.map(h => ({ ...h, type: h.type })),
      ...clinics.filter(c => c.area !== 'Multiple Locations').map(c => ({ ...c, type: 'clinic' }))
    ];
    createMap('home-map', allMapMarkers, userLocation ? [userLocation.lat, userLocation.lng] : [17.45, 78.45], 11);
  }, 300);

  if (window.lucide) lucide.createIcons();
  setTimeout(initScrollReveal, 100);
}

// ===== PAGE: HOSPITALS =====
function renderHospitals() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2 style="font-size:var(--fs-2xl);">🏥 Hospital Discovery</h2>
          <p>Find private and government hospitals across Hyderabad</p>
        </div>

        <div class="discovery-layout">
          <!-- Sidebar Filters -->
          <div class="filter-sidebar" id="hospital-filters">
            <div class="filter-group">
              <h3>Search</h3>
              <div class="search-input-wrapper" style="border-radius:var(--radius-md);">
                <i data-lucide="search"></i>
                <input class="search-input" id="hospital-search" type="text" placeholder="Hospital name..." />
              </div>
            </div>
            <div class="filter-group">
              <h3>Type</h3>
              <label class="filter-option"><input type="checkbox" value="private" checked class="type-filter" /> Private</label>
              <label class="filter-option"><input type="checkbox" value="government" checked class="type-filter" /> Government</label>
            </div>
            <div class="filter-group">
              <h3>Area</h3>
              <div style="max-height:300px;overflow-y:auto;">
                ${areas.map(a => `<label class="filter-option"><input type="checkbox" value="${a}" checked class="area-filter" /> ${a}</label>`).join('')}
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="discovery-main">
            <div class="results-header">
              <span class="results-count" id="hospital-count">Showing <strong>${hospitals.length}</strong> hospitals</span>
              <div class="tabs">
                <button class="tab active" id="tab-list" onclick="setHospitalView('list')">List</button>
                <button class="tab" id="tab-map" onclick="setHospitalView('map')">Map</button>
                <button class="tab" id="tab-split" onclick="setHospitalView('split')">Split</button>
              </div>
            </div>
            <div class="map-legend" style="margin-bottom:var(--space-md);">
              <div class="legend-item"><div class="legend-dot private"></div> Private</div>
              <div class="legend-item"><div class="legend-dot govt"></div> Government</div>
            </div>
            <div id="hospital-view-container">
              <div class="hospital-grid" id="hospital-list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  let currentView = 'list';
  let filteredHospitals = [...hospitals];

  function applyFilters() {
    const searchVal = document.getElementById('hospital-search').value.toLowerCase();
    const types = [...document.querySelectorAll('.type-filter:checked')].map(c => c.value);
    const selectedAreas = [...document.querySelectorAll('.area-filter:checked')].map(c => c.value);

    filteredHospitals = hospitals.filter(h => {
      const matchesSearch = !searchVal || h.name.toLowerCase().includes(searchVal) || h.area.toLowerCase().includes(searchVal);
      const matchesType = types.includes(h.type);
      const matchesArea = selectedAreas.includes(h.area);
      return matchesSearch && matchesType && matchesArea;
    });

    document.getElementById('hospital-count').innerHTML = `Showing <strong>${filteredHospitals.length}</strong> hospitals`;
    renderHospitalView();
  }

  function renderHospitalView() {
    const container = document.getElementById('hospital-view-container');
    if (currentView === 'list') {
      container.innerHTML = `<div class="hospital-grid" id="hospital-list">${renderHospitalCards(filteredHospitals)}</div>`;
    } else if (currentView === 'map') {
      container.innerHTML = `<div class="map-container" id="hospital-map" style="height:600px;"></div>`;
      setTimeout(() => createMap('hospital-map', filteredHospitals), 100);
    } else {
      container.innerHTML = `
        <div class="split-view">
          <div class="hospital-list">${renderHospitalCards(filteredHospitals)}</div>
          <div class="map-container" id="hospital-map"></div>
        </div>
      `;
      setTimeout(() => createMap('hospital-map', filteredHospitals), 100);
    }
    if (window.lucide) lucide.createIcons();
  }

  window.setHospitalView = (view) => {
    currentView = view;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${view}`).classList.add('active');
    renderHospitalView();
  };

  document.getElementById('hospital-search').addEventListener('input', debounce(applyFilters, 200));
  document.querySelectorAll('.type-filter, .area-filter').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  applyFilters();
  if (window.lucide) lucide.createIcons();
}

function renderHospitalCards(list) {
  if (list.length === 0) return '<div class="empty-state"><h3>No hospitals found</h3><p>Try adjusting your filters</p></div>';
  return list.map(h => `
    <div class="card hospital-card hover-lift" onclick="location.hash='/hospital/${h.id}'" style="cursor:pointer;">
      <div class="card-header">
        <div>
          <div class="card-title">${h.name}</div>
          <div class="card-area"><i data-lucide="map-pin"></i> ${h.area}</div>
        </div>
        <span class="badge ${h.type === 'government' ? 'badge-govt' : 'badge-private'}">${h.type === 'government' ? 'GOVT' : 'PRIVATE'}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;">
        ${h.specialties.map(s => `<span class="badge badge-specialty">${s}</span>`).join('')}
      </div>
      <div class="card-meta">
        <div class="card-rating">★ ${h.rating}</div>
        <a href="${getDirectionsUrl(h.lat, h.lng)}" target="_blank" onclick="event.stopPropagation();" style="font-size:13px;display:flex;align-items:center;gap:4px;">
          <i data-lucide="navigation" style="width:14px;height:14px;"></i> Directions
        </a>
      </div>
    </div>
  `).join('');
}

window.showHospitalDetail = (id) => {
  const h = hospitals.find(h => h.id === id);
  if (!h) return;
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${h.name}</h2>
        <button class="modal-close" onclick="document.getElementById('modal-overlay').classList.remove('visible')">✕</button>
      </div>
      <span class="badge ${h.type === 'government' ? 'badge-govt' : 'badge-private'}" style="margin-bottom:16px;">${h.type.toUpperCase()}</span>
      <p style="color:var(--text-secondary);margin-bottom:16px;">📍 ${h.area}, Hyderabad</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">
        ${h.specialties.map(s => `<span class="badge badge-specialty">${s}</span>`).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
        <span style="color:#F59E0B;font-size:18px;">★ ${h.rating}</span>
        <span style="color:var(--text-muted);font-size:14px;">Rating</span>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <a class="btn btn-primary" href="${getDirectionsUrl(h.lat, h.lng)}" target="_blank">
          <i data-lucide="navigation" style="width:16px;height:16px;"></i> Get Directions
        </a>
        <button class="btn btn-secondary" onclick="toggleFavHospital('${h.id}', this)">
          ${isFavorite(h.id) ? '❤️ Saved' : '🤍 Save'}
        </button>
      </div>
    </div>
  `;
  overlay.classList.add('visible');
  if (window.lucide) lucide.createIcons();
};

window.toggleFavHospital = (id, btn) => {
  toggleFavorite(id);
  btn.innerHTML = isFavorite(id) ? '❤️ Saved' : '🤍 Save';
};

// ===== PAGE: DOCTORS =====
function renderDoctors() {
  const main = document.getElementById('main-content');
  const allSpecialties = [...new Set(doctors.map(d => d.specialty))].sort();

  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2 style="font-size:var(--fs-2xl);">👨‍⚕️ Find Doctors</h2>
          <p>Discover top specialists across India</p>
        </div>



        <!-- Filter chips -->
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:var(--space-xl);">
          <button class="filter-chip active" data-specialty="all" onclick="filterDoctors('all', this)">All</button>
          ${allSpecialties.map(s => `<button class="filter-chip" data-specialty="${s}" onclick="filterDoctors('${s}', this)">${specialtyData.find(sd => sd.name === s)?.icon || '🩺'} ${s}</button>`).join('')}
        </div>

        <!-- Search -->
        <div class="search-input-wrapper" style="border-radius:var(--radius-md);max-width:400px;margin-bottom:var(--space-xl);">
          <i data-lucide="search"></i>
          <input class="search-input" id="doctor-search" type="text" placeholder="Search by doctor name..." />
        </div>

        <!-- Doctor Grid -->
        <div id="doctor-grid" class="hospital-grid"></div>
      </div>
    </div>
  `;

  let filteredDocs = [...doctors];

  function renderDoctorCards() {
    const grid = document.getElementById('doctor-grid');
    if (filteredDocs.length === 0) {
      grid.innerHTML = '<div class="empty-state"><h3>No doctors found</h3><p>Try a different search</p></div>';
      return;
    }
    grid.innerHTML = filteredDocs.map(d => `
      <div class="card doctor-card hover-lift" style="display:flex;gap:var(--space-md);align-items:flex-start;">
        <div class="doctor-avatar">${getInitials(d.name)}</div>
        <div class="doctor-info">
          <div class="doctor-name">${d.name}</div>
          <div class="doctor-specialty">${specialtyData.find(s => s.name === d.specialty)?.icon || '🩺'} ${d.specialty}</div>
          <div class="doctor-details">${d.hospital} • ${d.city}</div>
          <span class="doctor-experience">⏱ ${d.experience}</span>
          <div style="margin-top:8px;color:#F59E0B;font-size:14px;">${starRating(d.rating)} ${d.rating}</div>
        </div>
      </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
  }

  window.filterDoctors = (specialty, el) => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    filteredDocs = specialty === 'all' ? [...doctors] : getDoctorsBySpecialty(specialty);
    renderDoctorCards();
  };

  document.getElementById('doctor-search').addEventListener('input', debounce((e) => {
    const q = e.target.value.trim();
    filteredDocs = q ? searchDoctors(q) : [...doctors];
    renderDoctorCards();
  }, 200));



  renderDoctorCards();
  if (window.lucide) lucide.createIcons();
}

// ===== PAGE: CLINICS =====
function renderClinics() {
  const main = document.getElementById('main-content');
  const clinicSpecialties = [...new Set(clinics.map(c => c.specialty))].sort();

  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2 style="font-size:var(--fs-2xl);">🏪 Clinics & Diagnostics</h2>
          <p>Find local clinics, diagnostic centers, and specialty clinics</p>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:var(--space-xl);">
          <button class="filter-chip active" onclick="filterClinics('all', this)">All</button>
          ${clinicSpecialties.map(s => `<button class="filter-chip" onclick="filterClinics('${s}', this)">${s}</button>`).join('')}
        </div>
        <div class="search-input-wrapper" style="border-radius:var(--radius-md);max-width:400px;margin-bottom:var(--space-xl);">
          <i data-lucide="search"></i>
          <input class="search-input" id="clinic-search" type="text" placeholder="Search clinics..." />
        </div>
        <div class="results-count" id="clinic-count" style="margin-bottom:var(--space-md);">Showing <strong>${clinics.length}</strong> clinics</div>
        <div class="map-container" id="clinic-map" style="height:350px;margin-bottom:var(--space-xl);"></div>
        <div class="hospital-grid" id="clinic-grid"></div>
      </div>
    </div>
  `;

  let filteredClinics = [...clinics];

  function renderClinicCards() {
    const grid = document.getElementById('clinic-grid');
    document.getElementById('clinic-count').innerHTML = `Showing <strong>${filteredClinics.length}</strong> clinics`;
    grid.innerHTML = filteredClinics.map(c => `
      <div class="card card-compact hover-lift">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-weight:600;font-family:var(--font-heading);margin-bottom:4px;">${c.name}</div>
            <div style="font-size:13px;color:var(--text-secondary);display:flex;align-items:center;gap:4px;">
              <i data-lucide="map-pin" style="width:12px;height:12px;"></i> ${c.area}
            </div>
          </div>
          <span class="badge badge-clinic">${c.specialty}</span>
        </div>
        ${c.area !== 'Multiple Locations' ? `<button class="btn btn-secondary btn-sm" onclick="location.hash='/hospital/${c.id}'" style="margin-top:8px;font-size:12px;">View Details</button>` : ''}
      </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
  }

  window.filterClinics = (specialty, el) => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    filteredClinics = specialty === 'all' ? [...clinics] : clinics.filter(c => c.specialty === specialty);
    renderClinicCards();
    const mapMarkers = filteredClinics.filter(c => c.area !== 'Multiple Locations').map(c => ({ ...c, type: 'clinic' }));
    createMap('clinic-map', mapMarkers);
  };

  document.getElementById('clinic-search').addEventListener('input', debounce((e) => {
    const q = e.target.value.trim();
    filteredClinics = q ? searchClinics(q) : [...clinics];
    renderClinicCards();
  }, 200));

  renderClinicCards();
  setTimeout(() => {
    const mapMarkers = clinics.filter(c => c.area !== 'Multiple Locations').map(c => ({ ...c, type: 'clinic' }));
    createMap('clinic-map', mapMarkers);
  }, 200);
  if (window.lucide) lucide.createIcons();
}

// ===== PAGE: HOME VISIT DOCTORS =====
function renderHomeVisitDoctors() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2 style="font-size:var(--fs-2xl);">🏠 Home Visit Doctors</h2>
          <p>Call clinic doctors to your home for small checkups and treatments</p>
        </div>
        <div class="hospital-grid" id="home-visit-grid"></div>
      </div>
    </div>
  `;

  // Include clinic doctors for home visits
  const homeVisitDocs = doctors.filter(d => d.isClinicDoctor === true);

  const grid = document.getElementById('home-visit-grid');
  grid.innerHTML = homeVisitDocs.map(d => `
    <div class="card doctor-card hover-lift" style="display:flex;gap:var(--space-md);align-items:flex-start;">
      <div class="doctor-avatar">${getInitials(d.name)}</div>
      <div class="doctor-info" style="flex:1;">
        <div class="doctor-name">${d.name}</div>
        <div class="doctor-specialty">${d.specialty} • ${d.hospital}</div>
        <span class="badge" style="background:#ECFDF5;color:#059669;margin-top:8px;">🏠 Home Visit Available</span>
        <div style="margin-top:12px;">
          <button class="btn btn-primary btn-sm" onclick="location.hash='/doctor/${d.id}'">View Profile & Book</button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// ===== PAGE: NURSING =====

function renderNursing() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2 style="font-size:var(--fs-2xl);">🩺 Nursing Care</h2>
          <p>Professional nursing services at your home for post-surgery recovery, elderly care, and more.</p>
        </div>
        <div class="grid grid-3">
          ${nurses.map(n => `
            <div class="card hover-lift" style="display:flex;flex-direction:column;gap:12px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <h3 style="font-size:16px;">${n.name}</h3>
                  <div style="font-size:13px;color:var(--text-secondary);">${n.specialty} • ${n.experience}</div>
                </div>
                <div style="background:rgba(16, 185, 129, 0.15);color:#10B981;padding:4px 8px;border-radius:4px;font-size:12px;display:flex;align-items:center;gap:4px;">
                  ${n.verified ? '<i data-lucide="check-circle" style="width:14px;height:14px;"></i> Verified' : ''}
                </div>
              </div>
              <p style="font-size:14px;color:var(--text-secondary);flex:1;">${n.bio}</p>
              <button class="btn btn-secondary btn-sm" onclick="location.hash='/nurse/${n.id}'" style="width:100%;">View Profile</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}


// ===== PROFILES =====
function renderHospitalProfile(id) {
  const hospital = hospitals.find(h => h.id === id) || clinics.find(c => c.id === id);
  const main = document.getElementById('main-content');
  if (!hospital) {
    main.innerHTML = '<div class="container" style="padding:100px 0;text-align:center;"><h2>Hospital not found</h2></div>';
    return;
  }
  
  // Find doctors working here (loosely matching hospital name)
  const docs = doctors.filter(d => d.hospital && d.hospital.toLowerCase().includes(hospital.name.toLowerCase().split(' ')[0]));
  
  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px;"><i data-lucide="arrow-left" style="width:16px;"></i> Back</button>
        <div class="card" style="padding:var(--space-xl);margin-bottom:var(--space-2xl);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
            <div>
              <h1 style="font-size:var(--fs-2xl);margin-bottom:8px;">${hospital.name}</h1>
              <div style="color:var(--text-secondary);display:flex;align-items:center;gap:8px;">
                <i data-lucide="map-pin" style="width:16px;"></i> ${hospital.area}
                <span class="badge" style="margin-left:12px;">${hospital.type === 'government' ? 'GOVT' : 'PRIVATE'}</span>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:24px;font-weight:bold;color:var(--warning);">★ ${hospital.rating}</div>
              <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top:12px;">
                <a class="btn btn-secondary btn-sm" href="${getDirectionsUrl(hospital.lat, hospital.lng)}" target="_blank"><i data-lucide="navigation" style="width:16px;"></i> Directions</a>
                <button class="btn btn-primary btn-sm" onclick="location.hash='/book/${hospital.id}/hospital/hospital'"><i data-lucide="calendar" style="width:16px;"></i> Book Appointment</button>
              </div>
            </div>
          </div>
          <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
            <h3>Specialties</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
              ${(hospital.specialties || []).map(s => `<span class="filter-chip" style="pointer-events:none;background:var(--surface-active);">${s}</span>`).join('')}
            </div>
          </div>
        </div>
        
        <h2 style="font-size:var(--fs-xl);margin-bottom:var(--space-lg);">Doctors Available (${docs.length})</h2>
        ${docs.length === 0 ? '<p style="color:var(--text-secondary);">No doctors specifically mapped to this facility in our mock data.</p>' : ''}
        <div class="grid grid-3">
          ${docs.map(d => `
            <div class="card doctor-card hover-lift" onclick="location.hash='/doctor/${d.id}'" style="cursor:pointer;">
              <div style="display:flex;gap:16px;">
                <div class="doctor-avatar">${getInitials(d.name)}</div>
                <div>
                  <div class="doctor-name">${d.name}</div>
                  <div class="doctor-specialty">${d.specialty}</div>
                  <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${d.experience}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

function renderDoctorProfile(id) {
  const doc = doctors.find(d => d.id === id);
  const main = document.getElementById('main-content');
  if (!doc) return main.innerHTML = '<div class="container"><h2>Doctor not found</h2></div>';

  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px;"><i data-lucide="arrow-left" style="width:16px;"></i> Back</button>
        <div class="card" style="padding:var(--space-xl);">
          <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;">
            <div class="doctor-avatar" style="width:100px;height:100px;font-size:32px;">${getInitials(doc.name)}</div>
            <div style="flex:1;">
              <h1 style="font-size:var(--fs-2xl);margin-bottom:4px;">${doc.name}</h1>
              <div style="color:var(--text-secondary);font-size:var(--fs-lg);margin-bottom:12px;">${doc.specialty}</div>
              <div style="display:flex;gap:16px;flex-wrap:wrap;">
                <span class="badge" style="background:var(--surface-active);">${doc.hospital}</span>
                <span class="badge" style="background:var(--surface-active);">${doc.city}</span>
                <span class="badge" style="background:var(--surface-active);">${doc.experience}</span>
              </div>
            </div>
            <div style="text-align:right;">
              ${doc.verified ? `<div style="display:flex;align-items:center;gap:6px;color:#10B981;font-weight:600;justify-content:flex-end;margin-bottom:8px;"><i data-lucide="shield-check"></i> Verified Profile</div><div style="font-size:12px;color:var(--text-muted);">Reg: ${doc.registration}</div>` : ''}
              ${doc.isClinicDoctor ? `<div class="badge" style="margin-top:12px;background:#ECFDF5;color:#059669;">🏠 Home Visit Available</div>` : ''}
              <div style="margin-top:24px;">
                <button class="btn btn-primary btn-lg" onclick="location.hash='/book/${doc.id}/doctor/${doc.isClinicDoctor ? 'home-visit' : 'clinic-visit'}'">Book Appointment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

function renderNurseProfile(id) {
  const nurse = nurses.find(n => n.id === id);
  const main = document.getElementById('main-content');
  if (!nurse) return main.innerHTML = '<div class="container"><h2>Nurse not found</h2></div>';

  main.innerHTML = `
    <div class="discovery-page">
      <div class="container">
        <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px;"><i data-lucide="arrow-left" style="width:16px;"></i> Back</button>
        <div class="card" style="padding:var(--space-xl);">
          <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;">
            <div class="doctor-avatar" style="width:100px;height:100px;font-size:32px;background:rgba(236,72,153,0.15);color:#EC4899;">${getInitials(nurse.name)}</div>
            <div style="flex:1;">
              <h1 style="font-size:var(--fs-2xl);margin-bottom:4px;">${nurse.name}</h1>
              <div style="color:var(--text-secondary);font-size:var(--fs-lg);margin-bottom:12px;">${nurse.specialty} Nursing</div>
              <p style="color:var(--text-muted);line-height:1.6;margin-bottom:16px;">${nurse.bio}</p>
              <div style="display:flex;gap:16px;flex-wrap:wrap;">
                <span class="badge" style="background:var(--surface-active);">${nurse.hospital}</span>
                <span class="badge" style="background:var(--surface-active);">Exp: ${nurse.experience}</span>
                <span class="badge" style="background:rgba(245,158,11,0.15);color:#F59E0B;">★ ${nurse.rating}</span>
              </div>
            </div>
            <div style="text-align:right;">
              ${nurse.verified ? `<div style="display:flex;align-items:center;gap:6px;color:#10B981;font-weight:600;justify-content:flex-end;margin-bottom:8px;"><i data-lucide="shield-check"></i> Verified Nurse</div><div style="font-size:12px;color:var(--text-muted);">Reg: ${nurse.registration}</div>` : ''}
              <div style="margin-top:24px;">
                <button class="btn btn-primary btn-lg" onclick="location.hash='/book/${nurse.id}/nurse/nursing'">Request Nurse</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

// ===== PAGE: SERVICES =====
function renderServices() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="services-page">
      <div class="container">
        <div class="section-header">
          <h2>⚕️ Healthcare Services</h2>
          <p>Comprehensive healthcare services — right at your doorstep</p>
        </div>

        <!-- Additional Services -->
        <div class="services-grid" style="margin-bottom:var(--space-4xl);">
          ${additionalServices.map(s => `
            <div class="card service-card hover-lift reveal">
              <div class="service-icon"><i data-lucide="${s.icon}"></i></div>
              <h3>${s.name}</h3>
              <p>${s.description}</p>
              <ul style="text-align:left;margin-top:16px;font-size:13px;color:var(--text-secondary);">
                ${s.features.map(f => `<li style="margin-bottom:4px;">✓ ${f}</li>`).join('')}
              </ul>
              <button class="btn btn-primary btn-sm" style="margin-top:16px;">Book Now</button>
            </div>
          `).join('')}
        </div>

        <!-- Care Programmes -->
        <div class="section-header reveal">
          <h2>Care Programmes</h2>
          <p>Specialized long-term care for those who need it most</p>
        </div>
        <div class="grid grid-3 reveal" style="margin-bottom:var(--space-4xl);">
          ${careProgrammes.map(p => `
            <div class="card hover-lift" style="border-top:3px solid ${p.color};">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                <div style="width:48px;height:48px;border-radius:12px;background:${p.color}20;color:${p.color};display:flex;align-items:center;justify-content:center;"><i data-lucide="${p.icon}" style="width:24px;height:24px;"></i></div>
                <h3 style="font-size:var(--fs-lg);">${p.name}</h3>
              </div>
              <p style="color:var(--text-secondary);font-size:var(--fs-sm);">${p.description}</p>
            </div>
          `).join('')}
        </div>

        <!-- Target Users -->
        <div class="section-header reveal">
          <h2>Who We Serve</h2>
          <p>Healthcare designed for everyone who needs it</p>
        </div>
        <div class="target-users-grid reveal">
          ${targetUsers.map(u => `
            <div class="target-user-card">
              <div class="target-user-icon"><i data-lucide="${u.icon}" style="width:22px;height:22px;"></i></div>
              <div>
                <div style="font-weight:600;margin-bottom:2px;">${u.name}</div>
                <div style="font-size:13px;color:var(--text-secondary);">${u.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
  setTimeout(initScrollReveal, 100);
}

// ===== PAGE: LOGIN =====
function renderLogin() {
  const main = document.getElementById('main-content');
  import('./utils/db.js').then(({ loginApi, register, getCurrentUser }) => {
    
    const user = getCurrentUser();
    if (user) {
      const dashRoute = user.role === 'patient' ? '/patient-dashboard' : user.role === 'nurse' ? '/nurse-dashboard' : '/doctor-dashboard';
      location.hash = dashRoute;
      return;
    }

    window.handleAuthForm = async (e, type) => {
      e.preventDefault();
      try {
        if (type === 'login') {
          const email = document.getElementById('login-email').value;
          const password = document.getElementById('login-password').value;
          const user = await loginApi(email, password);
          if (user) {
            const dashRoute = user.role === 'patient' ? '/patient-dashboard' : user.role === 'nurse' ? '/nurse-dashboard' : '/doctor-dashboard';
            window.location.href = '#' + dashRoute;
            window.location.reload();
          }
        } else {
          const role = document.getElementById('reg-role').value;
          const formData = new FormData();
          formData.append('role', role);
          formData.append('email', document.getElementById('reg-email').value);
          formData.append('password', document.getElementById('reg-password').value);
          formData.append('name', document.getElementById('reg-name').value);
          
          if (document.getElementById('reg-phone')) formData.append('phone', document.getElementById('reg-phone').value);
          if (document.getElementById('reg-specialty')) formData.append('specialty', document.getElementById('reg-specialty').value);
          if (document.getElementById('reg-hospital')) formData.append('hospital', document.getElementById('reg-hospital').value);
          if (document.getElementById('reg-experience')) formData.append('experience', document.getElementById('reg-experience').value);
          
          const fileInput = document.getElementById('reg-document');
          if (fileInput && fileInput.files.length > 0) {
            formData.append('document', fileInput.files[0]);
          }

          const user = await register(formData);
          if (user) {
             const dashRoute = user.role === 'patient' ? '/patient-dashboard' : user.role === 'nurse' ? '/nurse-dashboard' : '/doctor-dashboard';
             window.location.href = '#' + dashRoute;
             window.location.reload();
          }
        }
      } catch (err) {
        alert(err.message);
      }
    };

    window.toggleAuthTab = (tab) => {
      document.getElementById('login-form-container').style.display = tab === 'login' ? 'block' : 'none';
      document.getElementById('register-form-container').style.display = tab === 'register' ? 'block' : 'none';
    };

    window.updateRegFields = () => {
      const role = document.getElementById('reg-role').value;
      let fields = '';
      if (role === 'patient') {
        fields = `<input type="tel" id="reg-phone" placeholder="Phone Number" class="form-control" required />`;
      } else if (role === 'doctor' || role === 'physio') {
        fields = `
          <input type="text" id="reg-specialty" placeholder="Specialty" class="form-control" required />
          <input type="text" id="reg-hospital" placeholder="Hospital/Clinic" class="form-control" required />
        `;
      } else if (role === 'nurse') {
        fields = `
          <input type="text" id="reg-specialty" placeholder="Specialty (e.g. Registered Nurse)" class="form-control" required />
          <input type="text" id="reg-experience" placeholder="Experience (e.g. 5 Years)" class="form-control" required />
        `;
      }
      
      // Document upload field
      let docLabel = role === 'patient' ? 'Upload Medical History (Optional)' : 'Upload Verification Document (Required)';
      let isRequired = role !== 'patient' ? 'required' : '';
      fields += `
        <div style="text-align:left; margin-top: 8px;">
          <label style="display:block; margin-bottom:4px; font-weight:500; font-size:14px; color:var(--text-secondary);">${docLabel}</label>
          <input type="file" id="reg-document" accept=".pdf,image/png,image/jpeg" class="form-control" ${isRequired} />
        </div>
      `;
      
      document.getElementById('reg-dynamic-fields').innerHTML = fields;
    };

    main.innerHTML = `
      <div class="container" style="max-width: 500px; padding-top: var(--space-4xl); padding-bottom: var(--space-4xl);">
        <div class="card" style="text-align: center;">
          <h2 style="margin-bottom: var(--space-md);">Welcome to JeevanCare+</h2>
          
          <div style="display:flex; justify-content:center; gap:16px; margin-bottom:24px;">
            <button class="btn btn-secondary" onclick="window.toggleAuthTab('login')">Login</button>
            <button class="btn btn-secondary" onclick="window.toggleAuthTab('register')">Register</button>
          </div>
          
          <!-- LOGIN FORM -->
          <div id="login-form-container">
            <form onsubmit="window.handleAuthForm(event, 'login')" style="display:flex; flex-direction:column; gap:16px; text-align:left;">
              <input type="email" id="login-email" placeholder="Email Address" class="form-control" required />
              <input type="password" id="login-password" placeholder="Password" class="form-control" required />
              <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Login</button>
            </form>
          </div>

          <!-- REGISTER FORM -->
          <div id="register-form-container" style="display:none;">
            <form onsubmit="window.handleAuthForm(event, 'register')" style="display:flex; flex-direction:column; gap:16px; text-align:left;">
              <select id="reg-role" class="form-control" onchange="window.updateRegFields()" required>
                <option value="patient">Patient</option>
                <option value="doctor">Clinic Doctor</option>
                <option value="physio">Physiotherapist</option>
                <option value="nurse">Nurse</option>
              </select>
              <input type="text" id="reg-name" placeholder="Full Name" class="form-control" required />
              <input type="email" id="reg-email" placeholder="Email Address" class="form-control" required />
              <input type="password" id="reg-password" placeholder="Password" class="form-control" required />
              <div id="reg-dynamic-fields" style="display:flex; flex-direction:column; gap:16px;">
                <input type="tel" id="reg-phone" placeholder="Phone Number" class="form-control" required />
                <div style="text-align:left; margin-top: 8px;">
                  <label style="display:block; margin-bottom:4px; font-weight:500; font-size:14px; color:var(--text-secondary);">Upload Medical History (Optional)</label>
                  <input type="file" id="reg-document" accept=".pdf,image/png,image/jpeg" class="form-control" />
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Register</button>
            </form>
          </div>
          
        </div>
      </div>
      <style>
        .form-control { width: 100%; padding: 12px; border-radius: var(--radius-md); background: var(--bg-primary); border: 1px solid var(--border); }
      </style>
    `;
    if (window.lucide) lucide.createIcons();
  });
}

// ===== DASHBOARDS =====
function renderPatientDashboard() {
  const main = document.getElementById('main-content');
  import('./utils/db.js').then(async ({ getAppointmentsForUser, getCurrentUser }) => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'patient') { location.hash = '/login'; return; }
    
    try {
      const appointments = await getAppointmentsForUser(currentUser.id, 'patient');
      
      main.innerHTML = `
        <div class="container" style="padding-top: var(--space-2xl); padding-bottom: var(--space-4xl);">
          <h1 style="margin-bottom: var(--space-xl);">My Appointments</h1>
          ${appointments.length === 0 ? '<p style="color:var(--text-secondary);">No appointments booked yet.</p>' : `
            <div style="display: flex; flex-direction: column; gap: var(--space-md);">
              ${appointments.map(a => `
                <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                  <div>
                    <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                      <span class="badge" style="background:var(--surface-active);">${a.type.toUpperCase()}</span>
                      <span style="font-weight:600; color:${(a.status === 'new' || a.status === 'pending') ? 'var(--info)' : a.status === 'accepted' ? 'var(--warning)' : a.status === 'completed' ? 'var(--success)' : 'var(--danger)'}; text-transform:uppercase; font-size:12px;">${a.status}</span>
                    </div>
                    <h3 style="margin-bottom:4px;">${a.providerName}</h3>
                    <div style="color:var(--text-secondary); font-size:14px;">📅 ${a.date} at ${a.time}</div>
                  </div>
                  <div>
                    ${a.status === 'accepted' ? `<a href="tel:0000000000" class="btn btn-secondary btn-sm"><i data-lucide="phone" style="width:14px;height:14px;"></i> Contact Provider</a>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          `}

          <h2 style="margin-top: var(--space-2xl); margin-bottom: var(--space-xl);">Available Doctors</h2>
          <div class="grid grid-3">
            ${(window.doctors || []).length === 0 ? '<p style="color:var(--text-secondary); grid-column:1/-1;">No doctors currently available.</p>' : 
              (window.doctors || []).slice(0, 6).map(doc => `
                <div class="card hover-lift" onclick="location.hash='/doctor/${doc.id}'" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; text-align:center;">
                  <div style="width:64px; height:64px; border-radius:50%; background:var(--surface-active); display:flex; align-items:center; justify-content:center; margin-bottom:12px;">
                    <i data-lucide="user" style="width:32px; height:32px; color:var(--primary);"></i>
                  </div>
                  <h3 style="margin-bottom:4px; font-size:16px;">${doc.name}</h3>
                  <div style="color:var(--text-secondary); font-size:14px; margin-bottom:8px;">${doc.specialty}</div>
                  <div class="badge badge-private" style="font-size:12px;">${doc.hospital}</div>
                </div>
              `).join('')}
          </div>
          ${(window.doctors || []).length > 6 ? `<div style="text-align:center; margin-top:16px;"><button class="btn btn-secondary" onclick="location.hash='/doctors'">View All Doctors</button></div>` : ''}

        </div>
      `;
      if (window.lucide) lucide.createIcons();
    } catch (err) {
      main.innerHTML = `<div class="container" style="padding:40px;"><p style="color:var(--danger);">${err.message}</p></div>`;
    }
  });
}

function renderDoctorDashboard() {
  const main = document.getElementById('main-content');
  import('./utils/db.js').then(async ({ getAppointmentsForUser, updateAppointmentStatus, getCurrentUser }) => {
    const currentUser = getCurrentUser();
    if (!currentUser || (currentUser.role !== 'doctor' && currentUser.role !== 'physio')) { location.hash = '/login'; return; }
    
    window.handleStatusUpdate = async (aptId, status) => {
      await updateAppointmentStatus(aptId, status);
      renderDoctorDashboard();
    };

    try {
      const appointments = await getAppointmentsForUser(currentUser.id, currentUser.role);
      const newApts = appointments.filter(a => a.status === 'new');
      const todayApts = appointments.filter(a => a.status === 'accepted');
      const historyApts = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
      
      main.innerHTML = `
        <div class="container" style="padding-top: var(--space-2xl); padding-bottom: var(--space-4xl);">
          <h1 style="margin-bottom: var(--space-xl);">Doctor Dashboard: ${currentUser.name}</h1>
          
          <div class="grid grid-3" style="margin-bottom: var(--space-xl);">
            <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--border);">
              <div class="stat-number" style="color:var(--info);">${newApts.length}</div>
              <div class="stat-label">New Requests</div>
            </div>
            <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--border);">
              <div class="stat-number" style="color:var(--warning);">${todayApts.length}</div>
              <div class="stat-label">Accepted / Upcoming</div>
            </div>
            <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--border);">
              <div class="stat-number" style="color:var(--success);">${historyApts.length}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>

          <h2>Appointment Inbox (New)</h2>
          ${newApts.length === 0 ? '<p style="color:var(--text-secondary); margin-bottom:var(--space-lg);">No new requests.</p>' : `
            <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:var(--space-2xl); margin-top:16px;">
              ${newApts.map(a => `
                <div class="card" style="border-left: 4px solid var(--info);">
                  <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                    <div>
                      <h3 style="margin-bottom:4px;">${a.patientName}</h3>
                      <div style="color:var(--text-secondary); font-size:14px; margin-bottom:8px;">📅 ${a.date} at ${a.time} • ${a.type.toUpperCase()}</div>
                      <div style="font-size:14px;"><strong>Address:</strong> ${a.address}</div>
                      <div style="font-size:14px; margin-top:4px;"><strong>Notes:</strong> ${a.notes || 'None'}</div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <button class="btn btn-secondary btn-sm" onclick="window.handleStatusUpdate('${a.id}', 'cancelled')">Decline</button>
                      <button class="btn btn-primary btn-sm" onclick="window.handleStatusUpdate('${a.id}', 'accepted')">Accept</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}

          <h2>Today's Schedule (Accepted)</h2>
          ${todayApts.length === 0 ? '<p style="color:var(--text-secondary); margin-bottom:var(--space-lg);">No accepted appointments yet.</p>' : `
            <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:var(--space-2xl); margin-top:16px;">
              ${todayApts.map(a => `
                <div class="card" style="border-left: 4px solid var(--warning);">
                  <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                    <div>
                      <h3 style="margin-bottom:4px;">${a.patientName}</h3>
                      <div style="color:var(--text-secondary); font-size:14px; margin-bottom:8px;">📅 ${a.date} at ${a.time}</div>
                      <div style="font-size:14px;"><strong>Address:</strong> ${a.address}</div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <a href="tel:${a.patientPhone}" class="btn btn-secondary btn-sm"><i data-lucide="phone" style="width:14px;height:14px;"></i> Call</a>
                      <button class="btn btn-primary btn-sm" onclick="window.handleStatusUpdate('${a.id}', 'completed')"><i data-lucide="check-circle" style="width:14px;height:14px;"></i> Mark Completed</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    } catch (err) {
      main.innerHTML = `<div class="container" style="padding:40px;"><p style="color:var(--danger);">${err.message}</p></div>`;
    }
  });
}

function renderNurseDashboard() {
  const main = document.getElementById('main-content');
  import('./utils/db.js').then(async ({ getAppointmentsForUser, updateAppointmentStatus, getCurrentUser }) => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'nurse') { location.hash = '/login'; return; }
    
    window.handleStatusUpdate = async (aptId, status) => {
      await updateAppointmentStatus(aptId, status);
      renderNurseDashboard();
    };

    try {
      const appointments = await getAppointmentsForUser(currentUser.id, 'nurse');
      const newApts = appointments.filter(a => a.status === 'new');
      const activeApts = appointments.filter(a => a.status === 'accepted');
      const historyApts = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
      
      main.innerHTML = `
        <div class="container" style="padding-top: var(--space-2xl); padding-bottom: var(--space-4xl);">
          <h1 style="margin-bottom: var(--space-xl);">Nurse Dashboard: ${currentUser.name}</h1>
          
          <div class="grid grid-3" style="margin-bottom: var(--space-xl);">
            <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--border);">
              <div class="stat-number" style="color:var(--info);">${newApts.length}</div>
              <div class="stat-label">New Requests</div>
            </div>
            <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--border);">
              <div class="stat-number" style="color:var(--warning);">${activeApts.length}</div>
              <div class="stat-label">Active Bookings</div>
            </div>
            <div class="stat-card" style="background:var(--bg-card); border:1px solid var(--border);">
              <div class="stat-number" style="color:var(--success);">${historyApts.length}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>

          <h2>Booking Inbox (New)</h2>
          ${newApts.length === 0 ? '<p style="color:var(--text-secondary); margin-bottom:var(--space-lg);">No new requests.</p>' : `
            <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:var(--space-2xl); margin-top:16px;">
              ${newApts.map(a => `
                <div class="card" style="border-left: 4px solid var(--info);">
                  <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                    <div>
                      <h3 style="margin-bottom:4px;">${a.patientName}</h3>
                      <div style="color:var(--text-secondary); font-size:14px; margin-bottom:8px;">📅 ${a.date} at ${a.time} • NURSING</div>
                      <div style="font-size:14px;"><strong>Address:</strong> ${a.address}</div>
                      <div style="font-size:14px; margin-top:4px;"><strong>Care Notes:</strong> ${a.notes || 'None'}</div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <button class="btn btn-secondary btn-sm" onclick="window.handleStatusUpdate('${a.id}', 'cancelled')">Decline</button>
                      <button class="btn btn-primary btn-sm" onclick="window.handleStatusUpdate('${a.id}', 'accepted')">Accept</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}

          <h2>Active Bookings</h2>
          ${activeApts.length === 0 ? '<p style="color:var(--text-secondary); margin-bottom:var(--space-lg);">No active bookings yet.</p>' : `
            <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:var(--space-2xl); margin-top:16px;">
              ${activeApts.map(a => `
                <div class="card" style="border-left: 4px solid var(--warning);">
                  <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                    <div>
                      <h3 style="margin-bottom:4px;">${a.patientName}</h3>
                      <div style="color:var(--text-secondary); font-size:14px; margin-bottom:8px;">📅 ${a.date} at ${a.time}</div>
                      <div style="font-size:14px;"><strong>Address:</strong> ${a.address}</div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <a href="tel:${a.patientPhone}" class="btn btn-secondary btn-sm"><i data-lucide="phone" style="width:14px;height:14px;"></i> Call</a>
                      <button class="btn btn-primary btn-sm" onclick="window.handleStatusUpdate('${a.id}', 'completed')"><i data-lucide="check-circle" style="width:14px;height:14px;"></i> Mark Completed</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    } catch (err) {
      main.innerHTML = `<div class="container" style="padding:40px;"><p style="color:var(--danger);">${err.message}</p></div>`;
    }
  });
}

// ===== REGISTER ROUTES =====
router.addRoute('/book', renderBookingPage);
router.addRoute('/hospital', renderHospitalProfile);
router.addRoute('/doctor', renderDoctorProfile);
router.addRoute('/nurse', renderNurseProfile);
router.addRoute('/', renderHome);
router.addRoute('/hospitals', renderHospitals);
router.addRoute('/doctors', renderDoctors);
router.addRoute('/clinics', renderClinics);
router.addRoute('/home-visit', renderHomeVisitDoctors);
router.addRoute('/nursing', renderNursing);
router.addRoute('/services', renderServices);
router.addRoute('/login', renderLogin);
router.addRoute('/patient-dashboard', renderPatientDashboard);
router.addRoute('/doctor-dashboard', renderDoctorDashboard);
router.addRoute('/nurse-dashboard', renderNurseDashboard);

// ===== INITIALIZE =====
function initializeApp() {
  renderNavbar();
  renderFooter();
  router.init();

  // Hide loading screen
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 500);
    }
  }, 500); // reduced timeout to make it feel faster

  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
