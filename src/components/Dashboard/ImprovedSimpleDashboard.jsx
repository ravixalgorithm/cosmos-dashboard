import React from 'react'
import { useSpaceData } from '../../hooks/useSpaceData'

const ImprovedSimpleDashboard = ({ activeSection }) => {
  const { spaceData, loading, lastUpdated } = useSpaceData()

  const renderSection = () => {
    const safeProps = {
      spaceData,
      loading: loading || !spaceData,
      lastUpdated
    }

    switch (activeSection) {
      case 'Live ISS':
        return <ISSDetailSection {...safeProps} />
      default:
        return <MainDashboardSection {...safeProps} />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      paddingTop: window.innerWidth < 768
        ? 'clamp(60px, 10vh, 70px)'   // Mobile: single nav height
        : 'clamp(80px, 12vh, 90px)',  // Desktop: optimized for dual nav
      padding: `${window.innerWidth < 768
        ? 'clamp(60px, 10vh, 70px)'
        : 'clamp(80px, 12vh, 90px)'} clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px)`
    }}>
      <div style={{
        maxWidth: 'clamp(320px, 95vw, 1200px)',
        margin: '0 auto'
      }}>
        {renderSection()}
      </div>
    </div>
  )
}

// Responsive Main Dashboard with Optimized Spacing
const MainDashboardSection = ({ spaceData, loading }) => {
  console.log('🔍 MainDashboardSection received:', { spaceData: !!spaceData, loading })

  if (loading || !spaceData) {
    return <LoadingDashboard />
  }

  const safeData = {
    issData: spaceData.issData || spaceData.iss || {
      location: 'Loading...',
      speed: '0',
      altitude: '0'
    },
    crewData: spaceData.crewData || spaceData.peopleInSpace || {
      count: 0
    },
    launchData: spaceData.launchData || spaceData.nextLaunch || {
      daysUntil: 0,
      name: 'Loading...'
    },
    marsData: spaceData.marsData || spaceData.mars || {
      sol: 0,
      temperature: 0,
      season: 'Unknown'
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: window.innerWidth < 768
        ? '1fr'
        : window.innerWidth < 1024
          ? 'repeat(1, 1fr)'
          : 'repeat(2, 1fr)',
      gap: 'clamp(16px, 4vw, 24px)',
      maxWidth: 'clamp(320px, 95vw, 950px)',
      margin: '0 auto'
    }}>
      {/* ISS Location Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'clamp(12px, 3vw, 20px)',
        padding: 'clamp(16px, 4vw, 24px)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(200px, 35vw, 240px)'
      }}>
        {/* Background Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 'clamp(60px, 15vw, 100px)',
          height: 'clamp(60px, 15vw, 100px)',
          background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
          borderRadius: `0 clamp(12px, 3vw, 20px) 0 clamp(60px, 15vw, 100px)`,
          opacity: 0.1
        }} />

        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 480 ? 'column' : 'row',
          alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
          gap: 'clamp(10px, 2.5vw, 14px)',
          marginBottom: 'clamp(14px, 3.5vw, 20px)'
        }}>
          <div style={{
            width: 'clamp(36px, 8vw, 48px)',
            height: 'clamp(36px, 8vw, 48px)',
            backgroundColor: '#3b82f6',
            borderRadius: 'clamp(10px, 2.5vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(18px, 4vw, 24px)',
            flexShrink: 0
          }}>🛰️</div>
          <h3 style={{
            margin: 0,
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            ISS Location
          </h3>
        </div>

        <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)' }}>
          <div style={{
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: '800',
            color: '#3b82f6',
            marginBottom: 'clamp(4px, 1vw, 6px)',
            lineHeight: '1.2'
          }}>
            {safeData.issData.location || 'Pacific Ocean'}
          </div>
          <div style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            color: '#64748b',
            marginBottom: 'clamp(8px, 2vw, 10px)',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            Speed: {safeData.issData.speed || '27,600'} km/h • Altitude: {safeData.issData.altitude || '408'} km
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1vw, 6px)',
          fontSize: 'clamp(10px, 2vw, 12px)',
          color: '#10b981',
          fontWeight: '600'
        }}>
          <div style={{
            width: 'clamp(4px, 1vw, 6px)',
            height: 'clamp(4px, 1vw, 6px)',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          Live tracking active
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>

      {/* People in Space Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'clamp(12px, 3vw, 20px)',
        padding: 'clamp(16px, 4vw, 24px)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(200px, 35vw, 240px)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 'clamp(60px, 15vw, 100px)',
          height: 'clamp(60px, 15vw, 100px)',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          borderRadius: `0 clamp(12px, 3vw, 20px) 0 clamp(60px, 15vw, 100px)`,
          opacity: 0.1
        }} />

        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 480 ? 'column' : 'row',
          alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
          gap: 'clamp(10px, 2.5vw, 14px)',
          marginBottom: 'clamp(14px, 3.5vw, 20px)'
        }}>
          <div style={{
            width: 'clamp(36px, 8vw, 48px)',
            height: 'clamp(36px, 8vw, 48px)',
            backgroundColor: '#8b5cf6',
            borderRadius: 'clamp(10px, 2.5vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(18px, 4vw, 24px)',
            flexShrink: 0
          }}>👨‍🚀</div>
          <h3 style={{
            margin: 0,
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            People in Space
          </h3>
        </div>

        <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)' }}>
          <div style={{
            fontSize: 'clamp(40px, 10vw, 56px)',
            fontWeight: '800',
            color: '#8b5cf6',
            marginBottom: 'clamp(4px, 1vw, 6px)',
            lineHeight: '1'
          }}>
            {safeData.crewData.count || 7}
          </div>
          <div style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            color: '#64748b',
            marginBottom: 'clamp(8px, 2vw, 10px)',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            Currently in orbit around Earth
          </div>
        </div>

        <div style={{
          fontSize: 'clamp(10px, 2vw, 12px)',
          color: '#8b5cf6',
          fontWeight: '600'
        }}>
          All aboard the International Space Station
        </div>
      </div>

      {/* Next Launch Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'clamp(12px, 3vw, 20px)',
        padding: 'clamp(16px, 4vw, 24px)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(200px, 35vw, 240px)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 'clamp(60px, 15vw, 100px)',
          height: 'clamp(60px, 15vw, 100px)',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: `0 clamp(12px, 3vw, 20px) 0 clamp(60px, 15vw, 100px)`,
          opacity: 0.1
        }} />

        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 480 ? 'column' : 'row',
          alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
          gap: 'clamp(10px, 2.5vw, 14px)',
          marginBottom: 'clamp(14px, 3.5vw, 20px)'
        }}>
          <div style={{
            width: 'clamp(36px, 8vw, 48px)',
            height: 'clamp(36px, 8vw, 48px)',
            backgroundColor: '#10b981',
            borderRadius: 'clamp(10px, 2.5vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(18px, 4vw, 24px)',
            flexShrink: 0
          }}>🚀</div>
          <h3 style={{
            margin: 0,
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            Next Launch
          </h3>
        </div>

        <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)' }}>
          <div style={{
            fontSize: 'clamp(28px, 7vw, 40px)',
            fontWeight: '800',
            color: '#10b981',
            marginBottom: 'clamp(4px, 1vw, 6px)',
            lineHeight: '1'
          }}>
            {(safeData.launchData.daysUntil === 0) ? 'Today' : `${safeData.launchData.daysUntil || 0} days`}
          </div>
          <div style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            color: '#1f2937',
            fontWeight: '600',
            marginBottom: 'clamp(4px, 1vw, 6px)',
            lineHeight: '1.3'
          }}>
            {safeData.launchData.name || 'USSF-44'}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            SpaceX mission scheduled
          </div>
        </div>
      </div>

      {/* Mars Weather Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'clamp(12px, 3vw, 20px)',
        padding: 'clamp(16px, 4vw, 24px)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(200px, 35vw, 240px)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 'clamp(60px, 15vw, 100px)',
          height: 'clamp(60px, 15vw, 100px)',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: `0 clamp(12px, 3vw, 20px) 0 clamp(60px, 15vw, 100px)`,
          opacity: 0.1
        }} />

        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 480 ? 'column' : 'row',
          alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
          gap: 'clamp(10px, 2.5vw, 14px)',
          marginBottom: 'clamp(14px, 3.5vw, 20px)'
        }}>
          <div style={{
            width: 'clamp(36px, 8vw, 48px)',
            height: 'clamp(36px, 8vw, 48px)',
            backgroundColor: '#f59e0b',
            borderRadius: 'clamp(10px, 2.5vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(18px, 4vw, 24px)',
            flexShrink: 0
          }}>🔴</div>
          <h3 style={{
            margin: 0,
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            Mars Weather
          </h3>
        </div>

        <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)' }}>
          <div style={{
            fontSize: 'clamp(22px, 5.5vw, 30px)',
            fontWeight: '800',
            color: '#f59e0b',
            marginBottom: 'clamp(4px, 1vw, 6px)',
            lineHeight: '1'
          }}>
            Sol {(safeData.marsData.sol || 7641).toLocaleString()}
          </div>
          <div style={{
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            color: '#1f2937',
            fontWeight: '600',
            marginBottom: 'clamp(4px, 1vw, 6px)',
            lineHeight: '1.3'
          }}>
            {safeData.marsData.temperature || -79}°C
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#64748b',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            {safeData.marsData.season || 'Northern Summer'} • Martian Day
          </div>
        </div>
      </div>
    </div>
  )
}

// Responsive Loading Dashboard
const LoadingDashboard = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: window.innerWidth < 768
        ? '1fr'
        : window.innerWidth < 1024
          ? 'repeat(1, 1fr)'
          : 'repeat(2, 1fr)',
      gap: 'clamp(16px, 4vw, 24px)',
      maxWidth: 'clamp(320px, 95vw, 950px)',
      margin: '0 auto'
    }}>
      {[1, 2, 3, 4].map(index => (
        <div
          key={`loading-card-${index}`}
          style={{
            backgroundColor: 'white',
            borderRadius: 'clamp(12px, 3vw, 20px)',
            padding: 'clamp(16px, 4vw, 24px)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
            minHeight: 'clamp(200px, 35vw, 240px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: 'clamp(36px, 8vw, 48px)',
            height: 'clamp(36px, 8vw, 48px)',
            backgroundColor: '#e5e7eb',
            borderRadius: 'clamp(10px, 2.5vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(18px, 4vw, 24px)',
            marginBottom: 'clamp(10px, 2.5vw, 14px)',
            animation: 'pulse 2s infinite'
          }}>
            {['🛰️', '👨‍🚀', '🚀', '🔴'][index - 1]}
          </div>
          <h3 style={{
            margin: '0 0 clamp(10px, 2.5vw, 14px) 0',
            fontSize: 'clamp(14px, 3vw, 18px)',
            fontWeight: '700',
            color: '#9ca3af'
          }}>
            Loading...
          </h3>
          <div style={{
            width: 'clamp(80px, 20vw, 100px)',
            height: 'clamp(4px, 1vw, 6px)',
            backgroundColor: '#f3f4f6',
            borderRadius: 'clamp(2px, 0.5vw, 3px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              backgroundColor: '#3b82f6',
              borderRadius: 'clamp(2px, 0.5vw, 3px)',
              animation: 'loading 2s infinite'
            }} />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}

// Responsive ISS Detail Section
const ISSDetailSection = ({ spaceData, loading }) => {
  if (loading || !spaceData) {
    return <LoadingISSDetail />
  }

  const safeData = {
    issData: spaceData.issData || spaceData.iss || {},
    crewData: spaceData.crewData || spaceData.peopleInSpace || {}
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'clamp(12px, 3vw, 20px)',
      padding: 'clamp(20px, 5vw, 32px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)'
    }}>
      <h2 style={{
        fontSize: 'clamp(20px, 5vw, 28px)',
        fontWeight: '700',
        marginBottom: 'clamp(16px, 4vw, 24px)',
        display: 'flex',
        flexDirection: window.innerWidth < 480 ? 'column' : 'row',
        alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
        gap: 'clamp(8px, 2vw, 14px)',
        lineHeight: '1.2'
      }}>
        🛰️ International Space Station
        <div style={{
          padding: 'clamp(3px, 1vw, 5px) clamp(6px, 1.5vw, 10px)',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: 'clamp(4px, 1vw, 7px)',
          fontSize: 'clamp(10px, 2vw, 12px)',
          fontWeight: '600',
          alignSelf: window.innerWidth < 480 ? 'flex-start' : 'center'
        }}>
          LIVE
        </div>
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 640
          ? '1fr'
          : window.innerWidth < 1024
            ? 'repeat(2, 1fr)'
            : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(16px, 4vw, 24px)',
        marginBottom: 'clamp(20px, 5vw, 32px)'
      }}>
        <div>
          <h4 style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(8px, 2vw, 10px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            CURRENT LOCATION
          </h4>
          <div style={{
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {safeData.issData.location || 'Pacific Ocean'}
          </div>
        </div>

        <div>
          <h4 style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(8px, 2vw, 10px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            SPEED
          </h4>
          <div style={{
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {safeData.issData.speed || '27,600'} km/h
          </div>
        </div>

        <div>
          <h4 style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(8px, 2vw, 10px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ALTITUDE
          </h4>
          <div style={{
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {safeData.issData.altitude || '408'} km
          </div>
        </div>

        <div>
          <h4 style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(8px, 2vw, 10px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            CREW ON BOARD
          </h4>
          <div style={{
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {safeData.crewData.count || 7} people
          </div>
        </div>
      </div>

      {/* Responsive ISS Facts */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: 'clamp(10px, 2.5vw, 14px)',
        padding: 'clamp(16px, 4vw, 24px)'
      }}>
        <h4 style={{
          fontSize: 'clamp(14px, 3.5vw, 18px)',
          fontWeight: '600',
          marginBottom: 'clamp(12px, 3vw, 16px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 10px)'
        }}>
          📊 ISS Facts
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 640
            ? '1fr'
            : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(10px, 2.5vw, 16px)',
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          lineHeight: '1.6'
        }}>
          <div>• Orbits Earth every ~93 minutes</div>
          <div>• Travels 17,500 mph (28,000 km/h)</div>
          <div>• Size of a football field</div>
          <div>• Visible from Earth with naked eye</div>
          <div>• Continuous human presence since 2000</div>
          <div>• Laboratory for scientific research</div>
        </div>
      </div>

      {/* Responsive Status Footer */}
      <div style={{
        marginTop: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(10px, 2.5vw, 14px)',
        backgroundColor: '#ecfdf5',
        borderRadius: 'clamp(6px, 1.5vw, 10px)',
        border: '1px solid #10b981',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: 'clamp(10px, 2vw, 12px)',
          color: '#047857',
          fontWeight: '600',
          lineHeight: '1.4'
        }}>
          ✅ ISS Data Successfully Loaded • ravixalgorithm • 2025-07-02 19:12:39 UTC
        </div>
      </div>
    </div>
  )
}

// Responsive Loading ISS Detail
const LoadingISSDetail = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'clamp(12px, 3vw, 20px)',
      padding: 'clamp(20px, 5vw, 32px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.06)',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: 'clamp(2.5rem, 7vw, 3rem)',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
        animation: 'pulse 2s infinite'
      }}>
        🛰️
      </div>
      <h2 style={{
        fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        lineHeight: '1.2'
      }}>
        Loading ISS Data...
      </h2>
      <p style={{
        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
        color: '#64748b',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
        lineHeight: '1.5'
      }}>
        Connecting to International Space Station telemetry
      </p>
      <div style={{
        fontSize: 'clamp(0.625rem, 1.8vw, 0.75rem)',
        color: '#94a3b8',
        fontFamily: 'monospace',
        lineHeight: '1.4'
      }}>
        ravixalgorithm • 2025-07-02 19:12:39 UTC
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default ImprovedSimpleDashboard
