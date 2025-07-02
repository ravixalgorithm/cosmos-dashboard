import { useState, useEffect, useRef } from 'react'

const useStableSpaceData = () => {
  const [spaceData, setSpaceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const previousDataRef = useRef(null)
  const smoothingBufferRef = useRef({})

  // Smoothing function for fluctuating values
  const smoothValue = (key, newValue, smoothingFactor = 0.3) => {
    if (!smoothingBufferRef.current[key]) {
      smoothingBufferRef.current[key] = []
    }

    const buffer = smoothingBufferRef.current[key]
    buffer.push(newValue)

    // Keep only last 5 values for smoothing
    if (buffer.length > 5) {
      buffer.shift()
    }

    // Return weighted average for smoother transitions
    const weights = [0.4, 0.3, 0.2, 0.1, 0.05]
    let weightedSum = 0
    let totalWeight = 0

    for (let i = 0; i < buffer.length; i++) {
      const weight = weights[i] || 0.05
      weightedSum += buffer[buffer.length - 1 - i] * weight
      totalWeight += weight
    }

    return Math.round(weightedSum / totalWeight)
  }

  // Intelligent data comparison
  const shouldUpdateData = (oldData, newData) => {
    if (!oldData) return true

    // Define thresholds for when to update
    const thresholds = {
      satellites: 50,        // Only update if difference > 50 satellites
      auroraChance: 10,      // Only update if difference > 10%
      solarWind: 25,         // Only update if difference > 25 km/s
      kpIndex: 0.5,          // Only update if difference > 0.5
      issSpeed: 100          // Only update if difference > 100 km/h
    }

    // Check each value against threshold
    for (const [key, threshold] of Object.entries(thresholds)) {
      if (oldData[key] && newData[key]) {
        const diff = Math.abs(oldData[key] - newData[key])
        if (diff > threshold) {
          return true
        }
      }
    }

    return false
  }

  const fetchSpaceData = async () => {
    try {
      console.log('🔄 Fetching space data with stabilization...')

      // Fetch all space data
      const [issResponse, spaceWeatherResponse, satelliteResponse, marsResponse] = await Promise.all([
        fetch('http://api.open-notify.org/iss-now.json'),
        fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
        fetch('https://api.example.com/satellites'), // Replace with actual API
        fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=DEMO_KEY')
      ])

      // Process raw data
      const rawData = {
        // ISS Data
        issSpeed: 27559, // km/h (relatively stable)
        issLatitude: (await issResponse.json()).iss_position?.latitude || 0,
        issLongitude: (await issResponse.json()).iss_position?.longitude || 0,

        // Space Weather (smooth these values)
        auroraChance: smoothValue('aurora', Math.floor(Math.random() * 40) + 50), // Simulate API
        kpIndex: smoothValue('kp', (Math.random() * 3 + 2).toFixed(1)),
        solarWind: smoothValue('solar', Math.floor(Math.random() * 100) + 350),

        // Satellites (smooth these counts)
        totalSatellites: smoothValue('satellites', Math.floor(Math.random() * 100) + 8650),
        starlinkCount: smoothValue('starlink', Math.floor(Math.random() * 50) + 5200),

        // Mars Data (stable)
        marsSol: 8175, // Increments predictably
        marsTemp: -74, // Relatively stable
        marsSeason: 'Northern Summer',

        // Launches (stable count)
        launchesThisYear: 43,
        countriesInSpace: 83
      }

      // Only update if significant change or first load
      if (shouldUpdateData(previousDataRef.current, rawData) || !previousDataRef.current) {
        console.log('✅ Data update approved - significant change detected')

        setSpaceData({
          ...rawData,
          lastUpdated: new Date().toISOString(),
          updateReason: previousDataRef.current ? 'significant_change' : 'initial_load'
        })

        previousDataRef.current = rawData
      } else {
        console.log('⏸️ Data update skipped - changes below threshold')

        // Still update timestamp to show freshness
        setSpaceData(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString(),
          updateReason: 'data_stable'
        }))
      }

      setLoading(false)

    } catch (error) {
      console.error('🚨 Space data fetch error:', error)

      // Fallback to previous data if available
      if (previousDataRef.current) {
        setSpaceData(prev => ({
          ...prev,
          error: 'Update failed - showing cached data',
          lastUpdated: prev?.lastUpdated || new Date().toISOString()
        }))
      }

      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchSpaceData()

    // Set up stable refresh interval (every 2 minutes instead of 1)
    const interval = setInterval(fetchSpaceData, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [])

  return { spaceData, loading, refetch: fetchSpaceData }
}

export default useStableSpaceData
