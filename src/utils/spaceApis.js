import axios from 'axios'

// Create axios instance with better error handling
const apiClient = axios.create({
  timeout: 5000, // 5 second timeout
})

// Mock data for fallbacks when APIs fail
const MOCK_DATA = {
  iss: {
    speed: '27,600',
    location: 'Pacific Ocean',
    altitude: '408',
    latitude: '39.9',
    longitude: '-114.4'
  },
  people: {
    count: 7,
    people: [
      { name: 'Oleg Kononenko', craft: 'ISS' },
      { name: 'Nikolai Chub', craft: 'ISS' },
      { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
      { name: 'Matthew Dominick', craft: 'ISS' },
      { name: 'Mike Barratt', craft: 'ISS' },
      { name: 'Jeanette Epps', craft: 'ISS' },
      { name: 'Butch Wilmore', craft: 'ISS' }
    ]
  },
  launches: {
    name: 'USSF-44',
    daysUntil: 0,
    rocket: 'Falcon Heavy'
  },
  mars: {
    sol: 7641,
    temperature: -79,
    season: 'Northern Summer'
  }
}

// Enhanced ISS data with live simulation
export const getISSData = async () => {
  try {
    // Try the API first
    const response = await apiClient.get('https://api.open-notify.org/iss-now.json')
    const { latitude, longitude } = response.data.iss_position

    return {
      speed: '27,600',
      location: `${parseFloat(latitude).toFixed(1)}°, ${parseFloat(longitude).toFixed(1)}°`,
      altitude: '408',
      latitude: parseFloat(latitude).toFixed(1),
      longitude: parseFloat(longitude).toFixed(1)
    }
  } catch (error) {
    console.log('Using simulated ISS data due to API limitations')

    // Simulate live ISS movement
    const now = new Date()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    // Simulate orbital movement
    const baseLatitude = 39.9
    const baseLongitude = -114.4
    const latOffset = Math.sin((minutes * 60 + seconds) / 3600 * Math.PI * 2) * 51.6 // ISS orbital inclination
    const lngOffset = ((minutes * 60 + seconds) / 3600) * 360 - 180 // Complete orbit simulation

    const currentLat = (baseLatitude + latOffset).toFixed(1)
    const currentLng = ((baseLongitude + lngOffset + 360) % 360 - 180).toFixed(1)

    return {
      speed: '27,600',
      location: `${currentLat}°, ${currentLng}°`,
      altitude: '408',
      latitude: currentLat,
      longitude: currentLng
    }
  }
}

// People in space with enhanced data
export const getPeopleInSpace = async () => {
  try {
    const response = await apiClient.get('https://api.open-notify.org/astros.json')
    return {
      count: response.data.number,
      people: response.data.people
    }
  } catch (error) {
    console.log('Using simulated crew data due to API limitations')
    return MOCK_DATA.people
  }
}

// SpaceX launches with better error handling
export const getNextLaunch = async () => {
  try {
    const response = await apiClient.get('https://api.spacexdata.com/v4/launches/upcoming')
    const nextLaunch = response.data[0]

    if (nextLaunch) {
      const launchDate = new Date(nextLaunch.date_utc)
      const now = new Date()
      const diffTime = launchDate - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return {
        name: nextLaunch.name,
        daysUntil: diffDays > 0 ? diffDays : 0,
        rocket: nextLaunch.rocket
      }
    }

    return MOCK_DATA.launches
  } catch (error) {
    console.log('Using simulated launch data due to API limitations')
    return MOCK_DATA.launches
  }
}

// Mars Sol calculation
export const getMarsSol = () => {
  const spiritLanding = new Date('2004-01-06')
  const now = new Date()
  const diffTime = now - spiritLanding
  const earthDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const marsSol = Math.floor(earthDays / 1.027)

  return {
    sol: marsSol,
    temperature: -79 + Math.floor(Math.random() * 10) - 5, // Slight variation
    season: 'Northern Summer'
  }
}

// Real-time space weather simulation
export const getSpaceWeather = () => {
  const activities = ['Low', 'Moderate', 'High']
  const geoFields = ['Quiet', 'Unsettled', 'Active']

  return {
    solarActivity: activities[Math.floor(Math.random() * activities.length)],
    geomagneticField: geoFields[Math.floor(Math.random() * geoFields.length)],
    auroraChance: Math.floor(Math.random() * 60) + 10,
    solarWindSpeed: Math.floor(Math.random() * 200) + 300,
    kpIndex: (Math.random() * 5).toFixed(1)
  }
}

// Current moon phase
export const getMoonPhase = () => {
  const now = new Date()
  const knownNewMoon = new Date('2025-06-29')
  const daysSinceNewMoon = Math.floor((now - knownNewMoon) / (1000 * 60 * 60 * 24))
  const cycle = daysSinceNewMoon % 29.53

  let phase = 'New Moon'
  let illumination = 0
  let emoji = '🌑'

  if (cycle < 2) { phase = 'New Moon'; illumination = 0; emoji = '🌑' }
  else if (cycle < 7) { phase = 'Waxing Crescent'; illumination = Math.round(cycle * 12); emoji = '🌒' }
  else if (cycle < 9) { phase = 'First Quarter'; illumination = 50; emoji = '🌓' }
  else if (cycle < 14) { phase = 'Waxing Gibbous'; illumination = Math.round(50 + (cycle - 7) * 7); emoji = '🌔' }
  else if (cycle < 17) { phase = 'Full Moon'; illumination = 100; emoji = '🌕' }
  else if (cycle < 22) { phase = 'Waning Gibbous'; illumination = Math.round(100 - (cycle - 14) * 6); emoji = '🌖' }
  else if (cycle < 24) { phase = 'Last Quarter'; illumination = 50; emoji = '🌗' }
  else { phase = 'Waning Crescent'; illumination = Math.round(50 - (cycle - 22) * 7); emoji = '🌘' }

  return { phase, illumination, emoji, dayInCycle: Math.round(cycle) }
}
