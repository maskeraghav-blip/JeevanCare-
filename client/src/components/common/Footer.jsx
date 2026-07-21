import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-info">
            <Link to="/" className="footer-logo">
              <span className="brand-icon">💚</span>
              <span className="brand-text-footer">JeevanCare<sup>+</sup></span>
            </Link>
            <p className="footer-desc">
              Your trusted partner in healthcare. Connecting patients in Hyderabad with premium hospitals, clinics, nurses, and physiotherapists.
            </p>
            <p className="footer-region">📍 Serving Hyderabad, Telangana</p>
          </div>

          <div className="footer-links-group">
            <h4>Quick Services</h4>
            <ul>
              <li><Link to="/hospitals">Hospital Directory</Link></li>
              <li><Link to="/clinic-doctors">Clinic Home Visits</Link></li>
              <li><Link to="/nurses">Nurse Booking</Link></li>
              <li><Link to="/physiotherapy">Physiotherapy Visits</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Support & Legals</h4>
            <ul>
              <li><Link to="/complaints">Submit Feedback</Link></li>
              <li><Link to="/consent">Online Consent Form</Link></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Emergency Helpline</h4>
            <p className="emergency-num">🚨 108 / 040-108108</p>
            <p>Email: support@jeevancare.plus</p>
            <p>Hours: 24/7 Operations</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JeevanCare+ Healthcare Platform. All rights reserved.</p>
          <p className="footer-disclaimer">MVP Level Platform. Digital Consent forms are non-binding demonstrations.</p>
        </div>
      </div>
    </footer>
  );
}
