import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults(null); setIsOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const hasResults = results && (
    (results.hospitals?.length > 0) ||
    (results.hospitalDoctors?.length > 0) ||
    (results.clinicDoctors?.length > 0) ||
    (results.physiotherapists?.length > 0) ||
    (results.nurses?.length > 0)
  );

  const handleNavigate = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'hospitals', label: 'Hospitals' },
    { key: 'doctors', label: 'Doctors' },
    { key: 'clinics', label: 'Clinics' },
    { key: 'nurses', label: 'Nurses' },
  ];

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search doctors, hospitals, specializations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setIsOpen(true)}
        />
        {loading && <span className="search-loading"></span>}
      </div>

      {isOpen && results && (
        <div className="search-dropdown">
          <div className="search-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`search-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="search-results">
            {!hasResults && (
              <div className="search-empty">No results found for "{query}"</div>
            )}

            {(activeTab === 'all' || activeTab === 'hospitals') && results.hospitals?.length > 0 && (
              <div className="result-section">
                <h4 className="result-section-title">🏥 Hospitals</h4>
                {results.hospitals.map(h => (
                  <button key={`h-${h.id}`} className="result-item" onClick={() => handleNavigate(`/hospitals/${h.id}`)}>
                    <span className="result-name">{h.name}</span>
                    <span className={`badge ${h.type === 'government' ? 'badge-govt' : 'badge-private'}`}>{h.type}</span>
                  </button>
                ))}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'doctors') && results.hospitalDoctors?.length > 0 && (
              <div className="result-section">
                <h4 className="result-section-title">👨‍⚕️ Hospital Doctors</h4>
                {results.hospitalDoctors.map(d => (
                  <button key={`hd-${d.id}`} className="result-item" onClick={() => handleNavigate(`/hospitals/doctors/${d.id}`)}>
                    <span className="result-name">{d.name}</span>
                    <span className="result-sub">{d.specialization} · {d.hospital_name}</span>
                  </button>
                ))}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'clinics') && results.clinicDoctors?.length > 0 && (
              <div className="result-section">
                <h4 className="result-section-title">🩺 Clinics</h4>
                {results.clinicDoctors.map(c => (
                  <button key={`cd-${c.id}`} className="result-item" onClick={() => handleNavigate(`/clinic-doctors/${c.id}`)}>
                    <span className="result-name">{c.name}</span>
                    <span className="result-sub">{c.specialization}</span>
                  </button>
                ))}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'doctors') && results.physiotherapists?.length > 0 && (
              <div className="result-section">
                <h4 className="result-section-title">🦴 Physiotherapists</h4>
                {results.physiotherapists.map(p => (
                  <button key={`p-${p.id}`} className="result-item" onClick={() => handleNavigate(`/physiotherapy/${p.id}`)}>
                    <span className="result-name">{p.name}</span>
                    <span className="result-sub">{p.specialization}</span>
                  </button>
                ))}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'nurses') && results.nurses?.length > 0 && (
              <div className="result-section">
                <h4 className="result-section-title">🩺 Nurses</h4>
                {results.nurses.map(n => (
                  <button key={`n-${n.id}`} className="result-item" onClick={() => handleNavigate(`/nurses/${n.id}`)}>
                    <span className="result-name">{n.name}</span>
                    <span className="result-sub">{n.specialization} · ⭐ {n.rating}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
