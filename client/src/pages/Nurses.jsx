import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';

export default function Nurses() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const [availabilityType, setAvailabilityType] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNurses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/nurses', {
          params: { specialization, availability_type: availabilityType, search }
        });
        setNurses(res.data.nurses);
      } catch (err) {
        console.error('Error fetching nurses:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchNurses, 300);
    return () => clearTimeout(delayDebounce);
  }, [specialization, availabilityType, search]);

  const specializations = [
    { value: '', label: 'All Specializations' },
    { value: 'elderly care', label: 'Elderly Care' },
    { value: 'post-op', label: 'Post-Operative' },
    { value: 'pediatric', label: 'Pediatric' },
    { value: 'ICU', label: 'ICU / Critical Care' },
    { value: 'general', label: 'General Care' },
  ];

  return (
    <div className="container page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>On-Demand Nursing Staff</h1>
          <p>Book verified home healthcare nurses in Hyderabad (Mock Data)</p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            style={{ width: '180px' }}
          >
            {specializations.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={availabilityType}
            onChange={(e) => setAvailabilityType(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Availability</option>
            <option value="one-time">One-Time Visits</option>
            <option value="daily">Daily Shifts</option>
            <option value="weekly">Weekly Contracts</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search nurses by name or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : nurses.length === 0 ? (
        <div className="empty-state">
          <h3>No Nurses Available</h3>
          <p>Try matching with a different filters or searching for general care.</p>
        </div>
      ) : (
        <div className="grid-3">
          {nurses.map((n) => (
            <div key={n.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'var(--color-primary)'
                  }}>
                    🩺
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{n.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: '2px' }}>
                      <span style={{ color: 'var(--color-accent-yellow)' }}>★</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{n.rating}</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>({n.experience_years}y exp)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                  <span className="badge badge-primary">{n.specialization}</span>
                  <span className="badge badge-primary" style={{ background: 'var(--color-accent-blue-light)', color: '#1D4ED8' }}>
                    {n.availability_type}
                  </span>
                </div>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)', lineClamp: '3', WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '60px' }}>
                  {n.bio}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>DAILY RATE</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{n.daily_rate}</span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/nurses/${n.id}`)}>
                  Book Nurse
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
