import React, { useState, useEffect, useCallback } from 'react'

const SafeNotificationSystem = ({ spaceData, spaceWeather }) => {
  const [notifications, setNotifications] = useState([])
  const [showPanel, setShowPanel] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )
  const [pushSubscription, setPushSubscription] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [lastDataCheck, setLastDataCheck] = useState(null)

  // Memoized validation function to prevent unnecessary re-renders
  const validateSpaceData = useCallback((data) => {
    try {
      if (!data || typeof data !== 'object') {
        return false
      }

      // Check ISS data
      if (!data.iss || typeof data.iss !== 'object' || !data.iss.location) {
        return false
      }

      // Check people in space data
      if (!data.peopleInSpace || typeof data.peopleInSpace.count !== 'number') {
        return false
      }

      // Check next launch data
      if (!data.nextLaunch || typeof data.nextLaunch !== 'object') {
        return false
      }

      // Check Mars data
      if (!data.mars || typeof data.mars !== 'object') {
        return false
      }

      return true
    } catch (error) {
      console.error('🔔 COSMOS: Data validation error:', error)
      return false
    }
  }, [])

  // Memoized notification generators to prevent infinite loops
  const generateWelcomeNotification = useCallback(() => {
    try {
      const welcomeNotification = {
        id: `welcome-${Date.now()}`,
        type: 'welcome',
        icon: '🚀',
        title: 'Welcome to COSMOS',
        message: 'Real-time space dashboard is ready! Explore the universe with live data.',
        time: new Date(),
        priority: 'low',
        action: 'Explore'
      }

      setNotifications([welcomeNotification])

      if (notificationPermission === 'granted') {
        sendNativeNotification(welcomeNotification)
      }
    } catch (error) {
      console.error('🔔 COSMOS: Welcome notification error:', error)
    }
  }, [notificationPermission])

  const generatePeriodicNotifications = useCallback(() => {
    if (!validateSpaceData(spaceData)) {
      return
    }

    try {
      const newNotifications = []
      const now = new Date()

      // ISS Pass Notification (very infrequent)
      if (Math.random() > 0.95) {
        try {
          const notification = {
            id: `iss-${Date.now()}`,
            type: 'iss',
            icon: '🛰️',
            title: 'ISS Visible Tonight',
            message: `The International Space Station will be visible from your location tonight at ${new Date(now.getTime() + 8 * 60 * 60 * 1000).toLocaleTimeString()}`,
            time: now,
            priority: 'high',
            action: 'View Tracker',
            persistent: false
          }

          newNotifications.push(notification)

          if (notificationPermission === 'granted') {
            sendNativeNotification(notification)
          }
        } catch (issError) {
          console.error('🔔 COSMOS: ISS notification error:', issError)
        }
      }

      // Launch Alert - Super safe access
      try {
        const launch = spaceData.nextLaunch
        if (launch &&
            typeof launch.daysUntil === 'number' &&
            !isNaN(launch.daysUntil) &&
            launch.daysUntil <= 1 &&
            launch.name) {

          const notification = {
            id: `launch-${Date.now()}`,
            type: 'launch',
            icon: '🚀',
            title: 'Launch Alert',
            message: `${launch.name} is launching in ${launch.daysUntil} day(s). Don't miss this historic moment!`,
            time: now,
            priority: 'urgent',
            action: 'Watch Live',
            persistent: true
          }

          newNotifications.push(notification)

          if (notificationPermission === 'granted') {
            sendNativeNotification(notification)
          }
        }
      } catch (launchError) {
        console.error('🔔 COSMOS: Launch notification error:', launchError)
      }

      // Space Weather Alert - Ultra safe
      try {
        if (spaceWeather &&
            spaceWeather.level &&
            typeof spaceWeather.level === 'string' &&
            (spaceWeather.level === 'High' || spaceWeather.level === 'Severe')) {

          const notification = {
            id: `weather-${Date.now()}`,
            type: 'weather',
            icon: '☀️',
            title: 'Space Weather Alert',
            message: `${spaceWeather.level} solar activity detected. Beautiful aurora displays may be visible at high latitudes tonight!`,
            time: now,
            priority: spaceWeather.level === 'Severe' ? 'urgent' : 'medium',
            action: 'View Details',
            persistent: false
          }

          newNotifications.push(notification)

          if (notificationPermission === 'granted') {
            sendNativeNotification(notification)
          }
        }
      } catch (weatherError) {
        console.error('🔔 COSMOS: Weather notification error:', weatherError)
      }

      // Update notifications state safely
      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const updated = [...newNotifications, ...prev].slice(0, 6)
          return updated
        })
        setHasNewNotifications(true)
      }

    } catch (error) {
      console.error('🔔 COSMOS: Error generating periodic notifications:', error)
    }
  }, [spaceData, spaceWeather, notificationPermission, validateSpaceData])

  useEffect(() => {
    // Initialize push notifications
    initializePushNotifications()

    // Wait for valid spaceData
    if (!validateSpaceData(spaceData)) {
      return
    }

    // Track data changes to avoid duplicate initializations
    const dataChecksum = JSON.stringify({
      issLocation: spaceData.iss?.location,
      peopleCount: spaceData.peopleInSpace?.count,
      launchName: spaceData.nextLaunch?.name
    })

    if (lastDataCheck === dataChecksum) {
      return // Data hasn't changed, skip initialization
    }

    setLastDataCheck(dataChecksum)

    // Initialize welcome notification once per session
    if (!isInitialized) {
      setIsInitialized(true)
      generateWelcomeNotification()
    }

    // Set up periodic notifications with much longer intervals
    const interval = setInterval(generatePeriodicNotifications, 120000) // Every 2 minutes

    return () => clearInterval(interval)
  }, [spaceData, spaceWeather, isInitialized, lastDataCheck, validateSpaceData, generateWelcomeNotification, generatePeriodicNotifications])

  const initializePushNotifications = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (subscription) {
          setPushSubscription(subscription)
          console.log('🔔 COSMOS: Push subscription active')
        }
      } catch (error) {
        console.error('🔔 COSMOS: Push notification setup failed', error)
      }
    }
  }

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        setNotificationPermission(permission)

        if (permission === 'granted') {
          await subscribeToPushNotifications()

          if (typeof Notification !== 'undefined') {
            new Notification('🚀 COSMOS Notifications Enabled', {
              body: 'You\'ll receive alerts about space events, launches, and ISS passes',
              icon: '/icon-192.png',
              tag: 'permission-granted'
            })
          }
        }
      } catch (error) {
        console.error('🔔 COSMOS: Notification permission error:', error)
      }
    }
  }

  const subscribeToPushNotifications = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BCqUKaeDyTMfRX0v2_RVXC4oCDTFWfJU4Qcfam1GnK3g7RFNZ1MlVgLH4_iGUZ8r5tQhYZp0xUe3Q9UhYvS2_ck'
          )
        })

        setPushSubscription(subscription)
        console.log('🔔 COSMOS: Subscribed to push notifications')

      } catch (error) {
        console.error('🔔 COSMOS: Push subscription failed', error)
      }
    }
  }

  const sendNativeNotification = (notification) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const nativeNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          tag: notification.id,
          data: {
            url: '/',
            action: notification.action
          },
          requireInteraction: notification.persistent || false
        })

        nativeNotification.onclick = () => {
          if (typeof window !== 'undefined') {
            window.focus()
            nativeNotification.close()
          }
        }

        if (!notification.persistent) {
          setTimeout(() => nativeNotification.close(), 10000)
        }
      } catch (error) {
        console.error('🔔 COSMOS: Native notification error:', error)
      }
    }
  }

  const urlBase64ToUint8Array = (base64String) => {
    try {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    } catch (error) {
      console.error('🔔 COSMOS: Base64 conversion error:', error)
      return new Uint8Array()
    }
  }

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

  const clearAllNotifications = () => {
    setNotifications([])
    setHasNewNotifications(false)
  }

  // Don't render if no valid space data yet
  if (!validateSpaceData(spaceData)) {
    return null
  }

  return (
    <>
      {/* Enhanced Notification Bell */}
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
          width: '400px',
          maxHeight: '600px',
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'slideIn 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc, #ffffff)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔔 COSMOS Alerts
                {hasNewNotifications && (
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    NEW
                  </span>
                )}
              </h4>

              <div style={{ display: 'flex', gap: '8px' }}>
                {notificationPermission !== 'granted' && (
                  <button
                    onClick={requestNotificationPermission}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Enable
                  </button>
                )}

                <button
                  onClick={clearAllNotifications}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%'
              }} />
              <span style={{ color: '#64748b' }}>
                System operational • ravixalgorithm • {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{
            maxHeight: '450px',
            overflowY: 'auto'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌌</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  All Quiet in Space
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  No new notifications.<br/>
                  We'll alert you about space events!
                </div>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '20px',
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
                    gap: '16px'
                  }}>
                    <div style={{
                      fontSize: '28px',
                      marginTop: '2px'
                    }}>
                      {notification.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '6px'
                      }}>
                        <h5 style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '700',
                          color: getPriorityColor(notification.priority),
                          lineHeight: '1.3'
                        }}>
                          {notification.title}
                        </h5>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            clearNotification(notification.id)
                          }}
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      <p style={{
                        margin: '0 0 12px 0',
                        fontSize: '13px',
                        color: '#64748b',
                        lineHeight: '1.5'
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
                            padding: '6px 12px',
                            backgroundColor: getPriorityColor(notification.priority),
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            {notification.action}
                          </button>
                        )}
                      </div>

                      {/* Priority indicator */}
                      {notification.priority === 'urgent' && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          backgroundColor: '#ef4444'
                        }} />
                      )}
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

export default SafeNotificationSystem
