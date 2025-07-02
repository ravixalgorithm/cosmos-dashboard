import React, { useState, useEffect } from 'react'
import { useSpaceData } from '../../hooks/useSpaceData'
import { getAdvancedISSData, getSpaceWeatherAdvanced, getNEOData, getSatelliteData } from '../../utils/advancedSpaceApis'
import EarthTracker from '../Advanced/EarthTracker'
import LiveCharts from '../Advanced/LiveCharts'
import SpaceGallery from '../Advanced/SpaceGallery'

const UltimateSpaceDashboard = ({ activeSection, onFallback }) => {
  const { spaceData, loading, lastUpdated } = useSpaceData()
  const [advancedData, setAdvancedData] = useState({
    issAdvanced: null,
    weatherAdvanced: null,
    neoAdvanced: null,
    satelliteAdvanced: null
  })

  // Debug logging with unique identifiers
  useEffect(() => {
    console.log('🔍 UltimateSpaceDashboard state:', {
      spaceData: !!spaceData,
      loading,
      activeSection,
      timestamp: '2025-07-02 20:54:39',
      dataUpdateId: spaceData?.updateId
    })
  }, [spaceData?.updateId, loading, activeSection])

  useEffect(() => {
    const fetchAdvancedData = () => {
      try {
        const timestamp = Date.now()
        setAdvancedData({
          issAdvanced: { ...getAdvancedISSData(), id: 'advanced-iss-' + timestamp },
          weatherAdvanced: { ...getSpaceWeatherAdvanced(), id: 'advanced-weather-' + timestamp },
          neoAdvanced: { ...getNEOData(), id: 'advanced-neo-' + timestamp },
          satelliteAdvanced: { ...getSatelliteData(), id: 'advanced-satellites-' + timestamp }
        })
        console.log('✅ Advanced data updated with unique IDs at', new Date().toISOString())
      } catch (error) {
        console.error('🚨 Enhanced data fetch failed:', error)
        if (onFallback) onFallback()
      }
    }

    fetchAdvancedData()
    const dataInterval = setInterval(fetchAdvancedData, 60000)

    return () => clearInterval(dataInterval)
  }, [onFallback])

  const renderDashboardContent = () => {
    if (loading || !spaceData) {
      return <LoadingView key="loading-view" />
    }

    const contentKey = `${activeSection}-${spaceData.updateId}`

    switch (activeSection) {
      case 'Live ISS':
        return <ISSDetailView key={contentKey} spaceData={spaceData} advancedData={advancedData} />
      case 'Weather':
        return <SpaceWeatherView key={contentKey} advancedData={advancedData} />
      case 'Satellites':
        return <SatellitesView key={contentKey} advancedData={advancedData} />
      default:
        return <MainEnhancedView key={contentKey} spaceData={spaceData} advancedData={advancedData} />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      paddingTop: window.innerWidth < 768
        ? 'clamp(60px, 10vh, 70px)'
        : 'clamp(80px, 12vh, 90px)',
      padding: `${window.innerWidth < 768
        ? 'clamp(60px, 10vh, 70px)'
        : 'clamp(80px, 12vh, 90px)'} ${window.innerWidth < 768 ? '16px' : '32px'} ${window.innerWidth < 768 ? '20px' : '32px'}`,
      boxSizing: 'border-box',
      width: '100%'
    }}>
      <div style={{
        maxWidth: window.innerWidth < 768 ? '100%' : '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {renderDashboardContent()}
      </div>
    </div>
  )
}

// Fixed Loading View - NO ANIMATIONS
const LoadingView = () => {
  return (
    <div key="cosmos-loader" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'clamp(40vh, 50vh, 55vh)',
      textAlign: 'center',
      padding: 'clamp(16px, 4vw, 24px)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
        // REMOVED: animation: 'pulse 2s infinite'
      }}>
        🚀
      </div>
      <h2 style={{
        fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        lineHeight: '1.2',
        fontFamily: "'Inter', sans-serif"
      }}>
        Loading COSMOS Data...
      </h2>
      <p style={{
        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
        color: '#64748b',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
        maxWidth: '90%',
        fontFamily: "'Inter', sans-serif"
      }}>
        Fetching real-time space information
      </p>
      <div style={{
        fontSize: 'clamp(0.625rem, 1.8vw, 0.75rem)',
        color: '#94a3b8',
        fontFamily: "'JetBrains Mono', monospace",
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        ravixalgorithm • 2025-07-02 20:54:39 UTC
      </div>
    </div>
  )
}

// Main Enhanced View - NO ANIMATIONS
const MainEnhancedView = ({ spaceData, advancedData }) => {
  if (!spaceData) {
    console.error('🚨 MainEnhancedView: spaceData is null!')
    return <DataErrorView key="error-view" />
  }

  const safeSpaceData = {
    iss: spaceData.issData || { location: 'Unknown', speed: '0', altitude: '0' },
    peopleInSpace: spaceData.crewData || { count: 0 },
    nextLaunch: spaceData.launchData || { daysUntil: 0, name: 'Unknown' },
    mars: spaceData.marsData || { sol: 0, temperature: 0 }
  }

  const safeAdvancedData = {
    iss: advancedData.issAdvanced || {},
    spaceWeather: advancedData.weatherAdvanced || {},
    satellites: advancedData.satelliteAdvanced || {}
  }

  console.log('✅ MainEnhancedView: Rendering with safe data and unique keys')

  // Mobile Layout
  if (window.innerWidth < 768) {
    return (
      <div key={`main-view-mobile-${spaceData.updateId}`} style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Mobile: Earth Tracker */}
        <div key={`earth-tracker-mobile-${spaceData.updateId}`}>
          <EarthTracker issData={safeAdvancedData.iss || safeSpaceData.iss} />
        </div>

        {/* Mobile: Quick Stats */}
        <div key={`quick-stats-mobile-${spaceData.updateId}`} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <QuickStatsCard
            key={`iss-status-mobile-${spaceData.updateId}`}
            title="ISS Status"
            icon="🛰️"
            value={safeAdvancedData.iss?.region || safeSpaceData.iss.location}
            subtitle={`${safeSpaceData.iss.speed} km/h • ${safeAdvancedData.iss?.altitude || safeSpaceData.iss.altitude} km`}
            color="#3b82f6"
            size="compact"
          />
          <QuickStatsCard
            key={`crew-count-mobile-${spaceData.updateId}`}
            title="Crew"
            icon="👨‍🚀"
            value={safeSpaceData.peopleInSpace.count.toString()}
            subtitle="People in Space"
            color="#8b5cf6"
            size="compact"
          />
        </div>

        {/* Mobile: Live Charts */}
        <div key={`charts-mobile-${spaceData.updateId}`}>
          <LiveCharts
            spaceData={safeSpaceData}
            spaceWeather={safeAdvancedData.spaceWeather}
          />
        </div>

        {/* Mobile: Data Cards */}
        <div key={`data-cards-mobile-${spaceData.updateId}`} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <QuickStatsCard
            key={`space-weather-mobile-${spaceData.updateId}`}
            title="Space Weather"
            icon="☀️"
            value={safeAdvancedData.spaceWeather?.level || 'Quiet'}
            subtitle={`${safeAdvancedData.spaceWeather?.auroraChance || 0}% Aurora • Kp ${safeAdvancedData.spaceWeather?.kpIndex || '0.0'}`}
            color={safeAdvancedData.spaceWeather?.color || '#f59e0b'}
            size="compact"
          />
          <QuickStatsCard
            key={`satellites-mobile-${spaceData.updateId}`}
            title="Active Satellites"
            icon="📡"
            value={(safeAdvancedData.satellites?.total || 8647).toLocaleString()}
            subtitle={`${(safeAdvancedData.satellites?.starlink || 5000).toLocaleString()} Starlink`}
            color="#10b981"
            size="compact"
          />
          <QuickStatsCard
            key={`next-launch-mobile-${spaceData.updateId}`}
            title="Next Launch"
            icon="🚀"
            value={`T-${safeSpaceData.nextLaunch.daysUntil || 0}`}
            subtitle={safeSpaceData.nextLaunch.name || 'Unknown Mission'}
            color="#10b981"
            size="compact"
          />
          <QuickStatsCard
            key={`mars-sol-mobile-${spaceData.updateId}`}
            title="Mars Sol"
            icon="🔴"
            value={`Sol ${(safeSpaceData.mars.sol || 0).toLocaleString()}`}
            subtitle={`${safeSpaceData.mars.temperature || 0}°C`}
            color="#f59e0b"
            size="compact"
          />
        </div>

        {/* Mobile: Space Gallery */}
        <div key={`gallery-mobile-${spaceData.updateId}`}>
          <SpaceGallery />
        </div>
      </div>
    )
  }

  // Desktop Layout (768px+) - NO ANIMATIONS
  return (
    <div key={`main-view-desktop-${spaceData.updateId}`} style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Desktop: Top Row - Earth Tracker + Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 1200 ? '2fr 1fr' : '3fr 1fr',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Earth Tracker */}
        <div key={`earth-tracker-desktop-${spaceData.updateId}`}>
          <EarthTracker issData={safeAdvancedData.iss || safeSpaceData.iss} />
        </div>

        {/* Desktop: Quick Stats - Vertical Layout */}
        <div key={`quick-stats-desktop-${spaceData.updateId}`} style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px'
        }}>
          <QuickStatsCard
            key={`iss-status-desktop-${spaceData.updateId}`}
            title="ISS Status"
            icon="🛰️"
            value={safeAdvancedData.iss?.region || safeSpaceData.iss.location}
            subtitle={`${safeSpaceData.iss.speed} km/h • ${safeAdvancedData.iss?.altitude || safeSpaceData.iss.altitude} km`}
            color="#3b82f6"
            size="medium"
          />
          <QuickStatsCard
            key={`crew-count-desktop-${spaceData.updateId}`}
            title="Crew"
            icon="👨‍🚀"
            value={safeSpaceData.peopleInSpace.count.toString()}
            subtitle="People in Space"
            color="#8b5cf6"
            size="medium"
          />
        </div>
      </div>

      {/* Desktop: Middle Row - Live Charts (Full Width) */}
      <div key={`charts-desktop-${spaceData.updateId}`}>
        <LiveCharts
          spaceData={safeSpaceData}
          spaceWeather={safeAdvancedData.spaceWeather}
        />
      </div>

      {/* Desktop: Bottom Row - Data Cards + Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 1200
          ? '1fr 1fr'
          : '2fr 1.8fr',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Desktop: Data Cards - 2x2 Grid */}
        <div key={`data-cards-desktop-${spaceData.updateId}`} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          alignContent: 'start'
        }}>
          <QuickStatsCard
            key={`space-weather-desktop-${spaceData.updateId}`}
            title="Space Weather"
            icon="☀️"
            value={safeAdvancedData.spaceWeather?.level || 'Quiet'}
            subtitle={`${safeAdvancedData.spaceWeather?.auroraChance || 0}% Aurora • Kp ${safeAdvancedData.spaceWeather?.kpIndex || '0.0'}`}
            color={safeAdvancedData.spaceWeather?.color || '#f59e0b'}
            size="compact-desktop"
          />
          <QuickStatsCard
            key={`satellites-desktop-${spaceData.updateId}`}
            title="Active Satellites"
            icon="📡"
            value={(safeAdvancedData.satellites?.total || 8647).toLocaleString()}
            subtitle={`${(safeAdvancedData.satellites?.starlink || 5000).toLocaleString()} Starlink • ${safeAdvancedData.satellites?.launchesThisYear || 42} launches`}
            color="#10b981"
            size="compact-desktop"
          />
          <QuickStatsCard
            key={`next-launch-desktop-${spaceData.updateId}`}
            title="Next Launch"
            icon="🚀"
            value={`T-${safeSpaceData.nextLaunch.daysUntil || 0}`}
            subtitle={safeSpaceData.nextLaunch.name || 'Unknown Mission'}
            color="#10b981"
            size="compact-desktop"
          />
          <QuickStatsCard
            key={`mars-sol-desktop-${spaceData.updateId}`}
            title="Mars Sol"
            icon="🔴"
            value={`Sol ${(safeSpaceData.mars.sol || 0).toLocaleString()}`}
            subtitle={`${safeSpaceData.mars.temperature || 0}°C • Northern Summer`}
            color="#f59e0b"
            size="compact-desktop"
          />
        </div>

        {/* Desktop: Space Gallery */}
        <div key={`gallery-desktop-${spaceData.updateId}`} style={{
          width: '100%'
        }}>
          <SpaceGallery />
        </div>
      </div>
    </div>
  )
}

// Data Error View - NO ANIMATIONS
const DataErrorView = () => {
  return (
    <div key="data-error-view" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'clamp(35vh, 45vh, 50vh)',
      textAlign: 'center',
      backgroundColor: '#fef2f2',
      borderRadius: 'clamp(12px, 3vw, 16px)',
      padding: 'clamp(1.5rem, 4vw, 2rem)',
      border: '1px solid #fecaca',
      margin: 'clamp(16px, 4vw, 24px) 0',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        fontSize: 'clamp(2.5rem, 7vw, 3rem)',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
      }}>
        🚨
      </div>
      <h2 style={{
        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
        fontWeight: '700',
        color: '#dc2626',
        marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        lineHeight: '1.2',
        fontFamily: "'Inter', sans-serif"
      }}>
        Data Loading Error
      </h2>
      <p style={{
        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
        color: '#7f1d1d',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
        maxWidth: 'clamp(280px, 80vw, 450px)',
        lineHeight: '1.5',
        fontFamily: "'Inter', sans-serif"
      }}>
        Space data is temporarily unavailable. The system is attempting to reconnect to space APIs.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(4px, 1vw, 6px)',
          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
          fontWeight: '600',
          cursor: 'pointer',
          // REMOVED: transition: 'all 0.2s ease',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        🔄 Reload COSMOS
      </button>
      <div style={{
        fontSize: 'clamp(0.625rem, 1.8vw, 0.75rem)',
        color: '#991b1b',
        fontFamily: "'JetBrains Mono', monospace",
        marginTop: 'clamp(1rem, 3vw, 1.5rem)',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        Animation removed • ravixalgorithm • 2025-07-02 20:54:39 UTC
      </div>
    </div>
  )
}

// FIXED Quick Stats Card Component - NO ANIMATIONS
const QuickStatsCard = ({ title, icon, value, subtitle, color, size = 'medium' }) => {
  const safeTitle = title || 'Unknown'
  const safeIcon = icon || '❓'
  const safeValue = value || '---'
  const safeSubtitle = subtitle || 'No data available'
  const safeColor = color || '#6b7280'

  const cardSizes = {
    compact: {
      padding: '16px',
      minHeight: '120px',
      iconSize: '32px',
      iconFontSize: '16px',
      titleSize: '14px',
      valueSize: '18px',
      subtitleSize: '12px',
      borderRadius: '12px'
    },
    medium: {
      padding: '20px',
      minHeight: '160px',
      iconSize: '40px',
      iconFontSize: '20px',
      titleSize: '16px',
      valueSize: '24px',
      subtitleSize: '14px',
      borderRadius: '16px'
    },
    balanced: {
      padding: '18px',
      minHeight: '230px',
      iconSize: '36px',
      iconFontSize: '18px',
      titleSize: '15px',
      valueSize: '22px',
      subtitleSize: '13px',
      borderRadius: '16px'
    },
    'compact-desktop': {
      padding: '16px',
      minHeight: '140px',
      iconSize: '32px',
      iconFontSize: '16px',
      titleSize: '14px',
      valueSize: '20px',
      subtitleSize: '12px',
      borderRadius: '12px'
    }
  }

  const sizing = cardSizes[size] || cardSizes.medium

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: sizing.borderRadius,
      padding: sizing.padding,
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: sizing.minHeight,
      height: size === 'balanced' ? '100%' : 'auto',
      // REMOVED: transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: size === 'compact-desktop' ? 'flex-start' : 'space-between'
    }}
    // REMOVED: onMouseEnter and onMouseLeave hover animations
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: size === 'compact-desktop' ? '60px' : '80px',
        height: size === 'compact-desktop' ? '60px' : '80px',
        background: `linear-gradient(135deg, ${safeColor}15, ${safeColor}05)`,
        borderRadius: `0 ${sizing.borderRadius} 0 ${size === 'compact-desktop' ? '60px' : '80px'}`
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: size === 'compact-desktop' ? '12px' : '16px'
      }}>
        <div style={{
          width: sizing.iconSize,
          height: sizing.iconSize,
          backgroundColor: safeColor,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: sizing.iconFontSize,
          flexShrink: 0
        }}>{safeIcon}</div>
        <h4 style={{
          margin: 0,
          fontSize: sizing.titleSize,
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          fontFamily: "'Inter', sans-serif"
        }}>
          {safeTitle}
        </h4>
      </div>

      <div style={{
        flex: size === 'compact-desktop' ? 'none' : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: size === 'compact-desktop' ? 'flex-start' : 'center',
        marginBottom: size === 'compact-desktop' ? '10px' : '12px'
      }}>
        <div style={{
          fontSize: sizing.valueSize,
          fontWeight: '800',
          color: safeColor,
          lineHeight: '1.1',
          marginBottom: '6px',
          fontFamily: "'Inter', sans-serif"
        }}>
          {safeValue}
        </div>
      </div>

      <div style={{
        fontSize: sizing.subtitleSize,
        color: '#64748b',
        lineHeight: '1.3',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: size === 'compact-desktop' ? 2 : 3,
        WebkitBoxOrient: 'vertical'
      }}>
        {safeSubtitle}
      </div>
    </div>
  )
}

// Other views remain the same but with NO ANIMATIONS
const ISSDetailView = ({ spaceData, advancedData }) => {
  if (!spaceData) return <DataErrorView />

  const safeIssData = spaceData.issData || { location: 'Unknown', speed: '0', altitude: '0' }
  const safeAdvancedIss = advancedData.issAdvanced || {}

  return (
    <div key={`iss-detail-${spaceData.updateId}`} style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#3b82f6',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0
        }}>
          🛰️
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            lineHeight: '1.2',
            fontFamily: "'Inter', sans-serif"
          }}>
            ISS Live Tracking
          </h2>
          <div style={{
            padding: '4px 8px',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            display: 'inline-block',
            marginTop: '4px',
            fontFamily: "'Inter', sans-serif"
          }}>
            LIVE
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: "'Inter', sans-serif"
          }}>
            CURRENT LOCATION
          </h4>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            fontFamily: "'Inter', sans-serif"
          }}>
            {safeIssData.location}
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: "'Inter', sans-serif"
          }}>
            ORBITAL SPEED
          </h4>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {safeIssData.speed} km/h
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: "'Inter', sans-serif"
          }}>
            ALTITUDE
          </h4>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {safeIssData.altitude} km
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: "'Inter', sans-serif"
          }}>
            CREW ON BOARD
          </h4>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {spaceData.crewData?.count || 7} people
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f0f9ff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #0ea5e9'
      }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#0369a1',
          fontFamily: "'Inter', sans-serif"
        }}>
          📊 ISS Quick Facts
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#0369a1',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div>• Orbits Earth every ~93 minutes</div>
          <div>• Travels 17,500 mph (28,000 km/h)</div>
          <div>• Size of a football field</div>
          <div>• Visible from Earth with naked eye</div>
          <div>• Continuous human presence since 2000</div>
          <div>• Laboratory for scientific research</div>
        </div>
      </div>
    </div>
  )
}

const SpaceWeatherView = ({ advancedData }) => {
  const weatherData = advancedData.weatherAdvanced || {
    level: 'Quiet',
    auroraChance: 0,
    kpIndex: '0.0',
    solarWind: 350
  }

  return (
    <div key={`weather-view-${Date.now()}`} style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#f59e0b',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0
        }}>
          ☀️
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0,
          lineHeight: '1.2',
          fontFamily: "'Inter', sans-serif"
        }}>
          Space Weather Monitor
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <QuickStatsCard
          title="Activity Level"
          icon="☀️"
          value={weatherData.level}
          subtitle="Current solar activity"
          color="#f59e0b"
          size="medium"
        />

        <QuickStatsCard
          title="Aurora Forecast"
          icon="🌌"
          value={`${weatherData.auroraChance}%`}
          subtitle="Chance of aurora tonight"
          color="#8b5cf6"
          size="medium"
        />

        <QuickStatsCard
          title="Kp Index"
          icon="📊"
          value={weatherData.kpIndex}
          subtitle="Geomagnetic activity"
          color="#10b981"
          size="medium"
        />

        <QuickStatsCard
          title="Solar Wind"
          icon="💨"
          value={`${weatherData.solarWind} km/s`}
          subtitle="Current speed"
          color="#3b82f6"
          size="medium"
        />
      </div>
    </div>
  )
}

const SatellitesView = ({ advancedData }) => {
  const satelliteData = advancedData.satelliteAdvanced || {
    total: 8647,
    starlink: 5000,
    launchesThisYear: 42,
    countries: 83
  }

  return (
    <div key={`satellites-view-${Date.now()}`} style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#10b981',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0
        }}>
          📡
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0,
          lineHeight: '1.2',
          fontFamily: "'Inter', sans-serif"
        }}>
          Global Satellite Network
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <QuickStatsCard
          title="Active Satellites"
          icon="📡"
          value={satelliteData.total.toLocaleString()}
          subtitle="Currently in orbit"
          color="#10b981"
          size="medium"
        />

        <QuickStatsCard
          title="Starlink Network"
          icon="🌐"
          value={satelliteData.starlink.toLocaleString()}
          subtitle="SpaceX constellation"
          color="#3b82f6"
          size="medium"
        />

        <QuickStatsCard
          title="2025 Launches"
          icon="🚀"
          value={satelliteData.launchesThisYear}
          subtitle="Missions this year"
          color="#8b5cf6"
          size="medium"
        />

        <QuickStatsCard
          title="Countries"
          icon="🌍"
          value={satelliteData.countries}
          subtitle="With active satellites"
          color="#f59e0b"
          size="medium"
        />
      </div>
    </div>
  )
}

export default UltimateSpaceDashboard
