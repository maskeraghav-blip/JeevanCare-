import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import GoogleMap from '../components/common/GoogleMap';

export default function ClinicDoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [reason, setReason] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/clinic-doctors/${id}`);
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error('Error fetching clinic doctor details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Set default address when user profile loads
  useEffect(() => {
    if (user?.address && !address) {
      setAddress(user.address);
    }
  }, [user, address]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/clinic-doctors/${id}` } } });
      return;
    }

    setBookingError('');
    setBookingSubmitting(true);

    try {
      await api.post(`/clinic-doctors/${id}/book`, {
        appointment_date: date,
        time_slot: slot,
        patient_address: address,
        reason
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Failed to book home visit.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}></div>;
  if (!doctor) {
    return (
      <div className="container page-wrapper text-center">
        <h2>Doctor Profile Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/clinic-doctors')}>Back to Directory</button>
      </div>
    );
  }

  // Fallback slots if none defined
  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
  ];

  return (
    <div className="container page-wrapper">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/clinic-doctors" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>← Back to Clinic Doctors</Link>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1.3fr', gap: 'var(--space-8)' }}>
        {/* Profile Card & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'var(--color-primary-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'var(--color-primary)'
              }}>
                👨‍⚕️
              </div>

              <div>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{doctor.name}</h1>
                <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>
                  {doctor.specialization}
                </p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                  💼 {doctor.experience_years} Years Experience · 🎓 {doctor.qualification}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Clinic Details
                </h3>
                <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  🏢 {doctor.clinic_name || 'Independent Clinic Outpatient'}
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  📍 {doctor.clinic_address}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>CLINIC VISITING FEE</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-lg)' }}>
                    ₹{doctor.consultation_fee || '400'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>HOME VISIT FEE</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-lg)' }}>
                    ₹{doctor.home_visit_fee || '600'}
                  </span>
                </div>
              </div>

              {doctor.bio && (
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Biography
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.6 }}>
                    {doctor.bio}
                  </p>
                </div>
              )}
            </div>

            {doctor.lat && doctor.lng && (
              <div style={{ marginTop: 'var(--space-6)', height: '220px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <GoogleMap locations={[doctor]} type="clinics" />
              </div>
            )}
          </div>
        </div>

        {/* Booking Request Form */}
        <div>
          <div className="card glass-card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              📅 Book Home Visit
            </h3>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🎉</div>
                <h4 style={{ color: 'var(--color-accent-green)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  Booking Request Sent!
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                  Your appointment is registered as **Pending**. Check your profile page to monitor status.
                </p>
                <Link to="/profile" className="btn btn-primary" style={{ width: '100%' }}>
                  Go to Profile
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                {bookingError && (
                  <div style={{
                    background: 'var(--color-accent-red-light)',
                    color: 'var(--color-accent-red)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-4)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    ⚠️ {bookingError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="date">Appointment Date</label>
                  <input
                    type="date"
                    id="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="slot">Available Time Slot</label>
                  <select
                    id="slot"
                    className="form-select"
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    required
                  >
                    <option value="">Select a Slot</option>
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Patient Address (Hyderabad)</label>
                  <textarea
                    id="address"
                    className="form-input"
                    placeholder="Enter full home address for visit"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reason">Reason for Visit</label>
                  <input
                    type="text"
                    id="reason"
                    className="form-input"
                    placeholder="e.g. Regular checkup, fever, orthopaedic pain"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 'var(--space-4)' }}
                  disabled={bookingSubmitting}
                >
                  {user ? (bookingSubmitting ? 'Booking...' : 'Submit Booking Request') : 'Login to Book Visit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
