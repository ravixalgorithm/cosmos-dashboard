import React from 'react'
import { useSpaceData } from '../../hooks/useSpaceData'

const SpaceHeroSection = ({ setActiveSection }) => {
  const { spaceData, loading, lastUpdated } = useSpaceData()

  // Simple, clean data access (loader ensures spaceData exists)
  const safeSpaceData = {
    iss: {
      location: spaceData?.iss?.location || 'Pacific Ocean',
      speed: spaceData?.iss?.speed || '27,600',
      altitude: spaceData?.iss?.altitude || '408'
    },
    peopleInSpace: {
      count: spaceData?.peopleInSpace?.count || 7
    },
    nextLaunch: {
      daysUntil: spaceData?.nextLaunch?.daysUntil || 0,
      name: spaceData?.nextLaunch?.name || 'USSF-44'
    },
    mars: {
      sol: spaceData?.mars?.sol || 7641,
      temperature: spaceData?.mars?.temperature || -79
    }
  }

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: 'white',
      padding: 'clamp(16px, 4vw, 32px)',
      paddingTop: 'clamp(100px, 15vh, 140px)',
      overflow: 'hidden'
    }}>

      {/* Main COSMOS Text - Protected Zone */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        marginBottom: 'clamp(20px, 5vh, 40px)',
        zIndex: 10,
        padding: 'clamp(30px, 8vw, 60px) clamp(20px, 10vw, 80px)',
        background: 'radial-gradient(ellipse clamp(400px, 50vw, 800px) clamp(200px, 25vh, 400px) at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
        borderRadius: 'clamp(25px, 6vw, 50px)',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 15vw, 16rem)',
          fontWeight: '900',
          color: 'black',
          letterSpacing: '-0.04em',
          lineHeight: '0.85',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          position: 'relative',
          margin: 0,
          textShadow: '0 4px 8px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          COSMOS
        </h1>

        {/* Space Data Cubes - Positioned responsively */}
        <SpaceDataCubes spaceData={safeSpaceData} />
      </div>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(16px, 4vw, 20px)',
        color: '#64748b',
        fontWeight: '500',
        marginBottom: 'clamp(30px, 6vh, 50px)',
        maxWidth: 'min(700px, 90vw)',
        textAlign: 'center',
        lineHeight: '1.6',
        zIndex: 10,
        position: 'relative',
        padding: '0 clamp(16px, 4vw, 32px)'
      }}>
        Real-time space data dashboard powered by NASA, SpaceX, and satellite APIs
      </p>

      {/* Simple CTA Button */}
      <button
        onClick={() => setActiveSection('Dashboard')}
        style={{
          backgroundColor: 'black',
          color: 'white',
          padding: 'clamp(14px, 3vw, 18px) clamp(24px, 6vw, 40px)',
          borderRadius: 'clamp(25px, 6vw, 50px)',
          fontSize: 'clamp(14px, 3.5vw, 18px)',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s',
          boxShadow: '0 6px 20px 0 rgba(0,0,0,0.25)',
          transform: 'translateY(0)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 12px)',
          zIndex: 10,
          position: 'relative',
          margin: '0 auto'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 8px 25px 0 rgba(0,0,0,0.3)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 6px 20px 0 rgba(0,0,0,0.25)'
        }}
      >
        Explore Space Data
        <span>🚀</span>
      </button>

      {/* Live Stats */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(20px, 4vh, 40px)',
        left: 'clamp(20px, 4vw, 40px)',
        right: 'clamp(20px, 4vw, 40px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(12px, 3vw, 20px)',
        zIndex: 10
      }}>
        <div style={{
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)',
          flex: '1',
          minWidth: 'min(300px, 100%)'
        }}>
          <div style={{
            width: 'clamp(6px, 1.5vw, 8px)',
            height: 'clamp(6px, 1.5vw, 8px)',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            flexShrink: 0
          }} />
          <span style={{
            whiteSpace: window.innerWidth < 768 ? 'nowrap' : 'normal',
            overflow: window.innerWidth < 768 ? 'hidden' : 'visible',
            textOverflow: window.innerWidth < 768 ? 'ellipsis' : 'initial'
          }}>
            Live: ISS at {safeSpaceData.iss.location} • {safeSpaceData.peopleInSpace.count} people in space
          </span>
          {lastUpdated && window.innerWidth >= 768 && (
            <span style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#cbd5e1' }}>
              • Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: 'clamp(16px, 3vw, 24px)',
          flexShrink: 0
        }}>
          <button
            onClick={() => window.open('https://github.com/ravixalgorithm/cosmos-dashboard', '_blank')}
            style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              color: '#64748b',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'color 0.2s',
              padding: 'clamp(4px, 1vw, 8px)'
            }}
            onMouseEnter={(e) => e.target.style.color = '#000'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            GitHub
          </button>
          <button
            onClick={() => setActiveSection('Dashboard')}
            style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              color: '#64748b',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'color 0.2s',
              padding: 'clamp(4px, 1vw, 8px)'
            }}
            onMouseEnter={(e) => e.target.style.color = '#000'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            API Status
          </button>
          <button
            onClick={() => setActiveSection('Docs')}
            style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              color: '#64748b',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'color 0.2s',
              padding: 'clamp(4px, 1vw, 8px)'
            }}
            onMouseEnter={(e) => e.target.style.color = '#000'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            Docs
          </button>
        </div>
      </div>

      {/* Enhanced responsive keyframe animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(8deg); }
          50% { transform: translateY(clamp(-4px, -1.5vw, -8px)) rotate(8deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(clamp(-6px, -2vw, -12px)) rotate(-10deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(clamp(-5px, -1.8vw, -10px)) rotate(12deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(clamp(-3px, -1.2vw, -6px)) rotate(-8deg); }
        }

        /* Mobile specific optimizations */
        @media (max-width: 768px) {
          .space-data-cubes {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .live-stats-text {
            font-size: 11px !important;
          }
        }
      `}</style>
    </section>
  )
}

const SpaceDataCubes = ({ spaceData }) => {
  const cubes = [
    {
      label: 'ISS Speed',
      value: spaceData.iss.speed,
      unit: 'km/h',
      position: {
        top: 'clamp(20%, 25vw, 30%)',
        left: 'clamp(5%, 12vw, 15%)'
      },
      color: '#3b82f6',
      rotation: '8deg'
    },
    {
      label: 'People in Space',
      value: spaceData.peopleInSpace.count.toString(),
      unit: 'Astronauts',
      position: {
        top: 'clamp(15%, 20vw, 25%)',
        right: 'clamp(8%, 15vw, 18%)'
      },
      color: '#8b5cf6',
      rotation: '-10deg'
    },
    {
      label: 'Mars Sol',
      value: spaceData.mars.sol.toLocaleString(),
      unit: `${spaceData.mars.temperature}°C`,
      position: {
        bottom: 'clamp(15%, 18vw, 20%)',
        left: 'clamp(2%, 8vw, 10%)'
      },
      color: '#f59e0b',
      rotation: '12deg'
    },
    {
      label: 'Next Launch',
      value: spaceData.nextLaunch.daysUntil.toString(),
      unit: 'Days',
      position: {
        bottom: 'clamp(10%, 12vw, 15%)',
        right: 'clamp(6%, 12vw, 15%)'
      },
      color: '#10b981',
      rotation: '-8deg'
    }
  ]

  return (
    <div
      className="space-data-cubes"
      style={{
        position: 'absolute',
        inset: 'clamp(-50px, -10vw, -100px)',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {cubes.map((cube, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            ...cube.position,
            pointerEvents: 'auto',
            display: window.innerWidth < 768 ? 'none' : 'block' // Hide on mobile
          }}
        >
          <div style={{
            backgroundColor: 'white',
            border: `clamp(1px, 0.3vw, 2px) solid ${cube.color}`,
            borderRadius: 'clamp(6px, 1.5vw, 10px)',
            padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 14px)',
            minWidth: 'clamp(60px, 12vw, 90px)',
            textAlign: 'center',
            boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
            transform: `rotate(${cube.rotation})`,
            animation: `float-${index} ${6 + index}s ease-in-out infinite`,
            backdropFilter: 'blur(6px)',
            transition: 'transform 0.3s ease',
            opacity: 0.9
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = `rotate(${cube.rotation}) scale(1.05)`
            e.target.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = `rotate(${cube.rotation}) scale(1)`
            e.target.style.opacity = '0.9'
          }}>
            <div style={{
              fontSize: 'clamp(6px, 1.2vw, 8px)',
              color: '#64748b',
              fontWeight: '600',
              marginBottom: 'clamp(2px, 0.5vw, 3px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {cube.label}
            </div>
            <div style={{
              fontSize: 'clamp(12px, 2.5vw, 16px)',
              fontWeight: '900',
              color: cube.color,
              lineHeight: '1',
              marginBottom: 'clamp(1px, 0.3vw, 2px)'
            }}>
              {cube.value}
            </div>
            <div style={{
              fontSize: 'clamp(7px, 1.4vw, 9px)',
              color: '#94a3b8',
              fontWeight: '600'
            }}>
              {cube.unit}
            </div>

            <div style={{
              position: 'absolute',
              top: 'clamp(2px, 0.5vw, 4px)',
              right: 'clamp(2px, 0.5vw, 4px)',
              width: 'clamp(3px, 0.6vw, 4px)',
              height: 'clamp(3px, 0.6vw, 4px)',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SpaceHeroSection
