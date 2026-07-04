import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';

export default function HospitalDoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/hospitals/doctors/${doctorId}`);
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}></div>;
  if (!doctor) {
    return (
      <div className="container page-wrapper text-center">
        <h2>Doctor Profile Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/hospitals')}>Back to Hospitals</button>
      </div>
    );
  }

  return (
    <div className="container page-wrapper" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost"
          style={{ paddingLeft: 0, fontWeight: 600, color: 'var(--color-primary)' }}
        >
          ← Go Back
        </button>
      </div>

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
            <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-md)', marginTop: '2px' }}>
              {doctor.specialization}
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
              💼 {doctor.experience_years} Years of Experience
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Qualifications
            </h3>
            <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
              🎓 {doctor.qualification}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Associated Hospital
            </h3>
            <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
              🏥 <Link to={`/hospitals/${doctor.hospital_id}`} style={{ textDecoration: 'underline' }}>{doctor.hospital_name}</Link>
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              📍 {doctor.hospital_address}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Consultation Timings
            </h3>
            <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>
              ⏰ {doctor.timings || 'Mon-Sat 9:00 AM - 5:00 PM'}
            </p>
          </div>

          {doctor.bio && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Professional Biography
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.6 }}>
                {doctor.bio}
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)' }}>
          {doctor.hospital_contact && (
            <a href={`tel:${doctor.hospital_contact}`} className="btn btn-primary" style={{ flex: 1 }}>
              📞 Call Hospital Desk
            </a>
          )}
          <Link to={`/hospitals/${doctor.hospital_id}`} className="btn btn-secondary" style={{ flex: 1 }}>
            🏥 Visit Hospital Page
          </Link>
        </div>
      </div>
    </div>
  );
}
