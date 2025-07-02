import React from 'react'

const SafeWrapper = ({ children, fallback = null, componentName = 'Component' }) => {
  try {
    return children
  } catch (error) {
    console.error(`🚨 SafeWrapper: ${componentName} crashed:`, error)

    return fallback || (
      <div style={{
        padding: '2rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#dc2626'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h3>{componentName} Error</h3>
        <p>This component encountered an error and couldn't render.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Reload Page
        </button>
      </div>
    )
  }
}

export default SafeWrapper
