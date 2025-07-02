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
      timestamp: '2025-07-02 19:20:26',
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
        ? 'clamp(60px, 10vh, 70px)'   // Mobile: single nav height
        : 'clamp(80px, 12vh, 90px)',  // Desktop: optimized for dual nav
      padding: `${window.innerWidth < 768
        ? 'clamp(60px, 10vh, 70px)'
        : 'clamp(80px, 12vh, 90px)'} clamp(8px, 2vw, 16px) clamp(16px, 4vw, 20px)`, // Reduced horizontal padding
      boxSizing: 'border-box',
      width: '100%',
      overflow: 'hidden' // Prevent horizontal scroll
    }}>
      <div style={{
        maxWidth: 'min(100vw, 1280px)', // Strict viewport width limit
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {renderDashboardContent()}
      </div>
    </div>
  )
}

// Fixed Responsive Loading View
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
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
        animation: 'pulse 2s infinite'
      }}>
        🚀
      </div>
      <h2 style={{
        fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        lineHeight: '1.2'
      }}>
        Loading COSMOS Data...
      </h2>
      <p style={{
        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
        color: '#64748b',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
        maxWidth: '90%'
      }}>
        Fetching real-time space information
      </p>
      <div style={{
        fontSize: 'clamp(0.625rem, 1.8vw, 0.75rem)',
        color: '#94a3b8',
        fontFamily: 'monospace',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        ravixalgorithm • 2025-07-02 19:20:26 UTC
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

// Fixed Responsive Main Enhanced View
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

  return (
    <div key={`main-view-${spaceData.updateId}`} style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'clamp(12px, 3vw, 20px)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Row - Earth Tracker and Quick Stats - FIXED LAYOUT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768
          ? '1fr'
          : window.innerWidth < 1200
            ? '1fr'
            : '1.6fr 1fr', // Adjusted ratio for better fit
        gap: 'clamp(12px, 3vw, 20px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Earth Tracker - Fixed container */}
        <div key={`earth-tracker-${spaceData.updateId}`} style={{
          width: '100%',
          minWidth: 0, // Allow shrinking
          boxSizing: 'border-box'
        }}>
          <EarthTracker issData={safeAdvancedData.iss || safeSpaceData.iss} />
        </div>

        {/* Quick Stats Column - Fixed sizing */}
        <div key={`quick-stats-${spaceData.updateId}`} style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 576 ? '1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'clamp(8px, 2vw, 12px)',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          <QuickStatsCard
            key={`iss-status-${spaceData.updateId}`}
            title="ISS Status"
            icon="🛰️"
            value={safeAdvancedData.iss?.region || safeSpaceData.iss.location}
            subtitle={`${safeSpaceData.iss.speed} km/h • ${safeAdvancedData.iss?.altitude || safeSpaceData.iss.altitude} km`}
            color="#3b82f6"
            size="compact"
          />

          <QuickStatsCard
            key={`crew-count-${spaceData.updateId}`}
            title="Crew"
            icon="👨‍🚀"
            value={safeSpaceData.peopleInSpace.count.toString()}
            subtitle="People in Space"
            color="#8b5cf6"
            size="compact"
          />
        </div>
      </div>

      {/* Middle Row - Live Charts - Fixed container */}
      <div key={`charts-${spaceData.updateId}`} style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box'
      }}>
        <LiveCharts
          spaceData={safeSpaceData}
          spaceWeather={safeAdvancedData.spaceWeather}
        />
      </div>

      {/* Bottom Row - Data Cards and Gallery - FIXED LAYOUT */}
      <div key={`bottom-row-${spaceData.updateId}`} style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768
          ? '1fr'
          : window.innerWidth < 1200
            ? '1fr'
            : '1.6fr 1fr', // Adjusted ratio for better fit
        gap: 'clamp(12px, 3vw, 20px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Data Cards Grid - Fixed responsive grid */}
        <div key={`data-cards-${spaceData.updateId}`} style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 576
            ? '1fr'
            : window.innerWidth < 768
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'clamp(8px, 2vw, 14px)',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          {/* Space Weather */}
          <QuickStatsCard
            key={`space-weather-${spaceData.updateId}`}
            title="Space Weather"
            icon="☀️"
            value={safeAdvancedData.spaceWeather?.level || 'Quiet'}
            subtitle={`${safeAdvancedData.spaceWeather?.auroraChance || 0}% Aurora • Kp ${safeAdvancedData.spaceWeather?.kpIndex || '0.0'}`}
            color={safeAdvancedData.spaceWeather?.color || '#f59e0b'}
            size="medium"
          />

          {/* Satellites */}
          <QuickStatsCard
            key={`satellites-${spaceData.updateId}`}
            title="Active Satellites"
            icon="📡"
            value={(safeAdvancedData.satellites?.total || 8647).toLocaleString()}
            subtitle={`${(safeAdvancedData.satellites?.starlink || 5000).toLocaleString()} Starlink • ${safeAdvancedData.satellites?.launchesThisYear || 42} launches in 2025`}
            color="#10b981"
            size="medium"
          />

          <QuickStatsCard
            key={`next-launch-${spaceData.updateId}`}
            title="Next Launch"
            icon="🚀"
            value={`T-${safeSpaceData.nextLaunch.daysUntil || 0}`}
            subtitle={safeSpaceData.nextLaunch.name || 'Unknown Mission'}
            color="#10b981"
            size="medium"
          />

          <QuickStatsCard
            key={`mars-sol-${spaceData.updateId}`}
            title="Mars Sol"
            icon="🔴"
            value={`Sol ${(safeSpaceData.mars.sol || 0).toLocaleString()}`}
            subtitle={`${safeSpaceData.mars.temperature || 0}°C • Northern Summer`}
            color="#f59e0b"
            size="medium"
          />
        </div>

        {/* Space Gallery - Fixed container */}
        <div key={`gallery-${spaceData.updateId}`} style={{
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          <SpaceGallery />
        </div>
      </div>
    </div>
  )
}

// Fixed Responsive Data Error View
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
        lineHeight: '1.2'
      }}>
        Data Loading Error
      </h2>
      <p style={{
        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
        color: '#7f1d1d',
        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
        maxWidth: 'clamp(280px, 80vw, 450px)',
        lineHeight: '1.5'
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
          transition: 'all 0.2s ease'
        }}
      >
        🔄 Reload COSMOS
      </button>
      <div style={{
        fontSize: 'clamp(0.625rem, 1.8vw, 0.75rem)',
        color: '#991b1b',
        fontFamily: 'monospace',
        marginTop: 'clamp(1rem, 3vw, 1.5rem)',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        Fixed responsive layout • ravixalgorithm • 2025-07-02 19:20:26 UTC
      </div>
    </div>
  )
}

// Fixed Enhanced Responsive Quick Stats Card Component
const QuickStatsCard = ({ title, icon, value, subtitle, color, size = 'medium' }) => {
  const safeTitle = title || 'Unknown'
  const safeIcon = icon || '❓'
  const safeValue = value || '---'
  const safeSubtitle = subtitle || 'No data available'
  const safeColor = color || '#6b7280'

  const cardSizes = {
    compact: {
      padding: 'clamp(8px, 2vw, 12px)',
      minHeight: 'clamp(80px, 16vw, 100px)',
      iconSize: 'clamp(20px, 4vw, 28px)',
      iconFontSize: 'clamp(10px, 2vw, 14px)',
      titleSize: 'clamp(10px, 2vw, 12px)',
      valueSize: 'clamp(12px, 2.8vw, 14px)',
      subtitleSize: 'clamp(8px, 1.6vw, 9px)',
      borderRadius: 'clamp(8px, 2vw, 12px)'
    },
    medium: {
      padding: 'clamp(10px, 2.5vw, 14px)',
      minHeight: 'clamp(100px, 20vw, 130px)',
      iconSize: 'clamp(24px, 5vw, 32px)',
      iconFontSize: 'clamp(12px, 2.5vw, 16px)',
      titleSize: 'clamp(11px, 2.2vw, 13px)',
      valueSize: 'clamp(14px, 3vw, 16px)',
      subtitleSize: 'clamp(9px, 1.8vw, 10px)',
      borderRadius: 'clamp(8px, 2vw, 12px)'
    }
  }

  const sizing = cardSizes[size] || cardSizes.medium

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: sizing.borderRadius,
      padding: sizing.padding,
      border: '1px solid #e2e8f0',
      boxShadow: '0 3px 15px rgba(0, 0, 0, 0.06)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: sizing.minHeight,
      transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box',
      minWidth: 0 // Allow shrinking
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 'clamp(30px, 8vw, 50px)',
        height: 'clamp(30px, 8vw, 50px)',
        background: `linear-gradient(135deg, ${safeColor}20, ${safeColor}10)`,
        borderRadius: `0 ${sizing.borderRadius} 0 clamp(30px, 8vw, 50px)`
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(4px, 1vw, 6px)',
        marginBottom: 'clamp(4px, 1vw, 8px)'
      }}>
        <div style={{
          width: sizing.iconSize,
          height: sizing.iconSize,
          backgroundColor: safeColor,
          borderRadius: 'clamp(4px, 1vw, 6px)',
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
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {safeTitle}
        </h4>
      </div>

      <div style={{ marginBottom: 'clamp(3px, 0.8vw, 6px)' }}>
        <div style={{
          fontSize: sizing.valueSize,
          fontWeight: '800',
          color: safeColor,
          lineHeight: '1.1',
          marginBottom: 'clamp(1px, 0.3vw, 2px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {safeValue}
        </div>
      </div>

      <div style={{
        fontSize: sizing.subtitleSize,
        color: '#64748b',
        lineHeight: '1.3',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {safeSubtitle}
      </div>
    </div>
  )
}

// Responsive ISSDetailView
const ISSDetailView = ({ spaceData, advancedData }) => {
  if (!spaceData) return <DataErrorView />

  const safeIssData = spaceData.issData || { location: 'Unknown', speed: '0', altitude: '0' }
  const safeAdvancedIss = advancedData.issAdvanced || {}

  return (
    <div key={`iss-detail-${spaceData.updateId}`} style={{
      backgroundColor: 'white',
      borderRadius: 'clamp(12px, 3vw, 16px)',
      padding: 'clamp(16px, 4vw, 24px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 480 ? 'column' : 'row',
        alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
        gap: 'clamp(8px, 2vw, 12px)',
        marginBottom: 'clamp(16px, 4vw, 20px)'
      }}>
        <div style={{
          width: 'clamp(40px, 8vw, 48px)',
          height: 'clamp(40px, 8vw, 48px)',
          backgroundColor: '#3b82f6',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(20px, 4vw, 24px)',
          flexShrink: 0
        }}>
          🛰️
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(20px, 5vw, 24px)',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            lineHeight: '1.2'
          }}>
            ISS Live Tracking
          </h2>
          <div style={{
            padding: 'clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px)',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: 'clamp(4px, 1vw, 6px)',
            fontSize: 'clamp(9px, 2vw, 11px)',
            fontWeight: '600',
            display: 'inline-block',
            marginTop: 'clamp(3px, 1vw, 4px)'
          }}>
            LIVE
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 640
          ? '1fr'
          : window.innerWidth < 1024
            ? 'repeat(2, 1fr)'
            : 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'clamp(12px, 3vw, 20px)',
        marginBottom: 'clamp(16px, 4vw, 24px)'
      }}>
        <div style={{
          padding: 'clamp(12px, 3vw, 16px)',
          backgroundColor: '#f8fafc',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            CURRENT LOCATION
          </h4>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {safeIssData.location}
          </div>
        </div>

        <div style={{
          padding: 'clamp(12px, 3vw, 16px)',
          backgroundColor: '#f8fafc',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ORBITAL SPEED
          </h4>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {safeIssData.speed} km/h
          </div>
        </div>

        <div style={{
          padding: 'clamp(12px, 3vw, 16px)',
          backgroundColor: '#f8fafc',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ALTITUDE
          </h4>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {safeIssData.altitude} km
          </div>
        </div>

        <div style={{
          padding: 'clamp(12px, 3vw, 16px)',
          backgroundColor: '#f8fafc',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            CREW ON BOARD
          </h4>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            {spaceData.crewData?.count || 7} people
          </div>
        </div>
      </div>

      {/* ISS Facts - Responsive */}
      <div style={{
        backgroundColor: '#f0f9ff',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        padding: 'clamp(16px, 4vw, 20px)',
        border: '1px solid #0ea5e9'
      }}>
        <h4 style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          marginBottom: 'clamp(10px, 2.5vw, 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)',
          color: '#0369a1'
        }}>
          📊 ISS Quick Facts
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 640
            ? '1fr'
            : 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(8px, 2vw, 12px)',
          fontSize: 'clamp(11px, 2.5vw, 13px)',
          lineHeight: '1.5',
          color: '#0369a1'
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

// Responsive SpaceWeatherView
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
      borderRadius: 'clamp(12px, 3vw, 16px)',
      padding: 'clamp(16px, 4vw, 24px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 480 ? 'column' : 'row',
        alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
        gap: 'clamp(8px, 2vw, 12px)',
        marginBottom: 'clamp(16px, 4vw, 20px)'
      }}>
        <div style={{
          width: 'clamp(40px, 8vw, 48px)',
          height: 'clamp(40px, 8vw, 48px)',
          backgroundColor: '#f59e0b',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(20px, 4vw, 24px)',
          flexShrink: 0
        }}>
          ☀️
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 5vw, 24px)',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0,
          lineHeight: '1.2'
        }}>
          Space Weather Monitor
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 640
          ? '1fr'
          : window.innerWidth < 1024
            ? 'repeat(2, 1fr)'
            : 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'clamp(10px, 2.5vw, 16px)',
        marginBottom: 'clamp(16px, 4vw, 20px)'
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

// Responsive SatellitesView
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
      borderRadius: 'clamp(12px, 3vw, 16px)',
      padding: 'clamp(16px, 4vw, 24px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 480 ? 'column' : 'row',
        alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
        gap: 'clamp(8px, 2vw, 12px)',
        marginBottom: 'clamp(16px, 4vw, 20px)'
      }}>
        <div style={{
          width: 'clamp(40px, 8vw, 48px)',
          height: 'clamp(40px, 8vw, 48px)',
          backgroundColor: '#10b981',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(20px, 4vw, 24px)',
          flexShrink: 0
        }}>
          📡
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 5vw, 24px)',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0,
          lineHeight: '1.2'
        }}>
          Global Satellite Network
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 640
          ? '1fr'
          : window.innerWidth < 1024
            ? 'repeat(2, 1fr)'
            : 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'clamp(10px, 2.5vw, 16px)'
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
