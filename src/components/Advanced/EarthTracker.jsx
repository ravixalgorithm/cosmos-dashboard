import React, { useState, useEffect, useRef } from 'react'

const EarthTracker = ({ issData }) => {
  const [viewMode, setViewMode] = useState('2D')
  const [isTracking, setIsTracking] = useState(true)
  const [orbitHistory, setOrbitHistory] = useState([])
  const canvasRef = useRef(null)

  useEffect(() => {
    // Add current position to orbit history
    if (issData.latitude && issData.longitude) {
      setOrbitHistory(prev => [...prev.slice(-50), {
        lat: parseFloat(issData.latitude),
        lng: parseFloat(issData.longitude),
        time: Date.now()
      }])
    }
  }, [issData.latitude, issData.longitude])

  const getISSPixelPosition = () => {
    const lat = parseFloat(issData.latitude)
    const lng = parseFloat(issData.longitude)
    return {
      x: ((lng + 180) / 360) * 100,
      y: ((90 - lat) / 180) * 100
    }
  }

  const issPos = getISSPixelPosition()

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'clamp(12px, 3vw, 16px)',
      padding: 'clamp(16px, 4vw, 24px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      gridColumn: window.innerWidth < 1024 ? 'span 1' : 'span 2',
      minHeight: 'clamp(400px, 60vw, 500px)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Responsive Header - Title on top, controls below */}
      <div style={{
        marginBottom: 'clamp(16px, 4vw, 20px)'
      }}>
        {/* Title Row */}
        <h3 style={{
          margin: 0,
          marginBottom: 'clamp(12px, 3vw, 16px)',
          fontSize: 'clamp(18px, 4vw, 24px)',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 12px)',
          lineHeight: '1.2'
        }}>
          🌍 ISS Live Tracker
        </h3>

        {/* Controls Row */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 480 ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: window.innerWidth < 480 ? 'stretch' : 'center',
          gap: 'clamp(8px, 2vw, 12px)'
        }}>
          {/* Live Status Badge */}
          <div style={{
            padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: 'clamp(4px, 1vw, 6px)',
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 6px)',
            alignSelf: window.innerWidth < 480 ? 'flex-start' : 'center'
          }}>
            <div style={{
              width: 'clamp(6px, 1.5vw, 8px)',
              height: 'clamp(6px, 1.5vw, 8px)',
              backgroundColor: 'white',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            LIVE
          </div>

          {/* Toggle Buttons */}
          <div style={{
            display: 'flex',
            gap: 'clamp(6px, 1.5vw, 8px)',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setViewMode(viewMode === '2D' ? '3D' : '2D')}
              style={{
                padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                backgroundColor: viewMode === '3D' ? '#3b82f6' : '#f1f5f9',
                color: viewMode === '3D' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                fontSize: 'clamp(10px, 2vw, 12px)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                whiteSpace: 'nowrap'
              }}
            >
              {viewMode === '3D' ? '🌐 3D' : '🗺️ 2D'}
            </button>

            <button
              onClick={() => setIsTracking(!isTracking)}
              style={{
                padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                backgroundColor: isTracking ? '#10b981' : '#f1f5f9',
                color: isTracking ? 'white' : '#64748b',
                border: 'none',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                fontSize: 'clamp(10px, 2vw, 12px)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                whiteSpace: 'nowrap'
              }}
            >
              {isTracking ? '📍 Track' : '⏸️ Pause'}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Earth View */}
      <div style={{
        width: '100%',
        height: 'clamp(250px, 45vw, 380px)',
        backgroundColor: '#0f172a',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: viewMode === '3D'
          ? 'radial-gradient(circle at 30% 30%, #1e40af, #0f172a)'
          : 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1024px-The_Earth_seen_from_Apollo_17.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {viewMode === '2D' && (
          <>
            {/* Orbit Trail */}
            <svg style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}>
              {orbitHistory.length > 1 && (
                <path
                  d={`M ${orbitHistory.map(point =>
                    `${((point.lng + 180) / 360) * 100}% ${((90 - point.lat) / 180) * 100}%`
                  ).join(' L ')}`}
                  stroke="#3b82f6"
                  strokeWidth={window.innerWidth < 640 ? "1.5" : "2"}
                  fill="none"
                  opacity="0.6"
                  strokeDasharray="3,3"
                />
              )}
            </svg>

            {/* ISS Position */}
            <div style={{
              position: 'absolute',
              left: `${issPos.x}%`,
              top: `${issPos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}>
              <div style={{
                width: 'clamp(12px, 3vw, 16px)',
                height: 'clamp(12px, 3vw, 16px)',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                border: `clamp(2px, 0.5vw, 3px) solid white`,
                animation: isTracking ? 'pulse 2s infinite' : 'none',
                boxShadow: '0 0 clamp(15px, 4vw, 20px) rgba(16, 185, 129, 0.5)'
              }} />

              {/* Responsive ISS Info Tooltip */}
              <div style={{
                position: 'absolute',
                top: 'clamp(-45px, -10vw, -60px)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                borderRadius: 'clamp(4px, 1vw, 6px)',
                fontSize: 'clamp(9px, 2vw, 11px)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                lineHeight: '1.3'
              }}>
                🛰️ ISS<br/>
                {issData.latitude}°, {issData.longitude}°<br/>
                Over: {issData.region}
              </div>
            </div>

            {/* Daylight/Night Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg,
                rgba(0,0,0,0.6) 0%,
                transparent 25%,
                transparent 75%,
                rgba(0,0,0,0.6) 100%)`,
              pointerEvents: 'none'
            }} />
          </>
        )}

        {viewMode === '3D' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'white',
            textAlign: 'center',
            padding: 'clamp(16px, 4vw, 24px)'
          }}>
            <div style={{
              fontSize: 'clamp(32px, 8vw, 48px)',
              marginBottom: 'clamp(12px, 3vw, 16px)'
            }}>🌍</div>
            <div style={{
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              fontWeight: '600',
              marginBottom: 'clamp(6px, 1.5vw, 8px)'
            }}>
              3D Earth Globe
            </div>
            <div style={{
              fontSize: 'clamp(11px, 2.5vw, 14px)',
              opacity: 0.8,
              marginBottom: 'clamp(12px, 3vw, 16px)',
              lineHeight: '1.4'
            }}>
              ISS Position: {issData.latitude}°, {issData.longitude}°
            </div>
            <div style={{
              fontSize: 'clamp(9px, 2vw, 12px)',
              opacity: 0.6,
              lineHeight: '1.4'
            }}>
              WebGL 3D visualization coming soon...
            </div>
          </div>
        )}
      </div>

      {/* Responsive ISS Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 480
          ? 'repeat(2, 1fr)'
          : window.innerWidth < 768
            ? 'repeat(2, 1fr)'
            : 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: 'clamp(8px, 2vw, 16px)',
        marginTop: 'clamp(16px, 4vw, 20px)',
        padding: 'clamp(12px, 3vw, 16px)',
        backgroundColor: '#f8fafc',
        borderRadius: 'clamp(6px, 1.5vw, 8px)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#3b82f6',
            lineHeight: '1.2'
          }}>
            {issData.speed || '27,600'}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            lineHeight: '1.3'
          }}>km/h</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#8b5cf6',
            lineHeight: '1.2'
          }}>
            {issData.altitude || '408'}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            lineHeight: '1.3'
          }}>km altitude</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#10b981',
            lineHeight: '1.2'
          }}>
            {issData.next_sunrise || '42'}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            lineHeight: '1.3'
          }}>min to sunrise</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#f59e0b',
            lineHeight: '1.2'
          }}>
            {issData.mission_duration || '9,127'}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            lineHeight: '1.3'
          }}>days in orbit</div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        /* Mobile-specific optimizations */
        @media (max-width: 479px) {
          .earth-tracker-mobile {
            padding: 16px;
          }
        }

        /* Touch-friendly button states */
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

export default EarthTracker
