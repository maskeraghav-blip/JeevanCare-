import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const modules = [
    {
      title: 'Hospitals Directory',
      desc: 'Map-based directory of Government and Private hospitals. View detailed infrastructure and doctor teams.',
      icon: '🏥',
      path: '/hospitals',
      badge: 'Hyderabad-Wide'
    },
    {
      title: 'Clinic Home Visits',
      desc: 'Connect with verified independent clinic doctors who provide outpatient consultations and home doctor visits.',
      icon: '👨‍⚕️',
      path: '/clinic-doctors',
      badge: 'Active Booking'
    },
    {
      title: 'Physiotherapists',
      desc: 'Book rehabilitation, orthopedic, sports recovery, or pediatric physiotherapy sessions directly to your home.',
      icon: '🦴',
      path: '/physiotherapy',
      badge: 'Home Rehab'
    },
    {
      title: 'On-Demand Nurses',
      desc: 'Hire professional home nursing care staff for post-operative care, elderly patient care, or ICU support.',
      icon: '🩺',
      path: '/nurses',
      badge: 'Verified Mock Profiles'
    },
    {
      title: 'Online Consent Form',
      desc: 'Fill and sign digital procedure consent forms before medical treatments with secure IP & audit logging.',
      icon: '📋',
      path: '/consent',
      badge: 'Digital Log'
    },
    {
      title: 'Feedback Support Box',
      desc: 'Submit complaints, suggestions, or technical bugs directly to our administrative helpdesk team.',
      icon: '📝',
      path: '/complaints',
      badge: '24/7 Response'
    }
  ];

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-tagline">✨ Healthcare On Demand</span>
            <h1>Comprehensive Healthcare Services, right at your doorstep.</h1>
            <p>
              JeevanCare+ is a unified healthcare portal serving Hyderabad. Instantly search hospitals, hire on-demand nurses, book home physiotherapy, or schedule clinic doctor visits.
            </p>
            <div className="hero-actions">
              <Link to="/hospitals" className="btn btn-primary btn-lg">Explore Hospitals</Link>
              <Link to="/clinic-doctors" className="btn btn-secondary btn-lg">Book Clinic Doctor</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card glass-card">
              <h3>Fast Care Delivery</h3>
              <p>Book verified home visits in Hyderabad within minutes.</p>
            </div>
            <div className="visual-card glass-card float-2">
              <h3>Home Nursing</h3>
              <p>Hire skilled nursing staff with flexible duration models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>Our Core Health Modules</h2>
            <p>JeevanCare+ integrates 6 distinct healthcare portals. Browse map clinics, doctors, and nurses.</p>
          </div>

          <div className="grid-3">
            {modules.map((mod) => (
              <div key={mod.title} className="card service-card">
                <span className="service-badge">{mod.badge}</span>
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
                <Link to={mod.path} className="btn btn-primary service-action-btn">
                  Open Module
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Help Banner */}
      <section className="emergency-banner no-print">
        <div className="container banner-container">
          <div className="banner-content">
            <h2>🚨 Need Urgent Medical Assistance?</h2>
            <p>Connect immediately with Hyderabad Emergency Ambulance Desks and critical trauma units.</p>
          </div>
          <a href="tel:108" className="btn btn-danger btn-lg">Call Ambulance (108)</a>
        </div>
      </section>
    </div>
  );
}
