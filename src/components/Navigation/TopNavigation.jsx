import React from 'react'

const TopNavigation = ({ setActiveSection }) => {
  // Safe navigation handler
  const handleNavigation = (section) => {
    try {
      // For dashboard navigation, we don't need to wait for spaceData
      // The dashboard components will handle their own loading states
      setActiveSection(section)
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to home on error
      setActiveSection('Home')
    }
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      zIndex: 1000,
      height: '70px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div
          onClick={() => handleNavigation('Home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <span style={{
            fontSize: '30px',
            fontWeight: '900',
            color: 'black'
          }}>
            COSMOS
          </span>
        </div>

        {/* Right Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={() => handleNavigation('Docs')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#64748b',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9'
              e.target.style.color = '#1f2937'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#64748b'
            }}
          >
            Go to Docs
          </button>

          <button
            onClick={() => handleNavigation('Dashboard')}
            style={{
              padding: '8px 20px',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#374151'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'black'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </nav>
  )
}

export default TopNavigation
