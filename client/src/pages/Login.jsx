import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Left Column: Image Background & Branding */}
      <div className="login-left-side">
        <div className="login-brand-logo">
          <div className="login-brand-circle">J</div>
          <span className="login-brand-text">jeevanCare<sup>+</sup></span>
        </div>

        <div className="login-left-content">
          <span className="login-tagline">HYPER-LOCAL HEALTHCARE</span>
          <h1 className="login-heading">
            Care that <span>comes to you</span>, not the other way around.
          </h1>
          <p className="login-description">
            Discover hospitals, book verified home-visit doctors, and track their arrival — all in one calm, uncluttered place.
          </p>
        </div>

        <div className="login-cities">
          Serving Mumbai · Delhi · Bangalore · Hyderabad · Chennai · Kolkata · Pune · Ahmedabad
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="login-right-side">
        <div className="login-form-box">
          <span className="login-welcome-tag">WELCOME BACK</span>
          <h2 className="login-title-h2">Sign in to continue</h2>
          <p className="login-sub-hint">
            Use <code>admin@jeevancare.com</code> / <code>Admin@123</code> to explore.
          </p>

          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              fontWeight: 500,
              border: '1px solid #FCA5A5'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field-group">
              <label className="login-input-label" htmlFor="email">EMAIL</label>
              <div className="login-input-wrapper">
                <input
                  type="email"
                  id="email"
                  className="login-input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field-group" style={{ marginBottom: '24px' }}>
              <label className="login-input-label" htmlFor="password">PASSWORD</label>
              <div className="login-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="login-input-field"
                  placeholder="........"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="login-footer-text">
            New to jeevanCare+? <Link to="/signup" className="login-signup-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
