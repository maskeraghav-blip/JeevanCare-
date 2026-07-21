const fs = require('fs');

let mainJs = fs.readFileSync('c:/JeevanCare+/src/main.js', 'utf8');

// 1. Add nurses import at the top
if (!mainJs.includes("import { nurses }")) {
  mainJs = mainJs.replace("import { services, additionalServices, careProgrammes, targetUsers } from './data/services.js';", "import { services, additionalServices, careProgrammes, targetUsers } from './data/services.js';\nimport { nurses } from './data/nurses.js';");
}

// 2. Remove Emergency Links
mainJs = mainJs.replace(/<a class="nav-link emergency-link".*?>🚨 Emergency<\/a>\s*/g, '');
mainJs = mainJs.replace(/<button class="btn btn-danger btn-lg" onclick="location\.hash='\/emergency'">[\s\S]*?<\/button>\s*/g, '');

// 3. Update Hospitals to point to profile
mainJs = mainJs.replace(
  /<a class="btn btn-primary btn-sm" href="\${getDirectionsUrl\(h\.lat, h\.lng\)}" target="_blank" style="margin-top:12px;">\s*<i data-lucide="navigation" style="width:14px;height:14px;"><\/i> Navigate\s*<\/a>/g,
  `<button class="btn btn-secondary btn-sm" onclick="location.hash='/hospital/\${h.id}'" style="margin-top:12px;width:100%;">View Details</button>`
);

mainJs = mainJs.replace(
  /grid\.innerHTML = filteredHospitals\.map\(h => \`\s*<div class="card hospital-card hover-lift">/g,
  `grid.innerHTML = filteredHospitals.map(h => \`
      <div class="card hospital-card hover-lift" onclick="location.hash='/hospital/\${h.id}'" style="cursor:pointer;">`
);

// Clinics view details link
mainJs = mainJs.replace(
  /\${c\.area !== 'Multiple Locations' \? \`<a href="\${getDirectionsUrl\(c\.lat, c\.lng\)}".*?<\/a>\` : ''}/g,
  `\${c.area !== 'Multiple Locations' ? \`<button class="btn btn-secondary btn-sm" onclick="location.hash='/hospital/\${c.id}'" style="margin-top:8px;font-size:12px;">View Details</button>\` : ''}`
);


// 4. Update Doctors to point to profile
mainJs = mainJs.replace(
  /<button class="btn btn-primary btn-sm" onclick="alert\('Booking appointment with \${d\.name}\.\.\.'\)">Book Appointment<\/button>/g,
  `<button class="btn btn-primary btn-sm" onclick="location.hash='/doctor/\${d.id}'">View Profile</button>`
);


// 5. Update Home Visit Doctors constraint and link
mainJs = mainJs.replace(
  /const homeVisitDocs = doctors\.filter\(d => \['General Medicine', 'Pediatrics', 'Physiotherapy', 'General Surgery'\]\.includes\(d\.specialty\)\);/g,
  "const homeVisitDocs = doctors.filter(d => d.isClinicDoctor === true);"
);
mainJs = mainJs.replace(
  /<button class="btn btn-primary btn-sm" onclick="alert\('Booking home visit with \${d\.name}\.\.\.'\)">Book Home Visit<\/button>/g,
  `<button class="btn btn-primary btn-sm" onclick="location.hash='/doctor/\${d.id}'">View Profile & Book</button>`
);

// 6. Update Nursing List
const newNursingFunc = `
function renderNursing() {
  const main = document.getElementById('main-content');
  main.innerHTML = \`
    <div class="discovery-page">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2 style="font-size:var(--fs-2xl);">🩺 Nursing Care</h2>
          <p>Professional nursing services at your home for post-surgery recovery, elderly care, and more.</p>
        </div>
        <div class="grid grid-3">
          \${nurses.map(n => \`
            <div class="card hover-lift" style="display:flex;flex-direction:column;gap:12px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <h3 style="font-size:16px;">\${n.name}</h3>
                  <div style="font-size:13px;color:var(--text-secondary);">\${n.specialty} • \${n.experience}</div>
                </div>
                <div style="background:rgba(16, 185, 129, 0.15);color:#10B981;padding:4px 8px;border-radius:4px;font-size:12px;display:flex;align-items:center;gap:4px;">
                  \${n.verified ? '<i data-lucide="check-circle" style="width:14px;height:14px;"></i> Verified' : ''}
                </div>
              </div>
              <p style="font-size:14px;color:var(--text-secondary);flex:1;">\${n.bio}</p>
              <button class="btn btn-secondary btn-sm" onclick="location.hash='/nurse/\${n.id}'" style="width:100%;">View Profile</button>
            </div>
          \`).join('')}
        </div>
      </div>
    </div>
  \`;
  if (window.lucide) lucide.createIcons();
}
`;
mainJs = mainJs.replace(/function renderNursing\(\) \{[\s\S]*?\}\n/m, newNursingFunc);


// 7. Add Profile Views (Hospital, Doctor, Nurse) before // ===== PAGE: SERVICES =====
const profiles = `
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
  
  main.innerHTML = \`
    <div class="discovery-page">
      <div class="container">
        <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px;"><i data-lucide="arrow-left" style="width:16px;"></i> Back</button>
        <div class="card" style="padding:var(--space-xl);margin-bottom:var(--space-2xl);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
            <div>
              <h1 style="font-size:var(--fs-2xl);margin-bottom:8px;">\${hospital.name}</h1>
              <div style="color:var(--text-secondary);display:flex;align-items:center;gap:8px;">
                <i data-lucide="map-pin" style="width:16px;"></i> \${hospital.area}
                <span class="badge" style="margin-left:12px;">\${hospital.type === 'government' ? 'GOVT' : 'PRIVATE'}</span>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:24px;font-weight:bold;color:var(--warning);">★ \${hospital.rating}</div>
              <a class="btn btn-primary btn-sm" href="\${getDirectionsUrl(hospital.lat, hospital.lng)}" target="_blank" style="margin-top:12px;"><i data-lucide="navigation" style="width:16px;"></i> Get Directions</a>
            </div>
          </div>
          <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
            <h3>Specialties</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
              \${(hospital.specialties || []).map(s => \`<span class="filter-chip" style="pointer-events:none;background:var(--surface-active);">\${s}</span>\`).join('')}
            </div>
          </div>
        </div>
        
        <h2 style="font-size:var(--fs-xl);margin-bottom:var(--space-lg);">Doctors Available (\${docs.length})</h2>
        \${docs.length === 0 ? '<p style="color:var(--text-secondary);">No doctors specifically mapped to this facility in our mock data.</p>' : ''}
        <div class="grid grid-3">
          \${docs.map(d => \`
            <div class="card doctor-card hover-lift" onclick="location.hash='/doctor/\${d.id}'" style="cursor:pointer;">
              <div style="display:flex;gap:16px;">
                <div class="doctor-avatar">\${getInitials(d.name)}</div>
                <div>
                  <div class="doctor-name">\${d.name}</div>
                  <div class="doctor-specialty">\${d.specialty}</div>
                  <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">\${d.experience}</div>
                </div>
              </div>
            </div>
          \`).join('')}
        </div>
      </div>
    </div>
  \`;
  if (window.lucide) lucide.createIcons();
}

function renderDoctorProfile(id) {
  const doc = doctors.find(d => d.id === id);
  const main = document.getElementById('main-content');
  if (!doc) return main.innerHTML = '<div class="container"><h2>Doctor not found</h2></div>';

  main.innerHTML = \`
    <div class="discovery-page">
      <div class="container">
        <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px;"><i data-lucide="arrow-left" style="width:16px;"></i> Back</button>
        <div class="card" style="padding:var(--space-xl);">
          <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;">
            <div class="doctor-avatar" style="width:100px;height:100px;font-size:32px;">\${getInitials(doc.name)}</div>
            <div style="flex:1;">
              <h1 style="font-size:var(--fs-2xl);margin-bottom:4px;">\${doc.name}</h1>
              <div style="color:var(--text-secondary);font-size:var(--fs-lg);margin-bottom:12px;">\${doc.specialty}</div>
              <div style="display:flex;gap:16px;flex-wrap:wrap;">
                <span class="badge" style="background:var(--surface-active);">\${doc.hospital}</span>
                <span class="badge" style="background:var(--surface-active);">\${doc.city}</span>
                <span class="badge" style="background:var(--surface-active);">\${doc.experience}</span>
              </div>
            </div>
            <div style="text-align:right;">
              \${doc.verified ? \`<div style="display:flex;align-items:center;gap:6px;color:#10B981;font-weight:600;justify-content:flex-end;margin-bottom:8px;"><i data-lucide="shield-check"></i> Verified Profile</div><div style="font-size:12px;color:var(--text-muted);">Reg: \${doc.registration}</div>\` : ''}
              \${doc.isClinicDoctor ? \`<div class="badge" style="margin-top:12px;background:#ECFDF5;color:#059669;">🏠 Home Visit Available</div>\` : ''}
              <div style="margin-top:24px;">
                <button class="btn btn-primary btn-lg" onclick="alert('Booking feature coming soon.')">Book Appointment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  \`;
  if (window.lucide) lucide.createIcons();
}

function renderNurseProfile(id) {
  const nurse = nurses.find(n => n.id === id);
  const main = document.getElementById('main-content');
  if (!nurse) return main.innerHTML = '<div class="container"><h2>Nurse not found</h2></div>';

  main.innerHTML = \`
    <div class="discovery-page">
      <div class="container">
        <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px;"><i data-lucide="arrow-left" style="width:16px;"></i> Back</button>
        <div class="card" style="padding:var(--space-xl);">
          <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;">
            <div class="doctor-avatar" style="width:100px;height:100px;font-size:32px;background:rgba(236,72,153,0.15);color:#EC4899;">\${getInitials(nurse.name)}</div>
            <div style="flex:1;">
              <h1 style="font-size:var(--fs-2xl);margin-bottom:4px;">\${nurse.name}</h1>
              <div style="color:var(--text-secondary);font-size:var(--fs-lg);margin-bottom:12px;">\${nurse.specialty} Nursing</div>
              <p style="color:var(--text-muted);line-height:1.6;margin-bottom:16px;">\${nurse.bio}</p>
              <div style="display:flex;gap:16px;flex-wrap:wrap;">
                <span class="badge" style="background:var(--surface-active);">\${nurse.hospital}</span>
                <span class="badge" style="background:var(--surface-active);">Exp: \${nurse.experience}</span>
                <span class="badge" style="background:rgba(245,158,11,0.15);color:#F59E0B;">★ \${nurse.rating}</span>
              </div>
            </div>
            <div style="text-align:right;">
              \${nurse.verified ? \`<div style="display:flex;align-items:center;gap:6px;color:#10B981;font-weight:600;justify-content:flex-end;margin-bottom:8px;"><i data-lucide="shield-check"></i> Verified Nurse</div><div style="font-size:12px;color:var(--text-muted);">Reg: \${nurse.registration}</div>\` : ''}
              <div style="margin-top:24px;">
                <button class="btn btn-primary btn-lg" onclick="alert('Booking nurse home visit coming soon.')">Request Nurse</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  \`;
  if (window.lucide) lucide.createIcons();
}
`;

mainJs = mainJs.replace(/\/\/ ===== PAGE: SERVICES =====/, profiles + "\n// ===== PAGE: SERVICES =====");

// 8. Remove Emergency Function and Routes
mainJs = mainJs.replace(/\/\/ ===== PAGE: EMERGENCY =====[\s\S]*?(?=\/\/ ===== REGISTER ROUTES =====)/, "");
mainJs = mainJs.replace(/router\.addRoute\('\/emergency', renderEmergency\);\n/, "");

// Add profile routes
mainJs = mainJs.replace(
  "// ===== REGISTER ROUTES =====",
  "// ===== REGISTER ROUTES =====\nrouter.addRoute('/hospital', renderHospitalProfile);\nrouter.addRoute('/doctor', renderDoctorProfile);\nrouter.addRoute('/nurse', renderNurseProfile);"
);

fs.writeFileSync('c:/JeevanCare+/src/main.js', mainJs);
console.log('main.js updated with profiles, constrained home visits, removed emergency, and linked nursing data.');
