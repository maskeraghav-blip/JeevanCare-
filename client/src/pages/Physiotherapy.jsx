import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import GoogleMap from '../components/common/GoogleMap';

export default function Physiotherapy() {
  const [physios, setPhysios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const [search, setSearch] = useState('');
  const [selectedPhysio, setSelectedPhysio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhysios = async () => {
      setLoading(true);
      try {
        const res = await api.get('/physio', {
          params: { specialization, search }
        });
        setPhysios(res.data.physiotherapists);
      } catch (err) {
        console.error('Error fetching physiotherapists:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchPhysios, 300);
    return () => clearTimeout(delayDebounce);
  }, [specialization, search]);

  const handleMarkerClick = (physio) => {
    setSelectedPhysio(physio);
    const element = document.getElementById(`physio-card-${physio.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const specializations = [
    { value: '', label: 'All Specialties' },
    { value: 'Sports Physiotherapy', label: 'Sports Physiotherapy' },
    { value: 'Sports & Musculoskeletal Physiotherapy', label: 'Sports & Musculoskeletal' },
    { value: 'Neurological Rehabilitation', label: 'Neurological Rehabilitation' },
    { value: 'Orthopedic & Sports Rehabilitation', label: 'Orthopedic & Sports' },
    { value: 'Orthopedic Physiotherapy', label: 'Orthopedic Physiotherapy' },
    { value: 'Women\'s Health & Physiotherapy', label: 'Women\'s Health' },
    { value: 'Spine & Sports Rehabilitation', label: 'Spine & Sports' },
    { value: 'Musculoskeletal Rehabilitation', label: 'Musculoskeletal' },
    { value: 'Sports Injury Rehabilitation', label: 'Sports Injury' },
    { value: 'Neuro & Orthopedic Physiotherapy', label: 'Neuro & Orthopedic' },
  ];

  return (
    <div className="container page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Physiotherapist Directory</h1>
          <p>Book home visit rehabilitation & physiotherapy sessions in Hyderabad</p>
        </div>

        {/* Filter */}
        <div>
          <select
            className="form-select"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            style={{ width: '220px' }}
          >
            {specializations.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search physiotherapists by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="map-split-view">
        {/* Left Column: Map */}
        <div style={{ position: 'sticky', top: '90px', height: 'calc(100vh - 220px)', minHeight: '400px' }}>
          <GoogleMap
            locations={physios}
            type="clinics" // Uses 'C'/green circle config which matches home visit providers
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* Right Column: Scrollable list */}
        <div style={{ overflowY: 'auto', height: 'calc(100vh - 220px)', paddingRight: 'var(--space-2)' }}>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : physios.length === 0 ? (
            <div className="empty-state">
              <h3>No Physiotherapists Found</h3>
              <p>Try matching with different specialties or terms.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {physios.map((p) => {
                const isSelected = selectedPhysio?.id === p.id;
                return (
                  <div
                    key={p.id}
                    id={`physio-card-${p.id}`}
                    className={`card ${isSelected ? 'glass-card' : ''}`}
                    style={{
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'scale(1.01)' : 'none'
                    }}
                    onClick={() => setSelectedPhysio(p)}
                  >
                    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'var(--color-primary-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: 'var(--color-primary)'
                      }}>
                        🦴
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{p.name}</h3>
                          <span className="badge badge-primary">{p.specialization}</span>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', margin: '2px 0' }}>
                          🎓 {p.qualification} · 💼 {p.experience_years} Years Experience
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                          📍 {p.address}
                        </p>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>HOME SESSION FEE</span>
                        <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-md)' }}>
                          ₹{p.home_visit_fee || '1500'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/physiotherapy/${p.id}`);
                          }}
                        >
                          Book Home Session
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
