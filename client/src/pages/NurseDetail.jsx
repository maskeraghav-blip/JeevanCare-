import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';

export default function NurseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nurse, setNurse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [durationType, setDurationType] = useState('one-time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const res = await api.get(`/nurses/${id}`);
        setNurse(res.data.nurse);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error('Error fetching nurse details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNurse();
  }, [id]);

  useEffect(() => {
    if (user?.address && !address) {
      setAddress(user.address);
    }
  }, [user, address]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/nurses/${id}` } } });
      return;
    }

    setBookingError('');
    setBookingSubmitting(true);

    try {
      await api.post(`/nurses/${id}/book`, {
        duration_type: durationType,
        start_date: startDate,
        end_date: durationType !== 'one-time' ? endDate : null,
        patient_address: address,
        notes
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Failed to submit nurse booking.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}></div>;
  if (!nurse) {
    return (
      <div className="container page-wrapper text-center">
        <h2>Nurse Details Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/nurses')}>Back to Directory</button>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/nurses" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>← Back to Nurses Directory</Link>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1.3fr', gap: 'var(--space-8)' }}>
        {/* Nurse Details & Reviews */}
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
                🩺
              </div>

              <div>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{nurse.name}</h1>
                <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>
                  {nurse.specialization} Specialist
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
                  <span style={{ color: 'var(--color-accent-yellow)' }}>★</span>
                  <span style={{ fontWeight: 600 }}>{nurse.rating}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                    ({nurse.experience_years} Years Experience)
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Availability Model
                </h3>
                <span className="badge badge-primary" style={{ display: 'inline-block', marginTop: 'var(--space-1)' }}>
                  Available for {nurse.availability_type} bookings
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Service Fee Rate
                </h3>
                <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '2px' }}>
                  ₹{nurse.daily_rate} / Day
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Biography
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.6 }}>
                  {nurse.bio || 'Professional home care nursing services.'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              💬 Reviews & Feedback ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>No feedback left for this caregiver yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {reviews.map((r) => (
                  <div key={r.id} className="card" style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{r.reviewer_name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-accent-yellow)' }}>
                        ★ {r.rating}
                      </div>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      "{r.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Card */}
        <div>
          <div className="card glass-card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              📅 Hire Caregiver
            </h3>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🎉</div>
                <h4 style={{ color: 'var(--color-accent-green)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  Booking Saved!
                </h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                  Your caregiver request has been submitted. Check your profile to review status.
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
                  <label className="form-label" htmlFor="durationType">Duration Type</label>
                  <select
                    id="durationType"
                    className="form-select"
                    value={durationType}
                    onChange={(e) => setDurationType(e.target.value)}
                    required
                  >
                    <option value="one-time">One-Time Visit</option>
                    <option value="daily">Daily Shifts</option>
                    <option value="weekly">Weekly Contract</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {durationType !== 'one-time' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      className="form-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Patient Address (Hyderabad)</label>
                  <textarea
                    id="address"
                    className="form-input"
                    placeholder="Enter full home address for nursing care"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="notes">Special Requirements / Notes</label>
                  <textarea
                    id="notes"
                    className="form-input"
                    placeholder="e.g. Needs mobility support, catheter care, post-op dressings"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ minHeight: '60px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 'var(--space-4)' }}
                  disabled={bookingSubmitting}
                >
                  {user ? (bookingSubmitting ? 'Submitting...' : 'Confirm Hiring Request') : 'Login to Hire Nurse'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
