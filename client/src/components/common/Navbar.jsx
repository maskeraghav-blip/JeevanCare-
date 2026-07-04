import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchBar from './SearchBar';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { path: '/hospitals', label: 'Hospitals', icon: '🏥' },
    { path: '/clinic-doctors', label: 'Clinic Doctors', icon: '👨‍⚕️' },
    { path: '/nurses', label: 'Nurses', icon: '🩺' },
    { path: '/physiotherapy', label: 'Physiotherapy', icon: '🦴' },
    { path: '/complaints', label: 'Feedback', icon: '📝' },
    { path: '/consent', label: 'Consent', icon: '📋' },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💚</span>
          <span className="brand-text">JeevanCare<sup>+</sup></span>
        </Link>



        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}

          {user ? (
            <div className="profile-wrapper" ref={profileRef}>
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <span className="profile-avatar">{user.name?.charAt(0).toUpperCase()}</span>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    👤 My Profile
                  </Link>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm nav-login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
