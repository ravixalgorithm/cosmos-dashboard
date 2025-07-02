import React from 'react'

const EnhancedStatusBar = ({
  useEnhancedMode,
  setUseEnhancedMode,
  lastUpdated,
  currentTime,
  loading
}) => {
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

        {/* Timestamp */}
        <span style={{
          fontSize: 'clamp(11px, 2.5vw, 14px)',
          color: '#64748b',
          fontFamily: 'monospace',
          backgroundColor: '#f1f5f9',
          padding: 'clamp(4px, 1.5vw, 6px) clamp(8px, 2vw, 12px)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          wordBreak: 'break-all',
          lineHeight: '1.2'
        }}>
          {window.innerWidth < 480
            ? currentTime.toLocaleTimeString()
            : currentTime.toUTCString()
          }
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
        {/* Last Updated Info */}
        <div style={{
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)',
          justifyContent: window.innerWidth < 640 ? 'space-between' : 'flex-start'
        }}>
          <span>Last updated:</span>
          <span style={{ fontWeight: '600' }}>
            {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </span>
        </div>

        {/* Enhanced Mode Toggle */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 480 ? 'column' : 'row',
          alignItems: window.innerWidth < 480 ? 'stretch' : 'center',
          gap: window.innerWidth < 480 ? 'clamp(8px, 2vw, 12px)' : 'clamp(10px, 2.5vw, 12px)'
        }}>
          <span style={{
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            color: '#64748b',
            fontWeight: '600',
            textAlign: window.innerWidth < 480 ? 'left' : 'center'
          }}>
            View Mode:
          </span>

          <div style={{
            position: 'relative',
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(2px, 0.5vw, 4px)',
            border: '1px solid #e2e8f0',
            width: window.innerWidth < 480 ? '100%' : 'auto'
          }}>
            <button
              onClick={() => setUseEnhancedMode(false)}
              style={{
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                backgroundColor: !useEnhancedMode ? 'white' : 'transparent',
                color: !useEnhancedMode ? '#1f2937' : '#64748b',
                border: 'none',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(6px, 1.5vw, 8px)',
                boxShadow: !useEnhancedMode ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                zIndex: 1,
                flex: window.innerWidth < 480 ? 1 : 'none',
                minHeight: 'clamp(36px, 8vw, 44px)'
              }}
            >
              <span style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>📊</span>
              <span>Simple</span>
            </button>

            <button
              onClick={() => setUseEnhancedMode(true)}
              style={{
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                backgroundColor: useEnhancedMode ? 'white' : 'transparent',
                color: useEnhancedMode ? '#3b82f6' : '#64748b',
                border: 'none',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(6px, 1.5vw, 8px)',
                boxShadow: useEnhancedMode ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                zIndex: 1,
                flex: window.innerWidth < 480 ? 1 : 'none',
                minHeight: 'clamp(36px, 8vw, 44px)'
              }}
            >
              <span style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>🚀</span>
              <span>Enhanced</span>
            </button>
          </div>
        </div>

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
          minWidth: window.innerWidth < 480 ? 'auto' : 'fit-content'
        }}>
          ravixalgorithm
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
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
