import React, { useState, useEffect } from 'react'

const UnifiedNavigation = ({ activeSection, setActiveSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    // Main Navigation Items
    { id: 'Home', icon: '🏠', label: 'Home', type: 'main' },
    { id: 'Dashboard', icon: '📊', label: 'Dashboard', type: 'main' },
    { id: 'API Docs', icon: '📚', label: 'API Docs', type: 'main' },
    { type: 'divider' },
    // Documentation Items
    { id: 'Docs', icon: '📋', label: 'Documentation', type: 'docs' }
  ]

  const handleNavigation = (itemId) => {
    try {
      console.log(`🧭 Navigation: ${activeSection} → ${itemId} (2025-07-02 21:33:38)`)

      if (typeof setActiveSection !== 'function') {
        console.error('🚨 setActiveSection is not a function')
        return
      }

      if (!itemId || typeof itemId !== 'string') {
        console.error('🚨 Invalid navigation itemId:', itemId)
        return
      }

      setActiveSection(itemId)
      setMobileMenuOpen(false) // Close mobile menu after navigation
      console.log(`✅ Navigation successful: ${itemId}`)

    } catch (error) {
      console.error('🚨 Navigation error:', error)
    }
  }

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e) => {
      // Close menu if clicking outside of navigation elements
      if (mobileMenuOpen && !e.target.closest('nav') && !e.target.closest('[data-menu-dropdown]')) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Mobile Menu Overlay - SIMPLIFIED */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9990,
            touchAction: 'none'
          }}
          onClick={() => setMobileMenuOpen(false)}
          onTouchStart={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Top Navigation - FIXED z-index */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 9999,
        height: 'clamp(60px, 10vh, 70px)',
        borderBottom: '1px solid #e2e8f0',
        touchAction: 'manipulation'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 24px)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo - SIMPLIFIED */}
          <div
            onClick={() => handleNavigation('Home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 12px)',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            <span style={{
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: '900',
              color: 'black'
            }}>
              COSMOS
            </span>
          </div>

          {/* Mobile Menu Button - SIMPLIFIED */}
          <button
            onClick={() => {
              console.log('🔘 Menu toggle:', !mobileMenuOpen)
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 10px)',
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
              backgroundColor: mobileMenuOpen ? '#1f2937' : 'transparent',
              color: mobileMenuOpen ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '600',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none'
            }}
          >
            <span style={{ fontSize: 'clamp(16px, 3.5vw, 20px)' }}>☰</span>
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu - COMPLETELY REWRITTEN */}
      {mobileMenuOpen && (
        <div
          data-menu-dropdown="true"
          style={{
            position: 'fixed',
            top: 'clamp(60px, 10vh, 70px)',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
            zIndex: 9998,
            maxHeight: 'calc(100vh - clamp(60px, 10vh, 70px))',
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            touchAction: 'manipulation'
          }}
        >
          <div style={{
            padding: 'clamp(16px, 4vw, 24px)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Navigation Items - SIMPLIFIED EVENT HANDLING */}
            <div style={{
              display: 'grid',
              gap: 'clamp(8px, 2vw, 12px)'
            }}>
              {navigationItems.map((item, index) => {
                if (item.type === 'divider') {
                  return (
                    <div
                      key={`divider-${index}`}
                      style={{
                        height: '1px',
                        backgroundColor: '#e2e8f0',
                        margin: 'clamp(8px, 2vw, 12px) 0'
                      }}
                    />
                  )
                }

                const isActive = activeSection === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      console.log(`🔘 Nav item clicked: ${item.id}`)
                      handleNavigation(item.id)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(12px, 3vw, 16px)',
                      padding: 'clamp(16px, 4vw, 20px)',
                      backgroundColor: isActive ? '#f1f5f9' : 'white',
                      color: isActive ? '#1f2937' : '#64748b',
                      border: isActive ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                      borderRadius: 'clamp(12px, 3vw, 16px)',
                      fontSize: 'clamp(14px, 3vw, 16px)',
                      fontWeight: isActive ? '600' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      minHeight: '60px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      outline: 'none',
                      // REMOVE ALL TRANSITIONS for better touch response
                      transition: 'none'
                    }}
                  >
                    <span style={{
                      fontSize: 'clamp(20px, 4.5vw, 24px)',
                      minWidth: 'clamp(28px, 6vw, 32px)',
                      textAlign: 'center'
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%'
                      }} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Status Section - SIMPLIFIED */}
            <div style={{
              marginTop: 'clamp(20px, 5vw, 28px)',
              padding: 'clamp(16px, 4vw, 20px)',
              backgroundColor: '#f8fafc',
              borderRadius: 'clamp(12px, 3vw, 16px)',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#64748b',
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: '1.6'
              }}>
                <div style={{
                  fontWeight: '700',
                  marginBottom: '8px',
                  color: '#1f2937',
                  fontSize: 'clamp(13px, 2.8vw, 15px)'
                }}>
                  🚀 COSMOS Dashboard
                </div>
                <div>
                  Active: <strong style={{ color: '#3b82f6' }}>{activeSection}</strong>
                </div>
                <div style={{ marginTop: '4px' }}>
                  Built by <strong style={{ color: '#3b82f6' }}>ravixalgorithm</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Global Styles - FIXED TOUCH ISSUES */}
      <style jsx>{`
        /* Remove all touch delays and highlights */
        * {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }

        /* Ensure buttons are touchable */
        button {
          touch-action: manipulation !important;
          -webkit-appearance: none !important;
          border: none !important;
          outline: none !important;
        }

        /* Prevent zoom on double tap */
        nav {
          touch-action: manipulation !important;
        }

        /* Prevent scroll when menu open */
        body.menu-open {
          position: fixed !important;
          width: 100% !important;
          overflow: hidden !important;
        }

        /* Fix iOS Safari touch issues */
        @supports (-webkit-touch-callout: none) {
          button {
            cursor: pointer !important;
          }
        }
      `}</style>
    </>
  )
}

export default UnifiedNavigation
