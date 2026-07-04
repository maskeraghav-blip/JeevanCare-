import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/constants';

export default function Consent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('male');
  const [procedureDescription, setProcedureDescription] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  const [pastConsents, setPastConsents] = useState([]);
  const [loadingPast, setLoadingPast] = useState(false);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPastConsents = async () => {
    if (!user) return;
    setLoadingPast(true);
    try {
      const res = await api.get('/consent');
      setPastConsents(res.data.consents);
    } catch (err) {
      console.error('Error fetching past consent forms:', err);
    } finally {
      setLoadingPast(false);
    }
  };

  useEffect(() => {
    fetchPastConsents();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/consent' } } });
      return;
    }

    if (!agreed) {
      setError('You must check the agreement box before submitting.');
      return;
    }

    setError('');
    setSubmitting(true);

    const consentText = `I, ${patientName}, hereby authorize Dr. ${doctorName || 'Assigned Doctor'} at ${hospitalName || 'Assigned Hospital'} to perform the procedure: ${procedureDescription}. I confirm that the risks and options have been explained to me. This consent is signed digitally.`;

    try {
      const res = await api.post('/consent', {
        patient_name: patientName,
        patient_age: patientAge ? parseInt(patientAge) : null,
        patient_gender: patientGender,
        procedure_description: procedureDescription,
        doctor_name: doctorName,
        hospital_name: hospitalName,
        agreed,
        consent_text: consentText,
        signature_name: signatureName
      });

      // Reset form & reload list
      setProcedureDescription('');
      setDoctorName('');
      setHospitalName('');
      setAgreed(false);
      setSignatureName('');
      setPatientAge('');
      fetchPastConsents();

      navigate(`/consent/${res.data.consent.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register consent.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <h1>Digital Consent Forms</h1>
        <p>Complete procedure consent forms online with digital verification logging</p>
      </div>

      {/* MVP Alert Banner */}
      <div style={{
        background: 'var(--color-accent-yellow-light)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
        fontSize: 'var(--font-size-sm)',
        color: '#92400E'
      }}>
        ⚠️ <strong>MVP Notice:</strong> This digital signature feature uses a typed name authentication model and is designed for prototype presentation and record logging. It is not currently integrated with legally binding Aadhar/e-Sign frameworks.
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1.8fr 1.2fr', gap: 'var(--space-8)' }}>
        {/* Form panel */}
        <div>
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
              📋 Create Digital Consent Form
            </h3>

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
                <label className="form-label" htmlFor="patientName">Patient Name</label>
                <input
                  type="text"
                  id="patientName"
                  className="form-input"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="patientAge">Patient Age</label>
                  <input
                    type="number"
                    id="patientAge"
                    className="form-input"
                    placeholder="e.g. 35"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="patientGender">Gender</label>
                  <select
                    id="patientGender"
                    className="form-select"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="doctorName">Doctor Name</label>
                  <input
                    type="text"
                    id="doctorName"
                    className="form-input"
                    placeholder="Dr. S. K. Prasad"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hospitalName">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    id="hospitalName"
                    className="form-input"
                    placeholder="Apollo Hospitals"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="procedureDescription">Procedure / Treatment Description</label>
                <textarea
                  id="procedureDescription"
                  className="form-input"
                  placeholder="e.g. Laparoscopic Appendectomy under General Anesthesia"
                  value={procedureDescription}
                  onChange={(e) => setProcedureDescription(e.target.value)}
                  style={{ minHeight: '80px' }}
                  required
                />
              </div>

              {/* Consent Box */}
              <div style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                maxHeight: '160px',
                overflowY: 'auto',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)'
              }}>
                <p style={{ marginBottom: 'var(--space-3)' }}><strong>1. Information Disclosure:</strong> I acknowledge that I have been informed of the nature of the treatment, the anticipated outcomes, potential alternatives, and the associated risks (including bleeding, infection, and anaesthetic complications).</p>
                <p style={{ marginBottom: 'var(--space-3)' }}><strong>2. Authorization:</strong> I authorize the listed physician and medical team to perform the surgery or treatment as described. I understand that medical contingencies may arise during the course of the treatment requiring additional procedures.</p>
                <p><strong>3. Electronic Recording:</strong> I agree that checking the box below and typing my name constitutes an electronic signature which will be logged alongside my device IP and timestamp as verify records.</p>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                <input
                  type="checkbox"
                  id="agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="agreed" style={{ fontSize: 'var(--font-size-sm)', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                  I confirm that I have read the disclosure terms above, understand the risks, and voluntarily consent to the procedure.
                </label>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label" htmlFor="signatureName">Typed Digital Signature (Your Full Name)</label>
                <input
                  type="text"
                  id="signatureName"
                  className="form-input"
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'var(--font-size-lg)', letterSpacing: '0.05em' }}
                  placeholder="Type your name to sign"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  required
                />
                <span className="form-hint">Must match patient name exactly.</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={submitting}
              >
                {user ? (submitting ? 'Registering Consent...' : 'Sign & Submit Consent') : 'Login to Sign Consent'}
              </button>
            </form>
          </div>
        </div>

        {/* History Panel */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            📋 Signed Consents
          </h2>

          {!user ? (
            <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Log in to view your archive of signed consent forms.
              </p>
            </div>
          ) : loadingPast ? (
            <div className="loading-spinner"></div>
          ) : pastConsents.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>You have no signed digital consents registered.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {pastConsents.map((c) => (
                <div key={c.id} className="card" style={{ padding: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>
                    FORM #{c.id} · {formatDate(c.signed_at)}
                  </span>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, margin: 'var(--space-1) 0' }}>
                    {c.procedure_description}
                  </h4>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                    Doctor: {c.doctor_name} | {c.hospital_name}
                  </p>
                  <Link to={`/consent/${c.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    📄 View & Print Record
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
