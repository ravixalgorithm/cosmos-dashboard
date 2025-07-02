import React, { useState, useEffect } from 'react'

const LiveCharts = ({ spaceData, spaceWeather }) => {
  const [chartData, setChartData] = useState({
    iss: [],
    solar: [],
    launches: []
  })
  const [activeChart, setActiveChart] = useState('iss')

  useEffect(() => {
    const now = new Date()

    // ISS Data
    setChartData(prev => ({
      ...prev,
      iss: [...prev.iss.slice(-20), {
        time: now.toLocaleTimeString(),
        altitude: parseFloat(spaceData.iss?.altitude || 408),
        speed: 27600 + Math.random() * 100 - 50
      }],
      solar: [...prev.solar.slice(-20), {
        time: now.toLocaleTimeString(),
        activity: spaceWeather?.kpIndex || Math.random() * 5,
        wind: spaceWeather?.solarWindSpeed || 400
      }]
    }))
  }, [spaceData, spaceWeather])

  const renderChart = (data, color, label, unit) => (
    <div style={{
      height: 'clamp(150px, 25vw, 200px)',
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        {data.map((point, index) => {
          if (index === 0) return null
          const prevPoint = data[index - 1]
          const x1 = ((index - 1) / (data.length - 1)) * 100
          const x2 = (index / (data.length - 1)) * 100
          const value = activeChart === 'iss' ? point.altitude : point.activity
          const prevValue = activeChart === 'iss' ? prevPoint.altitude : prevPoint.activity
          const maxVal = activeChart === 'iss' ? 420 : 6
          const minVal = activeChart === 'iss' ? 400 : 0

          return (
            <g key={index}>
              <line
                x1={`${x1}%`}
                y1={`${100 - ((prevValue - minVal) / (maxVal - minVal)) * 80}%`}
                x2={`${x2}%`}
                y2={`${100 - ((value - minVal) / (maxVal - minVal)) * 80}%`}
                stroke={color}
                strokeWidth="clamp(2, 0.5vw, 3)"
                strokeLinecap="round"
              />
              <circle
                cx={`${x2}%`}
                cy={`${100 - ((value - minVal) / (maxVal - minVal)) * 80}%`}
                r="clamp(3, 0.8vw, 4)"
                fill={color}
              />
            </g>
          )
        })}
      </svg>

      <div style={{
        position: 'absolute',
        top: 'clamp(6px, 1.5vw, 8px)',
        left: 'clamp(6px, 1.5vw, 8px)',
        fontSize: 'clamp(10px, 2vw, 12px)',
        color: '#64748b',
        fontWeight: '600'
      }}>
        {label}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 'clamp(6px, 1.5vw, 8px)',
        right: 'clamp(6px, 1.5vw, 8px)',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        fontWeight: '700',
        color: color
      }}>
        {data.length > 0 && (
          activeChart === 'iss'
            ? `${data[data.length - 1]?.altitude} ${unit}`
            : `${data[data.length - 1]?.activity} ${unit}`
        )}
      </div>
    </div>
  )

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'clamp(12px, 3vw, 16px)',
      padding: 'clamp(16px, 4vw, 24px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      gridColumn: window.innerWidth < 1024 ? 'span 1' : 'span 2',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Responsive Header - Title on top, tabs below on mobile */}
      <div style={{
        marginBottom: 'clamp(16px, 4vw, 20px)'
      }}>
        {/* Title Row */}
        <h3 style={{
          margin: 0,
          marginBottom: window.innerWidth < 640 ? 'clamp(12px, 3vw, 16px)' : 0,
          fontSize: 'clamp(16px, 3.5vw, 20px)',
          fontWeight: '700',
          lineHeight: '1.2',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)'
        }}>
          📊 Live Data Analytics
        </h3>

        {/* Tab Navigation Row - Responsive layout */}
        <div style={{
          display: 'flex',
          justifyContent: window.innerWidth < 640 ? 'center' : 'flex-end',
          alignItems: 'center',
          marginTop: window.innerWidth < 640 ? 0 : 'clamp(-20px, -4vw, -16px)' // Negative margin to align with title on desktop
        }}>
          <div style={{
            display: 'flex',
            gap: 'clamp(2px, 0.5vw, 4px)',
            backgroundColor: '#f1f5f9',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            padding: 'clamp(2px, 0.5vw, 4px)'
          }}>
            {[
              { key: 'iss', label: '🛰️ ISS', color: '#3b82f6' },
              { key: 'solar', label: '☀️ Solar', color: '#f59e0b' },
              { key: 'launches', label: '🚀 Launches', color: '#10b981' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveChart(tab.key)}
                style={{
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 16px)',
                  backgroundColor: activeChart === tab.key ? 'white' : 'transparent',
                  color: activeChart === tab.key ? tab.color : '#64748b',
                  border: 'none',
                  borderRadius: 'clamp(4px, 1vw, 6px)',
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: activeChart === tab.key ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(3px, 0.8vw, 4px)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        padding: 'clamp(16px, 4vw, 20px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {activeChart === 'iss' && chartData.iss.length > 0 &&
          renderChart(chartData.iss, '#3b82f6', 'ISS Altitude', 'km')
        }

        {activeChart === 'solar' && chartData.solar.length > 0 &&
          renderChart(chartData.solar, '#f59e0b', 'Solar Activity (Kp Index)', '')
        }

        {activeChart === 'launches' && (
          <div style={{
            height: 'clamp(150px, 25vw, 200px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#64748b'
          }}>
            <div style={{
              fontSize: 'clamp(32px, 7vw, 48px)',
              marginBottom: 'clamp(12px, 3vw, 16px)'
            }}>🚀</div>
            <div style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              fontWeight: '600',
              marginBottom: 'clamp(6px, 1.5vw, 8px)',
              textAlign: 'center'
            }}>
              Launch Analytics
            </div>
            <div style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Next launch: {spaceData.nextLaunch?.name}<br/>
              T-{spaceData.nextLaunch?.daysUntil} days
            </div>
          </div>
        )}
      </div>

      {/* Responsive Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 480
          ? 'repeat(2, 1fr)'
          : window.innerWidth < 768
            ? 'repeat(3, 1fr)'
            : 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'clamp(10px, 2.5vw, 16px)',
        marginTop: 'clamp(16px, 4vw, 20px)'
      }}>
        <div style={{
          padding: 'clamp(8px, 2vw, 12px)',
          backgroundColor: '#eff6ff',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '700',
            color: '#3b82f6',
            lineHeight: '1.2'
          }}>
            {chartData.iss.length}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            lineHeight: '1.3'
          }}>
            Data Points
          </div>
        </div>

        <div style={{
          padding: 'clamp(8px, 2vw, 12px)',
          backgroundColor: '#fef3c7',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '700',
            color: '#f59e0b',
            lineHeight: '1.2'
          }}>
            {spaceWeather?.auroraChance || 45}%
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            lineHeight: '1.3'
          }}>
            Aurora Chance
          </div>
        </div>

        <div style={{
          padding: 'clamp(8px, 2vw, 12px)',
          backgroundColor: '#d1fae5',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '700',
            color: '#10b981',
            lineHeight: '1.2'
          }}>
            {spaceWeather?.solarWindSpeed || 420}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            lineHeight: '1.3'
          }}>
            Solar Wind km/s
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        /* Touch-friendly button interactions */
        button:hover {
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }

        /* SVG animations */
        circle {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        /* Mobile-specific optimizations */
        @media (max-width: 639px) {
          .charts-mobile {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default LiveCharts
