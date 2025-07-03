import React from 'react'

const EnhancedStatusBar = ({
  lastUpdated,
  currentTime,
  loading,
  spaceData,
  dataQuality,
  errors,
  onRefresh
}) => {

  // FIXED: Safe date formatting function
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never'

    try {
      // Handle both string and number timestamps
      let date

      if (typeof timestamp === 'string') {
        date = new Date(timestamp)
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        console.warn('⚠️ Unknown timestamp type in EnhancedStatusBar:', typeof timestamp, timestamp)
        return 'Invalid format'
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Invalid date in EnhancedStatusBar:', timestamp)
        return 'Invalid date'
      }

      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      console.error('🚨 Date formatting error in EnhancedStatusBar:', error, 'Timestamp:', timestamp)
      return 'Format error'
    }
  }

  // FIXED: Safe current time formatting
  const formatCurrentTime = (time) => {
    if (!time) return new Date().toLocaleTimeString()

    try {
      let date

      if (typeof time === 'string') {
        date = new Date(time)
      } else if (typeof time === 'number') {
        date = new Date(time)
      } else if (time instanceof Date) {
        date = time
      } else {
        date = new Date()
      }

      if (isNaN(date.getTime())) {
        date = new Date()
      }

      return window.innerWidth < 480
        ? date.toLocaleTimeString()
        : date.toUTCString()
    } catch (error) {
      console.error('🚨 Current time formatting error:', error)
      return new Date().toLocaleTimeString()
    }
  }

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      marginBottom: 'clamp(16px, 4vw, 32px)',
      backgroundColor: 'white',
      borderRadius: 'clamp(12px, 3vw, 20px)',
      padding: 'clamp(16px, 4vw, 24px) clamp(20px, 5vw, 32px)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: window.innerWidth < 768 ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
      gap: window.innerWidth < 768 ? 'clamp(16px, 4vw, 20px)' : '0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      {/* Left Section - Status Info */}
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 480 ? 'column' : 'row',
        alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
        gap: window.innerWidth < 480 ? 'clamp(12px, 3vw, 16px)' : 'clamp(16px, 4vw, 24px)',
        flex: 1
      }}>
        {/* Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(8px, 2vw, 12px)'
        }}>
          <div style={{
            width: 'clamp(10px, 2.5vw, 12px)',
            height: 'clamp(10px, 2.5vw, 12px)',
            backgroundColor: loading ? '#f59e0b' : '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '700',
            color: loading ? '#f59e0b' : '#10b981'
          }}>
            {loading ? 'SYNCING' : 'LIVE'}
          </span>
        </div>

        {/* Divider - Hidden on small mobile */}
        {window.innerWidth >= 480 && (
          <div style={{
            height: 'clamp(20px, 4vw, 24px)',
            width: '1px',
            backgroundColor: '#e2e8f0'
          }} />
        )}

        {/* Dashboard Title */}
        <span style={{
          fontSize: 'clamp(14px, 3.5vw, 16px)',
          color: '#1f2937',
          fontWeight: '600'
        }}>
          COSMOS Space Dashboard
        </span>

        {/* Timestamp - FIXED */}
        <span style={{
          fontSize: 'clamp(11px, 2.5vw, 14px)',
          color: '#64748b',
          fontFamily: "'JetBrains Mono', monospace",
          backgroundColor: '#f1f5f9',
          padding: 'clamp(4px, 1.5vw, 6px) clamp(8px, 2vw, 12px)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          wordBreak: 'break-all',
          lineHeight: '1.2'
        }}>
          {formatCurrentTime(currentTime)}
        </span>
      </div>

      {/* Right Section - Mode Toggle & Info */}
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
        alignItems: window.innerWidth < 640 ? 'stretch' : 'center',
        gap: window.innerWidth < 640 ? 'clamp(12px, 3vw, 16px)' : 'clamp(16px, 4vw, 20px)',
        width: window.innerWidth < 768 ? '100%' : 'auto'
      }}>
        {/* Last Updated Info - FIXED */}
        <div style={{
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)',
          justifyContent: window.innerWidth < 640 ? 'space-between' : 'flex-start'
        }}>
          <span>Last updated:</span>
          <span style={{
            fontWeight: '600',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(11px, 2.2vw, 13px)'
          }}>
            {formatLastUpdated(lastUpdated)}
          </span>
        </div>

        {/* Data Quality Indicator - ADDED */}
        {dataQuality && (
          <div style={{
            fontSize: 'clamp(11px, 2.2vw, 13px)',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{
              color: dataQuality === 'HIGH' ? '#10b981' : dataQuality === 'MEDIUM' ? '#f59e0b' : '#dc2626'
            }}>
              {dataQuality === 'HIGH' ? '🟢' : dataQuality === 'MEDIUM' ? '🟡' : '🔴'}
            </span>
            <span style={{ fontSize: '10px', fontWeight: '600' }}>
              {dataQuality}
            </span>
          </div>
        )}


        {/* Refresh Button - ADDED */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#f1f5f9' : 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 'clamp(11px, 2.2vw, 13px)',
              color: loading ? '#94a3b8' : '#64748b',
              fontWeight: '500',
              transition: 'all 0.2s',
              fontFamily: "'Inter', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f8fafc'
                e.target.style.borderColor = '#cbd5e1'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'white'
                e.target.style.borderColor = '#e2e8f0'
              }
            }}
          >
            <span style={{
              animation: loading ? 'spin 1s linear infinite' : 'none',
              fontSize: 'clamp(10px, 2vw, 12px)'
            }}>
              🔄
            </span>
            {window.innerWidth >= 640 && (
              <span>{loading ? 'Syncing...' : 'Refresh'}</span>
            )}
          </button>
        )}

        {/* User Badge */}
        <div style={{
          padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
          backgroundColor: '#eff6ff',
          color: '#3b82f6',
          borderRadius: 'clamp(8px, 2vw, 10px)',
          fontSize: 'clamp(10px, 2vw, 12px)',
          fontWeight: '700',
          border: '1px solid #93c5fd',
          textAlign: 'center',
          alignSelf: window.innerWidth < 640 ? 'center' : 'auto',
          minWidth: window.innerWidth < 480 ? 'auto' : 'fit-content',
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          ravixalgorithm
        </div>
      </div>

      {/* Error Messages (if any) - ADDED */}
      {errors && errors.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          padding: '6px 12px',
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          border: '1px solid #fecaca',
          zIndex: 10
        }}>
          <div style={{
            fontSize: '10px',
            color: '#dc2626',
            fontWeight: '600',
            marginBottom: '2px'
          }}>
            Data Issues:
          </div>
          {errors.slice(0, 1).map((error, index) => (
            <div key={index} style={{
              fontSize: '10px',
              color: '#7f1d1d',
              lineHeight: '1.3'
            }}>
              • {error}
            </div>
          ))}
        </div>
      )}

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile-specific styles */
        @media (max-width: 479px) {
          .status-bar-mobile {
            padding: 16px;
          }

          .mode-toggle-mobile {
            width: 100%;
          }

          .timestamp-mobile {
            font-size: 11px;
            padding: 4px 8px;
          }
        }

        /* Tablet styles */
        @media (min-width: 480px) and (max-width: 767px) {
          .status-bar-tablet {
            padding: 20px 24px;
          }
        }

        /* Desktop styles */
        @media (min-width: 768px) {
          .status-bar-desktop {
            padding: 24px 32px;
          }
        }
      `}</style>
    </div>
  )
}

export default EnhancedStatusBar
