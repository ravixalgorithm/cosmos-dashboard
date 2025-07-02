// Advanced Space APIs Mock Data - Complete Implementation
// ravixalgorithm - 2025-07-02 16:01:21 UTC

export const getAdvancedISSData = () => {
    const now = new Date()
    const minutes = now.getMinutes() + now.getSeconds() / 60

    return {
      region: getRegionFromTime(minutes),
      altitude: (408 + Math.sin(minutes * 0.1) * 5).toFixed(1),
      nextPass: getNextPassTime(),
      crew: 7,
      orbitNumber: 47234 + Math.floor(minutes / 90),
      velocity: 7.66,
      period: 92.68,
      latitude: (51.6 * Math.sin((minutes * 4 * Math.PI) / 180)).toFixed(4),
      longitude: ((minutes * 4) % 360 - 180).toFixed(4)
    }
  }

  export const getSpaceWeatherAdvanced = () => {
    const levels = [
      { level: 'Quiet', color: '#10b981', auroraChance: 5, kpIndex: '1.2' },
      { level: 'Unsettled', color: '#f59e0b', auroraChance: 25, kpIndex: '3.1' },
      { level: 'Active', color: '#ef4444', auroraChance: 65, kpIndex: '5.8' },
      { level: 'Storm', color: '#7c2d12', auroraChance: 90, kpIndex: '7.5' }
    ]

    const randomLevel = levels[Math.floor(Math.random() * levels.length)]

    return {
      ...randomLevel,
      solarWind: (350 + Math.random() * 200).toFixed(0),
      magneticField: (Math.random() * 10).toFixed(1),
      flareRisk: randomLevel.level === 'Storm' ? 'High' : 'Low',
      radiation: randomLevel.level === 'Storm' ? 'Elevated' : 'Normal',
      alerts: randomLevel.level === 'Storm' ? ['Geomagnetic Storm Warning'] : []
    }
  }

  export const getNEOData = () => {
    const asteroids = [
      '2025 AB', '2025 BC', '2025 CD', '2025 DE', '2025 EF',
      '2025 FG', '2025 GH', '2025 HI', '2025 IJ', '2025 JK'
    ]

    return {
      count: Math.floor(Math.random() * 5) + 1,
      closest: {
        name: asteroids[Math.floor(Math.random() * asteroids.length)] + Math.floor(Math.random() * 100),
        distance: (Math.random() * 0.1 + 0.05).toFixed(4),
        size: Math.floor(Math.random() * 500) + 50,
        speed: (Math.random() * 20 + 10).toFixed(1),
        hazardous: Math.random() < 0.1
      },
      thisWeek: Math.floor(Math.random() * 20) + 5,
      thisMonth: Math.floor(Math.random() * 100) + 50
    }
  }

  export const getSatelliteData = () => {
    return {
      total: 8647 + Math.floor(Math.random() * 50),
      starlink: 5234 + Math.floor(Math.random() * 20),
      launchesThisYear: 42 + Math.floor(Math.random() * 5),
      debris: 34000 + Math.floor(Math.random() * 100),
      countries: 89,
      operational: 5432 + Math.floor(Math.random() * 30),
      inactive: 3215 + Math.floor(Math.random() * 20)
    }
  }

  // NEW: Space News Export (MISSING EXPORT FIX)
  export const getSpaceNews = () => {
    const headlines = [
      "🚀 SpaceX Falcon Heavy Successfully Launches USSF-44 Mission",
      "🛰️ ISS Crew Conducts Spacewalk for Station Maintenance",
      "🔴 NASA's Perseverance Rover Discovers New Mineral Formations on Mars",
      "🌟 James Webb Telescope Captures Most Distant Galaxy Ever Observed",
      "🚀 Artemis III Mission Timeline Updated for Lunar Landing",
      "🛰️ European Space Agency Announces New Earth Observation Satellite",
      "☄️ Asteroid 2025 AB Makes Close Approach to Earth",
      "🌍 New Climate Monitoring Satellites Deployed Successfully",
      "🚀 Private Space Companies Report Record Launch Numbers for 2025",
      "🔬 International Space Station Experiments Yield Breakthrough Results"
    ]

    const agencies = ['NASA', 'SpaceX', 'ESA', 'Blue Origin', 'Roscosmos', 'JAXA', 'ISRO']

    const newsItems = []
    const numItems = Math.floor(Math.random() * 3) + 3 // 3-5 news items

    for (let i = 0; i < numItems; i++) {
      const headline = headlines[Math.floor(Math.random() * headlines.length)]
      const agency = agencies[Math.floor(Math.random() * agencies.length)]
      const hoursAgo = Math.floor(Math.random() * 24) + 1

      newsItems.push({
        id: `news-${Date.now()}-${i}`,
        headline,
        agency,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        hoursAgo,
        category: getNewsCategory(headline),
        importance: Math.random() > 0.7 ? 'high' : 'normal'
      })
    }

    return {
      items: newsItems,
      lastUpdated: new Date().toISOString(),
      totalToday: Math.floor(Math.random() * 10) + 5
    }
  }

  // NEW: Launch Data Export
  export const getLaunchData = () => {
    const missions = [
      { name: 'USSF-44', rocket: 'Falcon Heavy', agency: 'SpaceX' },
      { name: 'Artemis III', rocket: 'SLS', agency: 'NASA' },
      { name: 'Europa Clipper', rocket: 'Falcon Heavy', agency: 'NASA' },
      { name: 'JWST Successor', rocket: 'Ariane 6', agency: 'ESA' },
      { name: 'Mars Sample Return', rocket: 'SLS', agency: 'NASA' }
    ]

    const nextLaunch = missions[Math.floor(Math.random() * missions.length)]
    const daysUntil = Math.floor(Math.random() * 30)
    const hoursUntil = Math.floor(Math.random() * 24)

    return {
      next: {
        ...nextLaunch,
        daysUntil,
        hoursUntil,
        minutesUntil: Math.floor(Math.random() * 60),
        probability: Math.floor(Math.random() * 20) + 80, // 80-100%
        weather: Math.random() > 0.3 ? 'Favorable' : 'Marginal',
        launchSite: getRandomLaunchSite()
      },
      thisWeek: Math.floor(Math.random() * 5) + 2,
      thisMonth: Math.floor(Math.random() * 20) + 8,
      thisYear: 157 + Math.floor(Math.random() * 10)
    }
  }

  // NEW: Astronaut Data Export
  export const getAstronautData = () => {
    const astronauts = [
      { name: 'Sunita Williams', agency: 'NASA', mission: 'Expedition 72', country: '🇺🇸' },
      { name: 'Butch Wilmore', agency: 'NASA', mission: 'Expedition 72', country: '🇺🇸' },
      { name: 'Nick Hague', agency: 'NASA', mission: 'Expedition 72', country: '🇺🇸' },
      { name: 'Aleksandr Gorbunov', agency: 'Roscosmos', mission: 'Expedition 72', country: '🇷🇺' },
      { name: 'Don Pettit', agency: 'NASA', mission: 'Expedition 72', country: '🇺🇸' },
      { name: 'Alexey Ovchinin', agency: 'Roscosmos', mission: 'Expedition 72', country: '🇷🇺' },
      { name: 'Ivan Vagner', agency: 'Roscosmos', mission: 'Expedition 72', country: '🇷🇺' }
    ]

    return {
      current: astronauts,
      totalInSpace: astronauts.length,
      onISS: astronauts.length,
      agencies: [...new Set(astronauts.map(a => a.agency))],
      countries: [...new Set(astronauts.map(a => a.country))],
      averageMissionDuration: Math.floor(Math.random() * 100) + 150, // days
      recordHolder: 'Valeri Polyakov (437 days)'
    }
  }

  // NEW: Mars Data Export
  export const getMarsData = () => {
    const now = new Date()
    const sol = 7641 + Math.floor((now - new Date('2024-01-01')) / (1000 * 60 * 60 * 24 * 1.027))

    return {
      sol,
      temperature: {
        current: -79 + Math.floor(Math.random() * 20 - 10),
        high: -45 + Math.floor(Math.random() * 10),
        low: -95 + Math.floor(Math.random() * 10)
      },
      weather: getMarsWeather(),
      pressure: (6.36 + Math.random() * 0.5).toFixed(2),
      windSpeed: Math.floor(Math.random() * 15) + 5,
      season: 'Northern Summer',
      rovers: {
        perseverance: { status: 'Active', location: 'Jezero Crater' },
        curiosity: { status: 'Active', location: 'Gale Crater' },
        opportunity: { status: 'Inactive', location: 'Meridiani Planum' }
      }
    }
  }

  // NEW: Space Station Data Export
  export const getSpaceStationData = () => {
    return {
      iss: {
        altitude: 408 + Math.floor(Math.random() * 10 - 5),
        speed: 27600 + Math.floor(Math.random() * 100 - 50),
        crew: 7,
        experiments: 245 + Math.floor(Math.random() * 10),
        nextResupply: Math.floor(Math.random() * 30) + 15,
        status: 'Operational'
      },
      tiangong: {
        altitude: 340 + Math.floor(Math.random() * 20),
        crew: 3,
        status: 'Operational',
        agency: 'CNSA'
      }
    }
  }

  // Helper Functions
  const getRegionFromTime = (minutes) => {
    const regions = [
      'Pacific Ocean', 'North America', 'Atlantic Ocean', 'Europe',
      'Africa', 'Indian Ocean', 'Asia', 'South America', 'Antarctica',
      'Arctic Ocean', 'Mediterranean Sea', 'Caribbean Sea'
    ]
    return regions[Math.floor(minutes / 7.5) % regions.length]
  }

  const getNextPassTime = () => {
    const now = new Date()
    const nextPass = new Date(now.getTime() + (Math.random() * 6 + 2) * 60 * 60 * 1000)
    return nextPass.toISOString().slice(11, 19) + ' UTC'
  }

  const getMarsWeather = () => {
    const weather = ['Clear', 'Dusty', 'Dust Storm', 'Partly Cloudy', 'Windy', 'Hazy']
    const weights = [0.3, 0.2, 0.1, 0.15, 0.15, 0.1]
    const random = Math.random()
    let cumulative = 0

    for (let i = 0; i < weather.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) return weather[i]
    }
    return 'Clear'
  }

  const getNewsCategory = (headline) => {
    if (headline.includes('🚀')) return 'launches'
    if (headline.includes('🛰️')) return 'satellites'
    if (headline.includes('🔴') || headline.includes('Mars')) return 'mars'
    if (headline.includes('🌟') || headline.includes('telescope')) return 'astronomy'
    if (headline.includes('🌍')) return 'earth'
    return 'general'
  }

  const getRandomLaunchSite = () => {
    const sites = [
      'Kennedy Space Center, FL',
      'Vandenberg Space Force Base, CA',
      'Boca Chica, TX',
      'Wallops Flight Facility, VA',
      'Kourou, French Guiana',
      'Baikonur Cosmodrome, Kazakhstan'
    ]
    return sites[Math.floor(Math.random() * sites.length)]
  }

  // Consolidated export for backwards compatibility
  export const spaceApiData = {
    getAdvancedISSData,
    getSpaceWeatherAdvanced,
    getNEOData,
    getSatelliteData,
    getSpaceNews,
    getLaunchData,
    getAstronautData,
    getMarsData,
    getSpaceStationData
  }

  console.log('✅ advancedSpaceApis.js: All exports loaded successfully')
  console.log('📅 Time: 2025-07-02 16:01:21 UTC')
  console.log('👤 User: ravixalgorithm')
  console.log('🔧 Available exports:', Object.keys(spaceApiData))
