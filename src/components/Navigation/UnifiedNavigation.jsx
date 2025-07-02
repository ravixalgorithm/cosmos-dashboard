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
      console.log(`🧭 Mobile Navigation: ${activeSection} → ${itemId} (2025-07-02 19:05:46)`)

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
      console.log(`✅ Mobile Navigation successful: ${itemId}`)

    } catch (error) {
      console.error('🚨 Mobile Navigation error:', error)
    }
  }

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Mobile Menu Overlay - Fixed z-index and pointer events */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998, // Lower than navigation but higher than content
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setMobileMenuOpen(false)
          }}
        />
      )}

      {/* Mobile Top Navigation - Higher z-index */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 10000, // Highest z-index
        height: 'clamp(60px, 10vh, 70px)',
        borderBottom: '1px solid #e2e8f0',
        userSelect: 'none',
        pointerEvents: 'auto'
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
          {/* Logo */}
          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleNavigation('Home')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 12px)',
              cursor: 'pointer',
              userSelect: 'none',
              pointerEvents: 'auto',
              zIndex: 10001
            }}
          >
            <span style={{
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: '900',
              color: 'black',
              pointerEvents: 'none'
            }}>
              COSMOS
            </span>
          </div>

          {/* Mobile Menu Button - Fixed pointer events */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🔘 Menu button clicked, current state:', mobileMenuOpen)
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
              transition: 'all 0.2s ease',
              userSelect: 'none',
              outline: 'none',
              pointerEvents: 'auto',
              zIndex: 10001,
              position: 'relative'
            }}
          >
            <span style={{
              fontSize: 'clamp(16px, 3.5vw, 20px)',
              pointerEvents: 'none'
            }}>
              ☰
            </span>
            <span style={{ pointerEvents: 'none' }}>Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu - Fixed positioning and events */}
      <div style={{
        position: 'fixed',
        top: 'clamp(60px, 10vh, 70px)',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 9999, // High but lower than nav bar
        transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxHeight: 'calc(100vh - clamp(60px, 10vh, 70px))',
        overflowY: 'auto',
        boxShadow: mobileMenuOpen ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none',
        pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        opacity: mobileMenuOpen ? 1 : 0,
        visibility: mobileMenuOpen ? 'visible' : 'hidden'
      }}>
        <div style={{
          padding: 'clamp(16px, 4vw, 24px)',
          maxWidth: '600px',
          margin: '0 auto',
          pointerEvents: 'auto'
        }}>
          {/* Mobile Navigation Items - Fixed click handling */}
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

              return (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log(`🔘 Navigation item clicked: ${item.id}`)
                    handleNavigation(item.id)
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(12px, 3vw, 16px)',
                    padding: 'clamp(14px, 3.5vw, 18px)',
                    backgroundColor: activeSection === item.id ? '#f1f5f9' : 'transparent',
                    color: activeSection === item.id ? '#1f2937' : '#64748b',
                    border: activeSection === item.id ? '2px solid #3b82f6' : '2px solid transparent',
                    borderRadius: 'clamp(10px, 2.5vw, 14px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    fontWeight: activeSection === item.id ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%',
                    userSelect: 'none',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 10000,
                    minHeight: '56px'
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(20px, 4.5vw, 24px)',
                    minWidth: 'clamp(28px, 6vw, 32px)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                  }}>
                    {item.icon}
                  </span>
                  <span style={{
                    flex: 1,
                    pointerEvents: 'none'
                  }}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Mobile Status - Fixed spacing */}
          <div style={{
            marginTop: 'clamp(20px, 5vw, 28px)',
            padding: 'clamp(14px, 3.5vw, 18px)',
            backgroundColor: '#f8fafc',
            borderRadius: 'clamp(10px, 2.5vw, 14px)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: 'clamp(11px, 2.2vw, 12px)',
              color: '#64748b',
              fontFamily: 'monospace',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '6px', color: '#1f2937' }}>
                🚀 COSMOS Dashboard
              </div>
              <div>
                Built by <strong style={{ color: '#3b82f6' }}>ravixalgorithm</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles - Enhanced for mobile */}
      <style jsx>{`
        nav * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        button {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        body.menu-open {
          position: fixed;
          width: 100%;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}

export default UnifiedNavigation
