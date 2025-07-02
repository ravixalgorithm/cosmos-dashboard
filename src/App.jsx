import React, { useState, useEffect } from 'react'
import NavigationManager from './components/Navigation/NavigationManager' // NEW: Hybrid navigation
import SpaceHeroSection from './components/Hero/SpaceHeroSection'
import ImprovedSimpleDashboard from './components/Dashboard/ImprovedSimpleDashboard'
import UltimateDashboard from './components/Dashboard/UltimateSpaceDashboard'
import EnhancedStatusBar from './components/Dashboard/EnhancedStatusBar'
import DocumentationPortal from './components/Documentation/DocumentationPortal'
import SafeNotificationSystem from './components/Advanced/SafeNotificationSystem'
import SpaceLoader from './components/Loader/SpaceLoader'
import { useSpaceData } from './hooks/useSpaceData'

function App() {
  const [activeSection, setActiveSection] = useState('Home')
  const [useEnhancedMode, setUseEnhancedMode] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)

  const { spaceData, loading, lastUpdated, error } = useSpaceData()

  useEffect(() => {
    // Screen size detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Time interval
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Resize listener
    window.addEventListener('resize', checkMobile)

    // URL parameter handling
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')
    if (section) {
      const sectionMap = {
        'iss': 'Live ISS',
        'weather': 'Weather',
        'launches': 'Launches',
        'satellites': 'Satellites',
        'docs': 'Docs'
      }
      if (sectionMap[section]) {
        setActiveSection(sectionMap[section])
      }
    }

    return () => {
      clearInterval(timeInterval)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Calculate dynamic padding based on navigation mode
  const getContentPadding = () => {
    if (isMobile) {
      // Mobile: unified navigation (single nav height)
      return 'clamp(60px, 10vh, 70px)'
    } else {
      // Desktop/Tablet: dual navigation (two nav heights)
      if (activeSection === 'Docs') {
        return '70px' // Only TopNavigation for docs
      }
      return '130px' // TopNavigation (70px) + MainNavigation (60px)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Home':
        return <SpaceHeroSection setActiveSection={setActiveSection} />
      case 'Docs':
        return <DocumentationPortal />
      case 'API Docs':
        return <APIDocsSection currentTime={currentTime} />
      default:
        return (
          <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            paddingTop: getContentPadding(),
            padding: `${getContentPadding()} clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)`
          }}>
            {/* Enhanced Status Bar */}
            <EnhancedStatusBar
              useEnhancedMode={useEnhancedMode}
              setUseEnhancedMode={setUseEnhancedMode}
              lastUpdated={lastUpdated}
              currentTime={currentTime}
              loading={loading}
            />

            {/* Error State */}
            {error && (
              <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                marginBottom: 'clamp(16px, 4vw, 24px)',
                padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(8px, 2vw, 12px)'
              }}>
                <span style={{ fontSize: 'clamp(16px, 4vw, 20px)' }}>⚠️</span>
                <div>
                  <div style={{
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '600',
                    color: '#92400e'
                  }}>
                    Using Cached Space Data
                  </div>
                  <div style={{
                    fontSize: 'clamp(10px, 2vw, 12px)',
                    color: '#92400e'
                  }}>
                    Live updates will resume when connection is restored.
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Dashboard Content */}
            {useEnhancedMode ? (
              <UltimateDashboard
                activeSection={activeSection}
                onFallback={() => setUseEnhancedMode(false)}
              />
            ) : (
              <ImprovedSimpleDashboard activeSection={activeSection} />
            )}
          </div>
        )
    }
  }

  return (
    <SpaceLoader loading={loading} spaceData={spaceData}>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'white'
      }}>

        {/* NEW: Hybrid Navigation Manager */}
        <NavigationManager
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobile={isMobile}
        />

        {renderContent()}

        {/* Simple Notification System - No complex validation needed! */}
        {activeSection !== 'Home' &&
         activeSection !== 'API Docs' &&
         activeSection !== 'Docs' &&
         spaceData && (
          <SafeNotificationSystem
            spaceData={spaceData}
            spaceWeather={null}
          />
        )}

        {/* Global Styles */}
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes float-0 {
            0%, 100% { transform: translateY(0px) rotate(15deg); }
            50% { transform: translateY(-10px) rotate(15deg); }
          }

          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) rotate(-20deg); }
            50% { transform: translateY(-15px) rotate(-20deg); }
          }

          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) rotate(25deg); }
            50% { transform: translateY(-12px) rotate(25deg); }
          }

          @keyframes float-3 {
            0%, 100% { transform: translateY(0px) rotate(-15deg); }
            50% { transform: translateY(-8px) rotate(-15deg); }
          }

          html {
            scroll-behavior: smooth;
            -webkit-text-size-adjust: 100%;
          }

          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            touch-action: manipulation;
          }

          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }

          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          /* Mobile navigation specific styles */
          @media (max-width: 767px) {
            .mobile-nav-open {
              overflow: hidden;
            }
          }
        `}</style>
      </div>
    </SpaceLoader>
  )
}

const APIDocsSection = ({ currentTime }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      paddingTop: window.innerWidth < 768 ? 'clamp(60px, 10vh, 70px)' : '130px',
      padding: `${window.innerWidth < 768 ? 'clamp(60px, 10vh, 70px)' : '130px'} clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)`
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          padding: 'clamp(24px, 6vw, 40px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', marginBottom: 'clamp(12px, 3vw, 16px)' }}>🚀</div>
          <h2 style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: '800',
            margin: 0,
            marginBottom: 'clamp(12px, 3vw, 16px)',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            COSMOS System Status
          </h2>
          <p style={{
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            color: '#64748b',
            margin: '0 0 clamp(16px, 4vw, 24px) 0',
            lineHeight: '1.6'
          }}>
            Space Dashboard with Elegant Loader • Built by{' '}
            <span style={{ fontWeight: '700', color: '#3b82f6' }}>ravixalgorithm</span>{' '}
            • {currentTime.toLocaleDateString()} • Live at {currentTime.toLocaleTimeString()} UTC
          </p>
          <div style={{
            padding: 'clamp(16px, 4vw, 24px)',
            backgroundColor: '#f0f9ff',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            border: '1px solid #0ea5e9'
          }}>
            <div style={{
              fontSize: 'clamp(12px, 3vw, 16px)',
              fontWeight: '600',
              color: '#0369a1',
              lineHeight: '1.6'
            }}>
              ✅ Beautiful space-themed loader implemented<br/>
              ✅ Clean, simple data protection<br/>
              ✅ Orbital animations with Earth & ISS<br/>
              ✅ Progressive loading steps<br/>
              ✅ No complex validation needed<br/>
              ✅ 100% user-friendly experience
            </div>
          </div>

          <div style={{
            marginTop: 'clamp(16px, 4vw, 24px)',
            padding: 'clamp(12px, 3vw, 16px)',
            backgroundColor: '#ecfdf5',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            border: '1px solid #10b981'
          }}>
            <div style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '600',
              color: '#065f46'
            }}>
              🎯 Smart Solution: Loader prevents all errors elegantly!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
