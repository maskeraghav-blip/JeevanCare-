import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { formatDate } from '../utils/constants';

export default function ConsentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsent = async () => {
      try {
        const res = await api.get(`/consent/${id}`);
        setConsent(res.data.consent);
      } catch (err) {
        console.error('Error fetching consent detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsent();
  }, [id]);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}></div>;
  if (!consent) {
    return (
      <div className="container page-wrapper text-center">
        <h2>Consent Form Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/consent')}>Back to Consent Forms</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container page-wrapper" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }} className="no-print">
        <Link to="/consent" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>← Back to Consent Registry</Link>
      </div>

      <div className="card" style={{ padding: 'var(--space-10)', border: '2px solid var(--color-text-primary)', position: 'relative' }}>
        {/* watermark stamp */}
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          border: '3px solid var(--color-primary)',
          color: 'var(--color-primary)',
          padding: 'var(--space-2) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 800,
          fontSize: 'var(--font-size-sm)',
          transform: 'rotate(5deg)',
          opacity: 0.8,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ✅ Digital Sign Verified
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <span style={{ fontSize: '3rem' }}>💚</span>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 'var(--space-2)' }}>
            JeevanCare+ Verification Record
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
            DIGITAL PROCEDURE CONSENT ARCHIVE
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>PATIENT NAME</span>
              <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>{consent.patient_name}</span>
            </div>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>PATIENT PROFILE</span>
              <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>{consent.patient_age} Years, {consent.patient_gender}</span>
            </div>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>CLINICAL PROVIDER</span>
              <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>Dr. {consent.doctor_name}</span>
            </div>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>CLINIC / FACILITY</span>
              <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>{consent.hospital_name}</span>
            </div>
          </div>

          {/* Procedure Statement */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
              Authorized Procedure
            </h3>
            <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{consent.procedure_description}</p>
            </div>
          </div>

          {/* Signed Text Statement */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
              Acknowledgment & Declarations
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
              {consent.consent_text || 'Standard procedure disclosure & consent terms acknowledged.'}
            </p>
          </div>

          {/* Verification Audit Log */}
          <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)' }}>
              Digital Signature Audit Trail
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', background: '#F8FAFC', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>TYPED SIGNATURE</span>
                <span style={{ fontSize: 'var(--font-size-lg)', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 600 }}>
                  {consent.signature_name}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>TIMESTAMP (IST)</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  {formatDate(consent.signed_at)}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>IP ADDRESS LOG</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'monospace' }}>
                  {consent.ip_address}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>RECORD STATUS</span>
                <span className="badge badge-confirmed" style={{ alignSelf: 'flex-start' }}>
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Legal disclaimer */}
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-6)', lineHeight: 1.4 }}>
            Verification code: JC-{consent.id}-{new Date(consent.signed_at).getTime()}<br />
            This consent is signed via user session credentials. Designed for prototype review purposes.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }} className="no-print">
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Print Consent Record
        </button>
        <Link to="/consent" className="btn btn-secondary">
          Back to Consent list
        </Link>
      </div>
    </div>
  );
}
