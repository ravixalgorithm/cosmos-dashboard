import React, { useState, useEffect } from 'react'
import SafeNotificationSystem from './SafeNotificationSystem'

const NotificationWrapper = ({ spaceData, spaceWeather, activeSection }) => {
  const [isDataReady, setIsDataReady] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 5

  // Comprehensive data readiness check
  const checkDataReadiness = (data) => {
    try {
      const isReady = (
        data &&
        typeof data === 'object' &&
        data.iss &&
        typeof data.iss === 'object' &&
        data.iss.location &&
        typeof data.iss.location === 'string' &&
        data.iss.speed &&
        data.iss.altitude &&
        data.peopleInSpace &&
        typeof data.peopleInSpace === 'object' &&
        typeof data.peopleInSpace.count === 'number' &&
        data.nextLaunch &&
        typeof data.nextLaunch === 'object' &&
        data.nextLaunch.name &&
        typeof data.nextLaunch.daysUntil !== 'undefined' &&
        data.mars &&
        typeof data.mars === 'object' &&
        typeof data.mars.sol === 'number'
      )

      return isReady
    } catch (error) {
      console.error('🔔 COSMOS: Data readiness check error:', error)
      return false
    }
  }

  useEffect(() => {
    if (checkDataReadiness(spaceData)) {
      setIsDataReady(true)
      setRetryCount(0)
    } else if (spaceData && retryCount < maxRetries) {
      // Data exists but incomplete, retry after delay
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [spaceData, retryCount, maxRetries])

  // Only render notifications if data is completely ready
  if (!isDataReady || !spaceData) {
    // Show a small loading indicator in development
    if (process.env.NODE_ENV === 'development') {
      return (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '80px',
          padding: '8px 12px',
          backgroundColor: 'rgba(249, 115, 22, 0.9)',
          color: 'white',
          borderRadius: '16px',
          fontSize: '11px',
          fontWeight: '600',
          zIndex: 999,
          backdropFilter: 'blur(8px)'
        }}>
          🔔 Waiting for space data... ({retryCount}/{maxRetries})
        </div>
      )
    }
    return null
  }

  return (
    <SafeNotificationSystem
      spaceData={spaceData}
      spaceWeather={spaceWeather}
    />
  )
}

export default NotificationWrapper
