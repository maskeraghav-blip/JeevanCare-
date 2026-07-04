import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import GoogleMap from '../components/common/GoogleMap';

export default function PhysioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [physio, setPhysio] = useState(null);
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
    const fetchPhysio = async () => {
      try {
        const res = await api.get(`/physio/${id}`);
        setPhysio(res.data.physiotherapist);
      } catch (err) {
        console.error('Error fetching physiotherapist details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhysio();
  }, [id]);

  useEffect(() => {
    if (user?.address && !address) {
      setAddress(user.address);
    }
  }, [user, address]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/physiotherapy/${id}` } } });
      return;
    }

    setBookingError('');
    setBookingSubmitting(true);

    try {
      await api.post(`/physio/${id}/book`, {
        appointment_date: date,
        time_slot: slot,
        patient_address: address,
        reason
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Failed to book home session.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}></div>;
  if (!physio) {
    return (
      <div className="container page-wrapper text-center">
        <h2>Physiotherapist Profile Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/physiotherapy')}>Back to Directory</button>
      </div>
    );
  }

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
  ];

  return (
    <div className="container page-wrapper">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/physiotherapy" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>← Back to Physiotherapists</Link>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1.3fr', gap: 'var(--space-8)' }}>
        {/* Profile Details */}
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
                🦴
              </div>

              <div>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{physio.name}</h1>
                <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>
                  {physio.specialization}
                </p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                  💼 {physio.experience_years} Years Experience · 🎓 {physio.qualification}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Base Clinic / Address
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  📍 {physio.address}
                </p>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>HOME VISIT FEE (PER SESSION)</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-lg)' }}>
                  ₹{physio.home_visit_fee || '1500'}
                </span>
              </div>

              {physio.bio && (
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Biography
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.6 }}>
                    {physio.bio}
                  </p>
                </div>
              )}
            </div>

            {physio.lat && physio.lng && (
              <div style={{ marginTop: 'var(--space-6)', height: '220px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <GoogleMap locations={[physio]} type="clinics" />
              </div>
            )}
          </div>
        </div>

        {/* Booking Form panel */}
        <div>
          <div className="card glass-card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              📅 Book Home Session
            </h3>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🎉</div>
                <h4 style={{ color: 'var(--color-accent-green)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  Session Registered!
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                  Your physiotherapy request is submitted as **Pending**. Check your profile status anytime.
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
                  <label className="form-label" htmlFor="date">Session Date</label>
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
                  <label className="form-label" htmlFor="slot">Preferred Slot</label>
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
                    placeholder="Enter full home address for physiotherapist visit"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reason">Clinical Symptoms / Reasons</label>
                  <input
                    type="text"
                    id="reason"
                    className="form-input"
                    placeholder="e.g. Stroke rehab, back injury, frozen shoulder"
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
                  {user ? (bookingSubmitting ? 'Submitting...' : 'Submit Session Request') : 'Login to Book Session'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
