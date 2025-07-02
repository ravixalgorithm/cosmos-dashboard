import React, { useState, useEffect, useCallback } from 'react'

const EnhancedNotificationSystem = ({ spaceData, spaceWeather }) => {
  const [notifications, setNotifications] = useState([])
  const [lastNotificationTime, setLastNotificationTime] = useState(Date.now())

  // Safe data access with fallbacks
  const safeSpaceData = spaceData || {}
  const safeSpaceWeather = spaceWeather || {}

  const generateNotifications = useCallback(() => {
    const now = Date.now()
    const newNotifications = []

    // Only generate notifications if we have valid spaceData
    if (!spaceData) {
      console.log('🔧 EnhancedNotificationSystem: No spaceData available, skipping notifications')
      return []
    }

    try {
      // ISS Location Change Notification
      if (safeSpaceData.iss?.location) {
        newNotifications.push({
          id: `iss-location-${now}`,
          type: 'info',
          title: '🛰️ ISS Location Update',
          message: `ISS is currently over ${safeSpaceData.iss.location}`,
          timestamp: now,
          duration: 5000,
          priority: 'medium'
        })
      }

      // People in Space Notification
      if (safeSpaceData.peopleInSpace?.count > 0) {
        newNotifications.push({
          id: `people-space-${now}`,
          type: 'success',
          title: '👨‍🚀 Space Population',
          message: `${safeSpaceData.peopleInSpace.count} astronauts currently in space`,
          timestamp: now,
          duration: 6000,
          priority: 'low'
        })
      }

      // Launch Countdown Notification
      if (safeSpaceData.nextLaunch?.daysUntil !== undefined) {
        const daysUntil = safeSpaceData.nextLaunch.daysUntil
        if (daysUntil === 0) {
          newNotifications.push({
            id: `launch-today-${now}`,
            type: 'warning',
            title: '🚀 Launch Today!',
            message: `${safeSpaceData.nextLaunch.name || 'Mission'} launches today from ${safeSpaceData.nextLaunch.launchSite || 'Unknown location'}`,
            timestamp: now,
            duration: 8000,
            priority: 'high'
          })
        } else if (daysUntil <= 3) {
          newNotifications.push({
            id: `launch-soon-${now}`,
            type: 'info',
            title: '🚀 Upcoming Launch',
            message: `${safeSpaceData.nextLaunch.name || 'Mission'} launches in ${daysUntil} day(s)`,
            timestamp: now,
            duration: 6000,
            priority: 'medium'
          })
        }
      }

      // Mars Weather Notification
      if (safeSpaceData.mars?.sol) {
        newNotifications.push({
          id: `mars-weather-${now}`,
          type: 'info',
          title: '🔴 Mars Weather',
          message: `Sol ${safeSpaceData.mars.sol}: ${safeSpaceData.mars.temperature || 'N/A'}°C, ${safeSpaceData.mars.season || 'Unknown season'}`,
          timestamp: now,
          duration: 5000,
          priority: 'low'
        })
      }

      // Space Weather Alerts (if available)
      if (safeSpaceWeather.alerts && Array.isArray(safeSpaceWeather.alerts)) {
        safeSpaceWeather.alerts.forEach((alert, index) => {
          newNotifications.push({
            id: `space-weather-${now}-${index}`,
            type: 'warning',
            title: '⚠️ Space Weather Alert',
            message: alert.message || 'Space weather activity detected',
            timestamp: now,
            duration: 10000,
            priority: 'high'
          })
        })
      }

      return newNotifications

    } catch (error) {
      console.error('🚨 EnhancedNotificationSystem: Error generating notifications:', error)
      return [{
        id: `error-${now}`,
        type: 'error',
        title: '⚠️ System Notice',
        message: 'Notification system temporarily unavailable',
        timestamp: now,
        duration: 5000,
        priority: 'medium'
      }]
    }
  }, [spaceData, spaceWeather, safeSpaceData, safeSpaceWeather])

  useEffect(() => {
    // Only run if we have spaceData
    if (!spaceData) {
      console.log('🔧 EnhancedNotificationSystem: Waiting for spaceData...')
      return
    }

    const interval = setInterval(() => {
      const now = Date.now()

      // Generate notifications every 30 seconds
      if (now - lastNotificationTime >= 30000) {
        const newNotifications = generateNotifications()

        if (newNotifications.length > 0) {
          setNotifications(prev => {
            // Keep only recent notifications (last 5)
            const filtered = prev.filter(n => now - n.timestamp < 60000)
            return [...filtered, ...newNotifications].slice(-5)
          })
          setLastNotificationTime(now)
        }
      }
    }, 5000) // Check every 5 seconds

    // Generate initial notification
    const initialNotifications = generateNotifications()
    if (initialNotifications.length > 0) {
      setNotifications(initialNotifications.slice(0, 2)) // Show max 2 initially
      setLastNotificationTime(Date.now())
    }

    return () => clearInterval(interval)
  }, [spaceData, generateNotifications, lastNotificationTime])

  // Auto-remove notifications after their duration
  useEffect(() => {
    const timeouts = notifications.map(notification =>
      setTimeout(() => {
        setNotifications(prev =>
          prev.filter(n => n.id !== notification.id)
        )
      }, notification.duration)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [notifications])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '12px',
      border: '1px solid',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      backdropFilter: 'blur(8px)',
      animation: 'slideInRight 0.3s ease-out',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '400px',
      wordWrap: 'break-word'
    }

    const styles = {
      info: {
        ...baseStyle,
        backgroundColor: 'rgba(59, 130, 246, 0.95)',
        borderColor: '#3b82f6',
        color: 'white'
      },
      success: {
        ...baseStyle,
        backgroundColor: 'rgba(16, 185, 129, 0.95)',
        borderColor: '#10b981',
        color: 'white'
      },
      warning: {
        ...baseStyle,
        backgroundColor: 'rgba(245, 158, 11, 0.95)',
        borderColor: '#f59e0b',
        color: 'white'
      },
      error: {
        ...baseStyle,
        backgroundColor: 'rgba(239, 68, 68, 0.95)',
        borderColor: '#ef4444',
        color: 'white'
      }
    }

    return styles[type] || styles.info
  }

  // Don't render anything if no spaceData
  if (!spaceData) {
    return null
  }

  return (
    <>
      {/* Notification Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        maxHeight: '80vh',
        overflow: 'auto',
        pointerEvents: 'none'
      }}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              ...getNotificationStyle(notification.type),
              pointerEvents: 'auto'
            }}
            onClick={() => removeNotification(notification.id)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeNotification(notification.id)
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Content */}
            <div style={{ paddingRight: '30px' }}>
              <div style={{
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {notification.title}
              </div>
              <div style={{
                fontSize: '13px',
                opacity: 0.95,
                lineHeight: '1.4'
              }}>
                {notification.message}
              </div>
              <div style={{
                fontSize: '11px',
                opacity: 0.8,
                marginTop: '8px',
                fontFamily: 'monospace'
              }}>
                {new Date(notification.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {/* Priority Indicator */}
            {notification.priority === 'high' && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: '#fff',
                opacity: 0.8
              }} />
            )}
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default EnhancedNotificationSystem
