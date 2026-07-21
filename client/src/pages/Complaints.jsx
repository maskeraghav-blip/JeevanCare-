import { useState, useEffect } from 'react';
import { api, useAuth } from '../context/AuthContext';
import { COMPLAINT_CATEGORIES, formatDate, formatStatus, STATUS_COLORS } from '../utils/constants';

export default function Complaints() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [category, setCategory] = useState('complaint');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    if (!user) return;
    setLoadingTickets(true);
    try {
      const res = await api.get('/complaints');
      setTickets(res.data.complaints);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  // Update name/email when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      await api.post('/complaints', {
        name,
        email,
        category,
        subject,
        message
      });
      setSuccess(true);
      setSubject('');
      setMessage('');
      fetchTickets(); // Refresh list if logged in
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <h1>Complaint & Feedback Box</h1>
        <p>Submit bug reports, suggestions, or complaints to JeevanCare+ support desk</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: 'var(--space-8)' }}>
        {/* Submission Form */}
        <div>
          <div className="card">
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              📝 Submit Ticket
            </h3>

            {success && (
              <div style={{
                background: 'var(--color-accent-green-light)',
                color: '#065F46',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500
              }}>
                ✅ Ticket submitted successfully! Our support desk has logged this issue and will follow up with you.
              </div>
            )}

            {error && (
              <div style={{
                background: 'var(--color-accent-red-light)',
                color: 'var(--color-accent-red)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--font-size-sm)'
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Category</label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {COMPLAINT_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="form-input"
                  placeholder="Summary of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label" htmlFor="message">Message / Details</label>
                <textarea
                  id="message"
                  className="form-input"
                  placeholder="Explain your issue, suggestion, or complaint in detail"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        </div>

        {/* User Tickets Panel */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            🎫 Your Support History
          </h2>

          {!user ? (
            <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Log in to view and track your submitted tickets & support updates.
              </p>
            </div>
          ) : loadingTickets ? (
            <div className="loading-spinner"></div>
          ) : tickets.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>You haven't submitted any complaints or feedback yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {tickets.map((t) => (
                <div key={t.id} className="card" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginRight: 'var(--space-2)' }}>{t.category}</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        Ticket #{t.id} · {formatDate(t.created_at)}
                      </span>
                    </div>
                    <span className={`badge ${STATUS_COLORS[t.status] || 'badge-pending'}`}>
                      {formatStatus(t.status)}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                    {t.subject}
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {t.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
