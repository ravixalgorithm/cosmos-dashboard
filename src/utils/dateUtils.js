// Safe date formatting utilities for COSMOS Dashboard
// Created: 2025-07-03 08:13:55 UTC

export const formatTimestamp = (timestamp, options = {}) => {
    if (!timestamp) return 'Never'

    try {
      // Handle different timestamp formats
      let date

      if (typeof timestamp === 'string') {
        date = new Date(timestamp)
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        console.warn('⚠️ Unknown timestamp format:', typeof timestamp, timestamp)
        return 'Invalid format'
      }

      // Validate the date
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Invalid date value:', timestamp)
        return 'Invalid date'
      }

      // Default formatting options
      const defaultOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }

      const formatOptions = { ...defaultOptions, ...options }

      return date.toLocaleTimeString('en-US', formatOptions)

    } catch (error) {
      console.error('🚨 Date formatting error:', error, 'Timestamp:', timestamp)
      return 'Format error'
    }
  }

  export const formatDate = (timestamp, options = {}) => {
    if (!timestamp) return 'Unknown'

    try {
      let date

      if (typeof timestamp === 'string') {
        date = new Date(timestamp)
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        return 'Invalid format'
      }

      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }

      const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }

      const formatOptions = { ...defaultOptions, ...options }

      return date.toLocaleDateString('en-US', formatOptions)

    } catch (error) {
      console.error('🚨 Date formatting error:', error)
      return 'Format error'
    }
  }

  export const isValidTimestamp = (timestamp) => {
    if (!timestamp) return false

    try {
      let date

      if (typeof timestamp === 'string') {
        date = new Date(timestamp)
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        return false
      }

      return !isNaN(date.getTime())

    } catch (error) {
      return false
    }
  }

  export default {
    formatTimestamp,
    formatDate,
    isValidTimestamp
  }
