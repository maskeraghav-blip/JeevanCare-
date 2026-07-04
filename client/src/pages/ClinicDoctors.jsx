import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import GoogleMap from '../components/common/GoogleMap';

export default function ClinicDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await api.get('/clinic-doctors', {
          params: { specialization, search }
        });
        setDoctors(res.data.doctors);
      } catch (err) {
        console.error('Error fetching clinic doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(delayDebounce);
  }, [specialization, search]);

  const handleMarkerClick = (doctor) => {
    setSelectedDoctor(doctor);
    const element = document.getElementById(`doctor-card-${doctor.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const specializations = [
    { value: '', label: 'All Specialties' },
    { value: 'General Practice', label: 'General Practice' },
    { value: 'Dentistry', label: 'Dentistry' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Obstetrics & Gynecology', label: 'Obstetrics & Gynecology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Endocrinology', label: 'Endocrinology' },
  ];

  return (
    <div className="container page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Independent Clinic Doctors</h1>
          <p>Book home visits or clinic visits with independent doctors in Hyderabad</p>
        </div>

        {/* Specialty Filter */}
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
          placeholder="🔍 Search doctors by name, clinic name, or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="map-split-view">
        {/* Left Column: Map */}
        <div style={{ position: 'sticky', top: '90px', height: 'calc(100vh - 220px)', minHeight: '400px' }}>
          <GoogleMap
            locations={doctors}
            type="clinics"
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* Right Column: Scrollable list */}
        <div style={{ overflowY: 'auto', height: 'calc(100vh - 220px)', paddingRight: 'var(--space-2)' }}>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <h3>No Doctors Found</h3>
              <p>Try resetting filters or searching with different keywords.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {doctors.map((d) => {
                const isSelected = selectedDoctor?.id === d.id;
                return (
                  <div
                    key={d.id}
                    id={`doctor-card-${d.id}`}
                    className={`card ${isSelected ? 'glass-card' : ''}`}
                    style={{
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'scale(1.01)' : 'none'
                    }}
                    onClick={() => setSelectedDoctor(d)}
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
                        👨‍⚕️
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>{d.name}</h3>
                          <span className="badge badge-primary">{d.specialization}</span>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: '2px 0' }}>
                          🏢 {d.clinic_name || 'Independent Clinic'}
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                          📍 {d.clinic_address}
                        </p>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>HOME VISIT FEE</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-md)' }}>
                          ₹{d.home_visit_fee || '600'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clinic-doctors/${d.id}`);
                          }}
                        >
                          Book Home Visit
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
