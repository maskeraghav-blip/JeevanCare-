import { useState, useEffect } from 'react';
import { api, useAuth } from '../context/AuthContext';
import { formatDate, formatStatus, STATUS_COLORS } from '../utils/constants';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [hospitalAppointments, setHospitalAppointments] = useState([]);
  const [physioAppointments, setPhysioAppointments] = useState([]);
  const [nurseBookings, setNurseBookings] = useState([]);
  const [consents, setConsents] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [activeTab, setActiveTab] = useState('appointments');
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const [appRes, hospRes, physioRes, nurseRes, consentRes, ticketRes] = await Promise.all([
        api.get('/clinic-doctors/appointments'),
        api.get('/hospitals/appointments/history'),
        api.get('/physio/appointments'),
        api.get('/nurses/bookings'),
        api.get('/consent'),
        api.get('/complaints'),
      ]);

      setAppointments(appRes.data.appointments);
      setHospitalAppointments(hospRes.data.appointments);
      setPhysioAppointments(physioRes.data.appointments);
      setNurseBookings(nurseRes.data.bookings);
      setConsents(consentRes.data.consents);
      setTickets(ticketRes.data.complaints);
    } catch (err) {
      console.error('Error fetching profile history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess(false);
    setUpdating(true);

    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
        address: editAddress
      });
      setEditSuccess(true);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <h1>Patient Dashboard</h1>
        <p>Manage appointments, nursing care request logs, and signed consent records</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)' }}>
        {/* Profile Card / Editor */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--color-primary-50)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: 'var(--space-3)'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{user.name}</h3>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                📍 {user.city}, {user.state}
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate}>
                {editError && <div className="form-error" style={{ marginBottom: 'var(--space-3)' }}>⚠️ {editError}</div>}
                
                <div className="form-group">
                  <label className="form-label" htmlFor="editName">Full Name</label>
                  <input
                    type="text"
                    id="editName"
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="editPhone">Phone</label>
                  <input
                    type="tel"
                    id="editPhone"
                    className="form-input"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label className="form-label" htmlFor="editAddress">Address</label>
                  <textarea
                    id="editAddress"
                    className="form-input"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    style={{ minHeight: '60px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }} disabled={updating}>
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-4)' }}>
                {editSuccess && (
                  <div style={{ color: 'var(--color-accent-green)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                    ✓ Profile updated successfully
                  </div>
                )}
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>EMAIL</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{user.email}</span>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>PHONE</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{user.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>DEFAULT ADDRESS</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {user.address || 'Not provided'}
                  </span>
                </div>

                <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={() => setIsEditing(true)}>
                  ⚙️ Edit Profile Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Activity History */}
        <div>
          <div className="tabs">
            <button className={`tab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
              🩺 Home Doctor Visits ({appointments.length + physioAppointments.length})
            </button>
            <button className={`tab ${activeTab === 'hospitals' ? 'active' : ''}`} onClick={() => setActiveTab('hospitals')}>
              🏥 Hospital Appointments ({hospitalAppointments.length})
            </button>
            <button className={`tab ${activeTab === 'nurses' ? 'active' : ''}`} onClick={() => setActiveTab('nurses')}>
              🩹 Nurse Bookings ({nurseBookings.length})
            </button>
            <button className={`tab ${activeTab === 'consents' ? 'active' : ''}`} onClick={() => setActiveTab('consents')}>
              📋 Digital Consents ({consents.length})
            </button>
            <button className={`tab ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
              🎫 Support History ({tickets.length})
            </button>
          </div>

          <div style={{ minHeight: '300px' }}>
            {loadingHistory ? (
              <div className="loading-spinner"></div>
            ) : activeTab === 'appointments' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {appointments.length === 0 && physioAppointments.length === 0 ? (
                  <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>You have no booked clinic doctor or physiotherapy visits.</p>
                  </div>
                ) : (
                  <>
                    {appointments.map((a) => (
                      <div key={`c-${a.id}`} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span className="badge badge-primary" style={{ marginBottom: 'var(--space-2)' }}>Clinic Doctor Visit</span>
                          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{a.doctor_name}</h3>
                          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            📅 {formatDate(a.appointment_date)} · ⏰ {a.time_slot}
                          </p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                            📍 {a.patient_address}
                          </p>
                        </div>
                        <span className={`badge ${STATUS_COLORS[a.status] || 'badge-pending'}`}>
                          {formatStatus(a.status)}
                        </span>
                      </div>
                    ))}

                    {physioAppointments.map((p) => (
                      <div key={`p-${p.id}`} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span className="badge badge-primary" style={{ marginBottom: 'var(--space-2)', background: '#F1F5F9', color: '#475569' }}>
                            Physiotherapy Session
                          </span>
                          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{p.doctor_name}</h3>
                          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            📅 {formatDate(p.appointment_date)} · ⏰ {p.time_slot}
                          </p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                            📍 {p.patient_address}
                          </p>
                        </div>
                        <span className={`badge ${STATUS_COLORS[p.status] || 'badge-pending'}`}>
                          {formatStatus(p.status)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : activeTab === 'hospitals' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {hospitalAppointments.length === 0 ? (
                  <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>You have no booked hospital outpatient appointments.</p>
                  </div>
                ) : (
                  hospitalAppointments.map((ha) => (
                    <div key={ha.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="badge badge-primary" style={{ marginBottom: 'var(--space-2)', background: 'var(--color-primary-light)', color: 'white' }}>
                          Hospital Appointment
                        </span>
                        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{ha.hospital_name}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          Doctor: {ha.doctor_name || 'General Consult'} · Specialty: {ha.specialization || 'Outpatient'}
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          📅 {formatDate(ha.appointment_date)} · ⏰ {ha.time_slot}
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                          Patient: {ha.patient_name} · Contact: {ha.patient_phone}
                        </p>
                      </div>
                      <span className={`badge ${STATUS_COLORS[ha.status] || 'badge-pending'}`}>
                        {formatStatus(ha.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'nurses' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {nurseBookings.length === 0 ? (
                  <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>You have no registered nurse hiring bookings.</p>
                  </div>
                ) : (
                  nurseBookings.map((b) => (
                    <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="badge badge-primary" style={{ marginBottom: 'var(--space-2)', background: 'var(--color-accent-blue-light)', color: '#1E40AF' }}>
                          Nurse Booking
                        </span>
                        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{b.nurse_name}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          📅 Starts: {formatDate(b.start_date)} {b.end_date ? `· Ends: ${formatDate(b.end_date)}` : ''}
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                          Model: <strong>{b.duration_type}</strong>
                        </p>
                      </div>
                      <span className={`badge ${STATUS_COLORS[b.status] || 'badge-pending'}`}>
                        {formatStatus(b.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'consents' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {consents.length === 0 ? (
                  <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>No digital procedure consent forms found on file.</p>
                  </div>
                ) : (
                  consents.map((c) => (
                    <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{c.procedure_description}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          Doctor: {c.doctor_name} · Hospital: {c.hospital_name}
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                          Signed on: {formatDate(c.signed_at)}
                        </p>
                      </div>
                      <Link to={`/consent/${c.id}`} className="btn btn-secondary btn-sm">
                        View Consent Form
                      </Link>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {tickets.length === 0 ? (
                  <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>You have no open or past feedback support tickets.</p>
                  </div>
                ) : (
                  tickets.map((t) => (
                    <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="badge badge-primary" style={{ marginBottom: 'var(--space-2)' }}>{t.category}</span>
                        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{t.subject}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          Ticket ID: #{t.id} · Logged: {formatDate(t.created_at)}
                        </p>
                      </div>
                      <span className={`badge ${STATUS_COLORS[t.status] || 'badge-pending'}`}>
                        {formatStatus(t.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
