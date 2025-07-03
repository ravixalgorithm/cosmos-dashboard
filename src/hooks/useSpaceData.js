import { useState, useEffect, useRef } from 'react'
import { fetchAllRealSpaceData, validateSpaceData } from '../utils/realSpaceApis'

export const useSpaceData = () => {
  const [spaceData, setSpaceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [dataQuality, setDataQuality] = useState('UNKNOWN')
  const [errors, setErrors] = useState([])

  const fetchAttempts = useRef(0)
  const maxRetries = 3

  const fetchData = async () => {
    try {
      fetchAttempts.current += 1
      console.log(`🔄 Fetching real space data (attempt ${fetchAttempts.current}) - 2025-07-03 08:08:11...`)

      setLoading(true)

      // Fetch real, verified space data
      const realData = await fetchAllRealSpaceData()

      // Validate the data quality
      const validation = validateSpaceData(realData)

      if (validation.isValid || fetchAttempts.current >= maxRetries) {
        setSpaceData(realData)
        setDataQuality(validation.quality)
        setErrors(validation.errors)
        setLastUpdated(realData.lastUpdated)
        setLoading(false)
        fetchAttempts.current = 0 // Reset on success

        console.log('✅ Real space data loaded successfully:', {
          quality: validation.quality,
          source: realData.source,
          timestamp: realData.lastUpdated,
          issLocation: realData.issData?.location,
          crewCount: realData.crewData?.count,
          satelliteCount: realData.satellites?.total
        })
      } else {
        throw new Error(`Data validation failed: ${validation.errors.join(', ')}`)
      }

    } catch (error) {
      console.error('🚨 Space data fetch error:', error)
      setErrors([error.message])

      if (fetchAttempts.current >= maxRetries) {
        setLoading(false)
        setDataQuality('LOW')
        console.warn('⚠️ Max retries reached, using fallback data')
      } else {
        // Retry after delay
        setTimeout(fetchData, 2000 * fetchAttempts.current)
      }
    }
  }

  useEffect(() => {
    fetchData()

    // Set up refresh interval - every 5 minutes for real data
    const interval = setInterval(fetchData, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  const refetch = () => {
    fetchAttempts.current = 0
    fetchData()
  }

  return {
    spaceData,
    loading,
    lastUpdated,
    dataQuality,
    errors,
    refetch
  }
}
