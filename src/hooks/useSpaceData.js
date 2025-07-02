import { useState, useEffect } from 'react'

export const useSpaceData = () => {
  const [spaceData, setSpaceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🚀 useSpaceData: Starting mock space data simulation...')
    console.log('📅 Time: 2025-07-02 16:07:55 UTC')
    console.log('👤 User: ravixalgorithm')

    const generateRealtimeSpaceData = () => {
      const now = new Date()

      // Simulate ISS orbital position (realistic movement)
      const minutesSinceMidnight = (now.getHours() * 60) + now.getMinutes()
      const orbitalProgress = (minutesSinceMidnight / 1440) * 16 // ISS completes ~16 orbits per day

      // Calculate realistic ISS coordinates
      const latitude = 51.6 * Math.sin((orbitalProgress * 2 * Math.PI) + (now.getSeconds() / 60))
      const longitude = ((orbitalProgress * 360) % 360) - 180 + (now.getSeconds() * 0.25)

      // FIXED: Use unique, stable object structure
      return {
        issData: { // Changed from 'iss' to 'issData' to avoid conflicts
          location: getLocationFromCoords(latitude, longitude),
          latitude: parseFloat(latitude.toFixed(4)),
          longitude: parseFloat(longitude.toFixed(4)),
          speed: (27600 + Math.floor(Math.random() * 100 - 50)).toLocaleString(),
          altitude: (408 + Math.floor(Math.random() * 10 - 5)).toString(),
          velocity: 7.66,
          nextPass: getNextPassTime(),
          orbitNumber: Math.floor(orbitalProgress) + 47234,
          timestamp: now.toISOString() // Add unique timestamp
        },
        crewData: { // Changed from 'peopleInSpace' for clarity
          count: 7,
          people: [
            { id: 'crew-1', name: 'Sunita Williams', craft: 'ISS', agency: 'NASA', country: 'USA' },
            { id: 'crew-2', name: 'Butch Wilmore', craft: 'ISS', agency: 'NASA', country: 'USA' },
            { id: 'crew-3', name: 'Nick Hague', craft: 'ISS', agency: 'NASA', country: 'USA' },
            { id: 'crew-4', name: 'Aleksandr Gorbunov', craft: 'ISS', agency: 'Roscosmos', country: 'Russia' },
            { id: 'crew-5', name: 'Don Pettit', craft: 'ISS', agency: 'NASA', country: 'USA' },
            { id: 'crew-6', name: 'Alexey Ovchinin', craft: 'ISS', agency: 'Roscosmos', country: 'Russia' },
            { id: 'crew-7', name: 'Ivan Vagner', craft: 'ISS', agency: 'Roscosmos', country: 'Russia' }
          ]
        },
        launchData: { // Changed from 'nextLaunch' for clarity
          name: 'USSF-44',
          daysUntil: 0,
          hoursUntil: Math.floor(Math.random() * 12) + 1,
          minutesUntil: Math.floor(Math.random() * 60),
          rocket: 'Falcon Heavy',
          launchSite: 'Kennedy Space Center',
          mission: 'Space Force Satellite Deployment',
          probability: '95%',
          weather: 'Favorable',
          id: 'launch-' + now.getTime() // Unique ID
        },
        marsData: { // Changed from 'mars' for clarity
          sol: 7641 + Math.floor((now - new Date('2024-01-01')) / (1000 * 60 * 60 * 24 * 1.027)),
          temperature: -79 + Math.floor(Math.random() * 20 - 10),
          season: 'Northern Summer',
          weather: getMarsWeather(),
          pressure: (6.36 + Math.random() * 0.5).toFixed(2) + ' mbar',
          windSpeed: Math.floor(Math.random() * 15) + 5 + ' m/s',
          id: 'mars-' + now.getTime() // Unique ID
        },
        weatherData: { // Changed from 'spaceWeather' for clarity
          solarWind: (400 + Math.floor(Math.random() * 200)).toString() + ' km/s',
          kpIndex: (Math.random() * 9).toFixed(1),
          solarFlareRisk: getSolarFlareRisk(),
          geomagneticStorm: getGeomagneticStatus(),
          radiation: 'Moderate',
          aurora: getAuroraActivity(),
          id: 'weather-' + now.getTime() // Unique ID
        },
        satelliteData: { // Changed from 'satellites' for clarity
          active: 8647 + Math.floor(Math.random() * 10),
          debris: 34000 + Math.floor(Math.random() * 100),
          tracked: 47000 + Math.floor(Math.random() * 50),
          id: 'satellites-' + now.getTime() // Unique ID
        },
        // Add generation timestamp to prevent duplicate keys
        generatedAt: now.toISOString(),
        updateId: 'data-' + now.getTime() // Unique update identifier
      }
    }

    const fetchSpaceData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('🛰️ Generating real-time space data with unique keys...')

        // Simulate realistic API response time
        const loadTime = 800 + Math.random() * 400 // 800-1200ms
        await new Promise(resolve => setTimeout(resolve, loadTime))

        const newData = generateRealtimeSpaceData()

        console.log('✅ Space data generated with unique IDs:', {
          issLocation: newData.issData.location,
          coordinates: `${newData.issData.latitude}, ${newData.issData.longitude}`,
          peopleCount: newData.crewData.count,
          marsSol: newData.marsData.sol,
          updateId: newData.updateId
        })

        setSpaceData(newData)
        setLastUpdated(new Date())
        setLoading(false)

      } catch (err) {
        console.error('🚨 Error in space data generation:', err)
        setError(err)

        // Emergency fallback data with unique keys
        const emergencyData = {
          issData: {
            location: 'Pacific Ocean',
            latitude: 0,
            longitude: 0,
            speed: '27,600',
            altitude: '408',
            id: 'emergency-iss-' + Date.now()
          },
          crewData: {
            count: 7,
            people: [],
            id: 'emergency-crew-' + Date.now()
          },
          launchData: {
            name: 'USSF-44',
            daysUntil: 0,
            rocket: 'Falcon Heavy',
            id: 'emergency-launch-' + Date.now()
          },
          marsData: {
            sol: 7641,
            temperature: -79,
            season: 'Northern Summer',
            id: 'emergency-mars-' + Date.now()
          },
          generatedAt: new Date().toISOString(),
          updateId: 'emergency-' + Date.now()
        }

        setSpaceData(emergencyData)
        setLoading(false)
      }
    }

    // Initial fetch with delay to prevent immediate re-renders
    const initialTimeout = setTimeout(fetchSpaceData, 100)

    // Update every 30 seconds (increased from 10 to reduce re-renders)
    const interval = setInterval(fetchSpaceData, 30000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, []) // Empty dependency array to prevent infinite re-renders

  console.log('🔄 useSpaceData state:', {
    loading,
    hasData: !!spaceData,
    error: !!error,
    lastUpdate: lastUpdated?.toISOString(),
    updateId: spaceData?.updateId
  })

  return {
    spaceData,
    loading: loading || !spaceData,
    lastUpdated,
    error,
    isLoading: loading || !spaceData
  }
}

// Helper Functions (unchanged but added to prevent import issues)
const getLocationFromCoords = (lat, lon) => {
  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)

  if (latitude > 40 && longitude > -10 && longitude < 40) return 'Europe'
  if (latitude > 20 && longitude > 95 && longitude < 140) return 'East Asia'
  if (latitude > 25 && longitude > -125 && longitude < -60) return 'North America'
  if (latitude < -20 && longitude > 110 && longitude < 155) return 'Australia'
  if (latitude < -30 && longitude > -80 && longitude < -30) return 'South America'
  if (latitude > 0 && longitude > -30 && longitude < 60) return 'Africa'

  if (longitude > -180 && longitude < -60) {
    return latitude > 0 ? 'North Pacific Ocean' : 'South Pacific Ocean'
  }
  if (longitude > -60 && longitude < 20) {
    return latitude > 0 ? 'North Atlantic Ocean' : 'South Atlantic Ocean'
  }
  if (longitude > 20 && longitude < 180) {
    return latitude > 0 ? 'North Pacific Ocean' : 'Indian Ocean'
  }

  return 'Pacific Ocean'
}

const getNextPassTime = () => {
  const now = new Date()
  const nextPass = new Date(now.getTime() + (Math.random() * 6 + 2) * 60 * 60 * 1000)
  return nextPass.toISOString().slice(11, 19) + ' UTC'
}

const getMarsWeather = () => {
  const weather = ['Clear', 'Dusty', 'Dust Storm', 'Partly Cloudy', 'Windy']
  return weather[Math.floor(Math.random() * weather.length)]
}

const getSolarFlareRisk = () => {
  const risks = ['Low', 'Moderate', 'Elevated', 'High']
  const weights = [0.5, 0.3, 0.15, 0.05]
  const random = Math.random()
  let cumulative = 0

  for (let i = 0; i < risks.length; i++) {
    cumulative += weights[i]
    if (random <= cumulative) return risks[i]
  }
  return 'Low'
}

const getGeomagneticStatus = () => {
  const statuses = ['Quiet', 'Unsettled', 'Active', 'Minor Storm', 'Major Storm']
  const weights = [0.4, 0.3, 0.2, 0.08, 0.02]
  const random = Math.random()
  let cumulative = 0

  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i]
    if (random <= cumulative) return statuses[i]
  }
  return 'Quiet'
}

const getAuroraActivity = () => {
  const activities = ['Low', 'Moderate', 'High', 'Very High']
  return activities[Math.floor(Math.random() * activities.length)]
}
