import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import GoogleMap from '../components/common/GoogleMap';
import { FACILITY_ICONS } from '../utils/constants';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(''); // '' (all), 'government', 'private'
  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const res = await api.get('/hospitals', {
          params: { type: typeFilter, search }
        });
        setHospitals(res.data.hospitals);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchHospitals, 300);
    return () => clearTimeout(delayDebounce);
  }, [typeFilter, search]);

  const handleMarkerClick = (hospital) => {
    setSelectedHospital(hospital);
    // Scroll list card into view if needed
    const element = document.getElementById(`hospital-card-${hospital.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Hospitals Directory</h1>
          <p>Find government and private hospitals across Hyderabad, Telangana</p>
        </div>

        {/* Govt / Private Switch */}
        <div className="toggle-group">
          <button
            className={`toggle-option ${typeFilter === '' ? 'active' : ''}`}
            onClick={() => setTypeFilter('')}
          >
            All
          </button>
          <button
            className={`toggle-option ${typeFilter === 'government' ? 'active' : ''}`}
            onClick={() => setTypeFilter('government')}
          >
            Government
          </button>
          <button
            className={`toggle-option ${typeFilter === 'private' ? 'active' : ''}`}
            onClick={() => setTypeFilter('private')}
          >
            Private
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search hospitals by name, area, or facility..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="map-split-view">
        {/* Left Column: Interactive Map */}
        <div style={{ position: 'sticky', top: '90px', height: 'calc(100vh - 220px)', minHeight: '400px' }}>
          <GoogleMap
            locations={hospitals}
            type="hospitals"
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* Right Column: Scrollable List */}
        <div style={{ overflowY: 'auto', height: 'calc(100vh - 220px)', paddingRight: 'var(--space-2)' }}>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : hospitals.length === 0 ? (
            <div className="empty-state">
              <h3>No Hospitals Found</h3>
              <p>Try resetting the filters or searching with a different term.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {hospitals.map((h) => {
                const isSelected = selectedHospital?.id === h.id;
                return (
                  <div
                    key={h.id}
                    id={`hospital-card-${h.id}`}
                    className={`card ${isSelected ? 'glass-card' : ''}`}
                    style={{
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'scale(1.01)' : 'none'
                    }}
                    onClick={() => setSelectedHospital(h)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{h.name}</h3>
                      <span className={`badge ${h.type === 'government' ? 'badge-govt' : 'badge-private'}`}>
                        {h.type}
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                      {h.address}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                      {h.facilities?.slice(0, 4).map((f) => (
                        <span key={f} className="facility-tag">
                          {f}
                        </span>
                      ))}
                      {h.facilities?.length > 4 && (
                        <span className="facility-tag" style={{ background: 'var(--color-border-light)' }}>
                          +{h.facilities.length - 4} More
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/hospitals/${h.id}`);
                        }}
                      >
                        View Facilities & Doctors
                      </button>
                      {h.contact_number && (
                        <a
                          href={`tel:${h.contact_number}`}
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📞 Call
                        </a>
                      )}
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
