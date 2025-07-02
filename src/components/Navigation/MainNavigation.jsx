import React from 'react'

const MainNavigation = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'Home', icon: '🏠', label: 'Home' },
    { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'API Docs', icon: '📚', label: 'API Docs' }
  ]

  const handleNavigation = (itemId) => {
    try {
      console.log(`🧭 Navigation: ${activeSection} → ${itemId} (2025-07-02 17:57:35)`)

      // Validate setActiveSection function exists
      if (typeof setActiveSection !== 'function') {
        console.error('🚨 setActiveSection is not a function')
        return
      }

      // Validate itemId
      if (!itemId || typeof itemId !== 'string') {
        console.error('🚨 Invalid navigation itemId:', itemId)
        return
      }

      setActiveSection(itemId)
      console.log(`✅ Navigation successful: ${itemId}`)

    } catch (error) {
      console.error('🚨 Navigation error:', error)
      console.error('Error details:', {
        activeSection,
        targetSection: itemId,
        setActiveSectionType: typeof setActiveSection,
        timestamp: '2025-07-02 17:57:35'
      })
    }
  }

  return (
    <nav style={{
      position: 'fixed',
      top: '70px',
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 999,
      height: '60px',
      userSelect: 'none' // Prevent text selection on the entire nav
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none' // Additional prevention
      }}>
        {/* Main Navigation Pills Container */}
        <div style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: 'rgba(248, 250, 252, 0.9)',
          borderRadius: '50px',
          padding: '4px',
          border: '1px solid rgba(226, 232, 240, 0.6)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          userSelect: 'none' // Prevent text selection on container
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              onMouseDown={(e) => e.preventDefault()} // Prevent text selection on click
              style={{
                padding: '10px 24px',
                backgroundColor: activeSection === item.id ? '#1f2937' : 'transparent',
                color: activeSection === item.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: activeSection === item.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeSection === item.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                userSelect: 'none', // Prevent text selection
                WebkitUserSelect: 'none', // Safari
                MozUserSelect: 'none', // Firefox
                msUserSelect: 'none', // IE/Edge
                outline: 'none', // Remove focus outline
                WebkitTapHighlightColor: 'transparent' // Remove mobile tap highlight
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'rgba(100, 116, 139, 0.1)'
                  e.target.style.color = '#1f2937'
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#64748b'
                }
              }}
            >
              <span style={{
                userSelect: 'none',
                pointerEvents: 'none' // Prevent span from being clicked directly
              }}>
                {item.icon}
              </span>
              <span style={{
                userSelect: 'none',
                pointerEvents: 'none' // Prevent span from being clicked directly
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Status Indicator - Right Side */}
        <div style={{
          position: 'absolute',
          right: '32px',
          fontSize: '12px',
          color: '#94a3b8',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          userSelect: 'none' // Prevent text selection on status
        }}>
          <span>ravixalgorithm</span>
          <span>•</span>
          <span>2025-07-02 17:57:35</span>
        </div>
      </div>

      {/* Add global CSS to prevent text selection */}
      <style jsx>{`
        nav * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </nav>
  )
}

export default MainNavigation
