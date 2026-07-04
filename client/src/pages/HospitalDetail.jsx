import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { FACILITY_ICONS } from '../utils/constants';
import GoogleMap from '../components/common/GoogleMap';

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/hospitals/${id}`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching hospital detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}></div>;
  if (!data || !data.hospital) {
    return (
      <div className="container page-wrapper text-center">
        <h2>Hospital Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/hospitals')}>Back to Directory</button>
      </div>
    );
  }

  const { hospital, doctors } = data;

  return (
    <div className="container page-wrapper">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/hospitals" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>← Back to Hospital Directory</Link>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
        {/* Main Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  {hospital.name}
                </h1>
                <span className={`badge ${hospital.type === 'government' ? 'badge-govt' : 'badge-private'}`} style={{ marginTop: 'var(--space-2)' }}>
                  {hospital.type} Hospital
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-6)' }}>
              📍 {hospital.address}, Hyderabad, Telangana
            </p>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                🏥 Hospital Infrastructure & Facilities
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                {hospital.facilities?.map((f) => (
                  <div key={f} className="facility-tag" style={{ padding: 'var(--space-3)', justifyContent: 'flex-start', fontSize: 'var(--font-size-sm)' }}>
                    <span style={{ fontSize: '1.2rem' }}>{FACILITY_ICONS[f] || '🏥'}</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              👨‍⚕️ Available Doctors ({doctors.length})
            </h2>

            {doctors.length === 0 ? (
              <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>No doctors currently listed under this hospital.</p>
              </div>
            ) : (
              <div className="grid-2">
                {doctors.map((d) => (
                  <div key={d.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                        {d.name}
                      </h3>
                      <p style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                        {d.specialization}
                      </p>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                        🎓 {d.qualification}
                      </p>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
                        💼 {d.experience_years} Years Experience
                      </p>
                    </div>

                    <Link to={`/hospitals/doctors/${d.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                      View Doctor Profile & Timings
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel (Contact info & map mockup/details) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              Contact Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
              {hospital.contact_number && (
                <div>
                  <span style={{ display: 'block', color: 'var(--color-text-muted)', fontWeight: 600 }}>📞 PHONE</span>
                  <a href={`tel:${hospital.contact_number}`} style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>
                    {hospital.contact_number}
                  </a>
                </div>
              )}
              {hospital.email && (
                <div>
                  <span style={{ display: 'block', color: 'var(--color-text-muted)', fontWeight: 600 }}>📧 EMAIL</span>
                  <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
                </div>
              )}
              {hospital.website && (
                <div>
                  <span style={{ display: 'block', color: 'var(--color-text-muted)', fontWeight: 600 }}>🌐 WEBSITE</span>
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer">{hospital.website}</a>
                </div>
              )}
              <div>
                <span style={{ display: 'block', color: 'var(--color-text-muted)', fontWeight: 600 }}>📍 ADDRESS</span>
                <p style={{ color: 'var(--color-text-secondary)' }}>{hospital.address}</p>
              </div>
            </div>

            {hospital.contact_number && (
              <a
                href={`tel:${hospital.contact_number}`}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'var(--space-6)' }}
              >
                📞 Contact Desk
              </a>
            )}

            {hospital.lat && hospital.lng && (
              <div style={{ marginTop: 'var(--space-6)', height: '220px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <GoogleMap locations={[hospital]} type="hospitals" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
