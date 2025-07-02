import React, { useState, useEffect } from 'react'

const NotificationSystem = ({ spaceData, spaceWeather }) => {
  const [notifications, setNotifications] = useState([])
  const [showPanel, setShowPanel] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications = []
      const now = new Date()

      // ISS Pass Notification
      if (Math.random() > 0.6) {
        newNotifications.push({
          id: `iss-${Date.now()}`,
          type: 'iss',
          icon: '🛰️',
          title: 'ISS Visible Tonight',
          message: `ISS will pass over your location at ${new Date(now.getTime() + 8 * 60 * 60 * 1000).toLocaleTimeString()}`,
          time: now,
          priority: 'high',
          action: 'View Tracker'
        })
      }

      // Launch Alert
      if (spaceData.nextLaunch?.daysUntil <= 1) {
        newNotifications.push({
          id: `launch-${Date.now()}`,
          type: 'launch',
          icon: '🚀',
          title: 'Launch Imminent',
          message: `${spaceData.nextLaunch.name} launching in ${spaceData.nextLaunch.daysUntil} day(s)`,
          time: now,
          priority: 'urgent',
          action: 'Watch Live'
        })
      }

      // Space Weather Alert
      if (spaceWeather?.level === 'High' || spaceWeather?.level === 'Severe') {
        newNotifications.push({
          id: `weather-${Date.now()}`,
          type: 'weather',
          icon: '☀️',
          title: 'Solar Activity Alert',
          message: `${spaceWeather.level} solar activity detected. Aurora possible in high latitudes.`,
          time: now,
          priority: spaceWeather.level === 'Severe' ? 'urgent' : 'medium',
          action: 'View Details'
        })
      }

      // Asteroid Approach
      if (Math.random() > 0.8) {
        newNotifications.push({
          id: `asteroid-${Date.now()}`,
          type: 'asteroid',
          icon: '☄️',
          title: 'Asteroid Approach',
          message: 'Asteroid 2025-GX will pass Earth at safe distance of 2.1M km',
          time: now,
          priority: 'medium',
          action: 'Track Object'
        })
      }

      // Space Discovery
      if (Math.random() > 0.9) {
        newNotifications.push({
          id: `discovery-${Date.now()}`,
          type: 'discovery',
          icon: '🔬',
          title: 'New Discovery',
          message: 'James Webb telescope discovers potentially habitable exoplanet',
          time: now,
          priority: 'low',
          action: 'Read More'
        })
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 10))
        setHasNewNotifications(true)
      }
    }

    // Generate notifications periodically
    const interval = setInterval(generateNotifications, 30000) // Every 30 seconds
    generateNotifications() // Initial generation

    return () => clearInterval(interval)
  }, [spaceData, spaceWeather])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444'
      case 'high': return '#f59e0b'
      case 'medium': return '#3b82f6'
      default: return '#10b981'
    }
  }

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => {
          setShowPanel(!showPanel)
          setHasNewNotifications(false)
        }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)'
          e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)'
        }}
      >
        🔔
        {notifications.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            minWidth: '24px',
            height: '24px',
            backgroundColor: hasNewNotifications ? '#ef4444' : '#10b981',
            color: 'white',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
            animation: hasNewNotifications ? 'pulse 2s infinite' : 'none'
          }}>
            {notifications.length}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '20px',
          width: '380px',
          maxHeight: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'slideIn 0.3s ease'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                🔔 Space Alerts
              </h4>
              <button
                onClick={() => setNotifications([])}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          </div>

          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌌</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  All Quiet in Space
                </div>
                <div style={{ fontSize: '14px' }}>
                  No new notifications at the moment
                </div>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      marginTop: '2px'
                    }}>
                      {notification.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <h5 style={{
                          margin: 0,
                          fontSize: '14px',
                          fontWeight: '700',
                          color: getPriorityColor(notification.priority)
                        }}>
                          {notification.title}
                        </h5>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            clearNotification(notification.id)
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#94a3b8'
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      <p style={{
                        margin: '0 0 8px 0',
                        fontSize: '13px',
                        color: '#64748b',
                        lineHeight: '1.4'
                      }}>
                        {notification.message}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '11px',
                          color: '#94a3b8'
                        }}>
                          {notification.time.toLocaleTimeString()}
                        </span>

                        {notification.action && (
                          <button style={{
                            padding: '4px 8px',
                            backgroundColor: getPriorityColor(notification.priority),
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            {notification.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default NotificationSystem
