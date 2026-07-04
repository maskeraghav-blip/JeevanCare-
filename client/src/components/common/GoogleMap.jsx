import { useEffect, useRef, useState } from 'react';
import { HYDERABAD_CENTER } from '../../utils/constants';

export default function GoogleMap({ locations, type = 'hospitals', onMarkerClick }) {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Set up global handler for Google Maps authentication failures (e.g. invalid key)
    window.gm_authFailure = () => {
      console.warn('Google Maps authentication failed. Using interactive fallback grid.');
      setMapError(true);
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.API_GOOGLE_KEY || '';
    console.log('🗺️ Loading Google Maps. Key prefix:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT FOUND');

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => setMapError(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setMapLoaded(true));
      script.addEventListener('error', () => setMapError(true));
    }

    return () => {
      // Clean up global listener if needed
      delete window.gm_authFailure;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google || !window.google.maps) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: HYDERABAD_CENTER,
        zoom: 12,
        mapTypeId: 'hybrid',
        styles: [
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "transit",
            "stylers": [{ "visibility": "off" }]
          }
        ]
      });

      const bounds = new window.google.maps.LatLngBounds();

      locations.forEach((loc) => {
        if (!loc.lat || !loc.lng) return;

        const position = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) };
        bounds.extend(position);

        // Custom marker canvas icon or SVG path
        const markerLabel = type === 'hospitals' ? 'H' : 'C';
        const markerColor = type === 'hospitals' ? '#0E7C86' : '#10B981';

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: loc.name,
          label: {
            text: markerLabel,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 18,
          }
        });

        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(loc);
          }
        });
      });

      if (locations.length > 0) {
        map.fitBounds(bounds);
        // Avoid zooming too far in if there's only 1 marker
        if (locations.length === 1) {
          map.setZoom(14);
        }
      }
    } catch (err) {
      console.error('Error rendering Google Map:', err);
      setMapError(true);
    }
  }, [mapLoaded, locations, type, onMarkerClick]);

  if (mapError) {
    // Beautiful Premium Interactive Map Mockup Fallback
    return (
      <div key="google-map-fallback" className="map-container" style={{
        position: 'relative',
        background: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        padding: 'var(--space-6)',
        backgroundImage: 'radial-gradient(#334155 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 1
        }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
            🗺️ Interactive Map (Hyderabad Grid)
          </span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Google Maps API Key Missing
          </span>
        </div>

        {/* Mock representation of Hyderabad map grid with markers */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {locations.map((loc, idx) => {
            // Map coordinates to percentages inside a bounding box of Hyderabad
            // lat: 17.3 to 17.6 -> scale to 10% to 90%
            // lng: 78.2 to 78.6 -> scale to 10% to 90%
            const lat = parseFloat(loc.lat);
            const lng = parseFloat(loc.lng);
            const top = `${Math.min(90, Math.max(10, ((17.65 - lat) / 0.35) * 100))}%`;
            const left = `${Math.min(90, Math.max(10, ((lng - 78.2) / 0.4) * 100))}%`;

            return (
              <button
                key={loc.id || idx}
                onClick={() => onMarkerClick && onMarkerClick(loc)}
                style={{
                  position: 'absolute',
                  top,
                  left,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: type === 'hospitals' ? 'var(--color-primary)' : 'var(--color-accent-green)',
                  border: '2.5px solid white',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  transform: 'translate(-50%, -50%)',
                  transition: 'transform var(--transition-fast)'
                }}
                className="map-mock-marker"
                title={loc.name}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
              >
                {type === 'hospitals' ? 'H' : 'C'}
              </button>
            );
          })}

          <div style={{
            position: 'absolute',
            bottom: 'var(--space-4)',
            left: 'var(--space-4)',
            background: 'var(--color-bg-white)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: 'var(--font-size-xs)'
          }}>
            📍 Map Centered on Hyderabad
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key="google-map-active" ref={mapRef} className="map-container" />
  );
}
