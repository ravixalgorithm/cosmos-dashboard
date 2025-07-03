import React from 'react'

const DataQualityIndicator = ({ dataQuality, errors, lastUpdated, source }) => {
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'HIGH': return '#10b981'
      case 'MEDIUM': return '#f59e0b'
      case 'LOW': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'HIGH': return '🟢'
      case 'MEDIUM': return '🟡'
      case 'LOW': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0',
      marginTop: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{
          fontSize: '16px'
        }}>
          📊
        </div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0,
          fontFamily: "'Inter', sans-serif"
        }}>
          Data Quality Monitor
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{getQualityIcon(dataQuality)}</span>
          <span style={{ color: '#64748b' }}>Quality:</span>
          <span style={{
            color: getQualityColor(dataQuality),
            fontWeight: '600'
          }}>
            {dataQuality}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📡</span>
          <span style={{ color: '#64748b' }}>Source:</span>
          <span style={{ color: '#1f2937', fontWeight: '500' }}>
            {source || 'Real APIs'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🕒</span>
          <span style={{ color: '#64748b' }}>Updated:</span>
          <span style={{ color: '#1f2937', fontWeight: '500' }}>
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚡</span>
          <span style={{ color: '#64748b' }}>Refresh:</span>
          <span style={{ color: '#1f2937', fontWeight: '500' }}>
            5 minutes
          </span>
        </div>
      </div>

      {errors && errors.length > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#fef2f2',
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#dc2626',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            Data Validation Warnings:
          </div>
          {errors.map((error, index) => (
            <div key={index} style={{
              fontSize: '12px',
              color: '#7f1d1d',
              lineHeight: '1.4'
            }}>
              • {error}
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: '12px',
        padding: '8px',
        backgroundColor: '#f0f9ff',
        borderRadius: '6px',
        fontSize: '11px',
        color: '#0369a1',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        🚀 Real-time data from NASA, NOAA, and verified space industry sources
      </div>
    </div>
  )
}

export default DataQualityIndicator
