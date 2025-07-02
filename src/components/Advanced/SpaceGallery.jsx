import React, { useState, useEffect } from 'react'
import { getSpaceNews } from '../../utils/advancedSpaceApis'

const SpaceGallery = () => {
  const [activeTab, setActiveTab] = useState('images')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [news, setNews] = useState([]) // Initialize as empty array
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Space images data
  const spaceImages = [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      title: 'International Space Station',
      description: 'ISS orbiting Earth at 408km altitude',
      credit: 'NASA',
      timestamp: '2025-07-02T19:28:49Z'
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&h=600&fit=crop',
      title: 'Earth from Space',
      description: 'Blue marble view of our home planet',
      credit: 'NASA',
      timestamp: '2025-07-02T19:28:49Z'
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800&h=600&fit=crop',
      title: 'Milky Way Galaxy',
      description: 'Our galaxy as seen from Earth',
      credit: 'NASA Hubble',
      timestamp: '2025-07-02T19:28:49Z'
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
      title: 'Space Nebula',
      description: 'Colorful stellar nursery in deep space',
      credit: 'NASA Hubble',
      timestamp: '2025-07-02T19:28:49Z'
    },
    {
      id: 'img-5',
      url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=600&fit=crop',
      title: 'Mars Surface',
      description: 'Red planet landscape from rover perspective',
      credit: 'NASA JPL',
      timestamp: '2025-07-02T19:28:49Z'
    }
  ]

  // Fetch news data safely
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('🗞️ SpaceGallery: Fetching space news...')

        const newsData = await getSpaceNews()
        console.log('📰 SpaceGallery: News data received:', newsData)

        // Validate news data structure
        if (newsData && Array.isArray(newsData.items)) {
          setNews(newsData.items)
          console.log('✅ SpaceGallery: News set successfully, count:', newsData.items.length)
        } else if (Array.isArray(newsData)) {
          // Handle case where newsData is directly an array
          setNews(newsData)
          console.log('✅ SpaceGallery: News array set directly, count:', newsData.length)
        } else {
          console.warn('⚠️ SpaceGallery: Invalid news data structure, using fallback')
          setNews(getFallbackNews())
        }

      } catch (error) {
        console.error('🚨 SpaceGallery: Error fetching news:', error)
        setError(error)
        setNews(getFallbackNews())
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Update news every 5 minutes
    const newsInterval = setInterval(fetchNews, 300000)

    return () => clearInterval(newsInterval)
  }, [])

  // Auto-advance images every 10 seconds
  useEffect(() => {
    if (activeTab === 'images') {
      const imageInterval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % spaceImages.length)
      }, 10000)

      return () => clearInterval(imageInterval)
    }
  }, [activeTab, spaceImages.length])

  // Fallback news function
  const getFallbackNews = () => {
    return [
      {
        id: 'fallback-1',
        headline: '🚀 COSMOS Dashboard Successfully Operational',
        agency: 'ravixalgorithm',
        timestamp: new Date().toISOString(),
        hoursAgo: 0,
        category: 'system',
        importance: 'high'
      },
      {
        id: 'fallback-2',
        headline: '🛰️ Real-Time Space Data Simulation Active',
        agency: 'COSMOS',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        hoursAgo: 1,
        category: 'data',
        importance: 'normal'
      },
      {
        id: 'fallback-3',
        headline: '🌟 Space Gallery Displaying Latest Images',
        agency: 'NASA',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        hoursAgo: 2,
        category: 'gallery',
        importance: 'normal'
      }
    ]
  }

  const handleTabClick = (tab) => {
    console.log(`🖱️ SpaceGallery: Tab clicked: ${activeTab} → ${tab}`)
    setActiveTab(tab)
  }

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex(prev => (prev + 1) % spaceImages.length)
    } else {
      setCurrentImageIndex(prev => (prev - 1 + spaceImages.length) % spaceImages.length)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'images':
        return renderImages()
      case 'news':
        return renderNews()
      case 'data':
        return renderData()
      default:
        return renderImages()
    }
  }

  const renderImages = () => {
    const currentImage = spaceImages[currentImageIndex]

    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Responsive Image Display */}
        <div style={{
          position: 'relative',
          height: 'clamp(200px, 35vw, 300px)',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          overflow: 'hidden',
          marginBottom: 'clamp(12px, 3vw, 16px)'
        }}>
          <img
            src={currentImage.url}
            alt={currentImage.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              console.warn('🖼️ Image failed to load:', currentImage.url)
              e.target.src = 'data:image/svg+xml,%3Csvg width="800" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" font-size="24" fill="%236b7280"%3E🌌 Space Image%3C/text%3E%3C/svg%3E'
            }}
          />

          {/* Responsive Navigation Arrows */}
          <button
            onClick={() => handleImageNavigation('prev')}
            style={{
              position: 'absolute',
              left: 'clamp(8px, 2vw, 12px)',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(32px, 6vw, 40px)',
              height: 'clamp(32px, 6vw, 40px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(14px, 3vw, 18px)',
              transition: 'all 0.2s ease'
            }}
          >
            ←
          </button>

          <button
            onClick={() => handleImageNavigation('next')}
            style={{
              position: 'absolute',
              right: 'clamp(8px, 2vw, 12px)',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(32px, 6vw, 40px)',
              height: 'clamp(32px, 6vw, 40px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(14px, 3vw, 18px)',
              transition: 'all 0.2s ease'
            }}
          >
            →
          </button>

          {/* Responsive Image Counter */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(8px, 2vw, 12px)',
            right: 'clamp(8px, 2vw, 12px)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: 'clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px)',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: '600'
          }}>
            {currentImageIndex + 1} / {spaceImages.length}
          </div>
        </div>

        {/* Responsive Image Info */}
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: '0 0 clamp(6px, 1.5vw, 8px) 0',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '600',
            color: '#1f2937',
            lineHeight: '1.3'
          }}>
            {currentImage.title}
          </h4>
          <p style={{
            margin: '0 0 clamp(6px, 1.5vw, 8px) 0',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            color: '#6b7280',
            lineHeight: '1.4'
          }}>
            {currentImage.description}
          </p>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#9ca3af',
            lineHeight: '1.3'
          }}>
            Credit: {currentImage.credit} • {new Date(currentImage.timestamp).toLocaleDateString()}
          </div>
        </div>

        {/* Responsive Image Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)',
          marginTop: 'clamp(12px, 3vw, 16px)'
        }}>
          {spaceImages.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: 'clamp(6px, 1.5vw, 8px)',
                height: 'clamp(6px, 1.5vw, 8px)',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentImageIndex ? '#3b82f6' : '#d1d5db',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderNews = () => {
    console.log('📰 SpaceGallery: Rendering news, count:', news.length)

    if (loading) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'clamp(150px, 30vw, 200px)',
          color: '#6b7280'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>📡</div>
            <div style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>Loading space news...</div>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'clamp(150px, 30vw, 200px)',
          color: '#ef4444',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>⚠️</div>
            <div style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>Error loading news</div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', marginTop: 'clamp(3px, 1vw, 4px)' }}>Using fallback data</div>
          </div>
        </div>
      )
    }

    if (!Array.isArray(news) || news.length === 0) {
      console.warn('⚠️ SpaceGallery: News is not an array or empty:', news)
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'clamp(150px, 30vw, 200px)',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>📰</div>
            <div style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>No space news available</div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', marginTop: 'clamp(3px, 1vw, 4px)' }}>Check back later</div>
          </div>
        </div>
      )
    }

    return (
      <div style={{
        height: 'clamp(300px, 50vw, 400px)',
        overflowY: 'auto'
      }}>
        {news.map((article, index) => {
          // Safety check for each article
          if (!article || typeof article !== 'object') {
            console.warn('⚠️ Invalid article at index:', index, article)
            return null
          }

          return (
            <div
              key={article.id || `article-${index}`}
              style={{
                padding: 'clamp(12px, 3vw, 16px)',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(8px, 2vw, 12px)'
              }}>
                <div style={{
                  fontSize: 'clamp(16px, 3.5vw, 20px)',
                  marginTop: 'clamp(1px, 0.5vw, 2px)',
                  flexShrink: 0
                }}>
                  {getNewsIcon(article.category)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{
                    margin: '0 0 clamp(6px, 1.5vw, 8px) 0',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '600',
                    color: '#1f2937',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {article.headline || 'No headline available'}
                  </h5>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(6px, 1.5vw, 8px)',
                    fontSize: 'clamp(10px, 2vw, 12px)',
                    color: '#6b7280',
                    flexWrap: 'wrap'
                  }}>
                    <span>{article.agency || 'Unknown'}</span>
                    <span>•</span>
                    <span>{article.hoursAgo || 0}h ago</span>
                    {article.importance === 'high' && (
                      <>
                        <span>•</span>
                        <span style={{
                          color: '#ef4444',
                          fontWeight: '600'
                        }}>
                          🔥 Breaking
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderData = () => {
    const stats = [
      { label: 'Images', value: spaceImages.length, icon: '🖼️' },
      { label: 'News Articles', value: news.length, icon: '📰' },
      { label: 'Last Update', value: new Date().toLocaleTimeString(), icon: '🕒' },
      { label: 'Data Source', value: 'COSMOS API', icon: '🛰️' }
    ]

    return (
      <div style={{
        padding: 'clamp(12px, 3vw, 16px) 0'
      }}>
        <h4 style={{
          margin: '0 0 clamp(12px, 3vw, 16px) 0',
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          Gallery Statistics
        </h4>

        <div style={{
          display: 'grid',
          gap: 'clamp(8px, 2vw, 12px)'
        }}>
          {stats.map((stat, index) => (
            <div
              key={`stat-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(8px, 2vw, 12px)',
                backgroundColor: '#f8fafc',
                borderRadius: 'clamp(6px, 1.5vw, 8px)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(6px, 1.5vw, 8px)'
              }}>
                <span style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>{stat.icon}</span>
                <span style={{
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#6b7280'
                }}>
                  {stat.label}
                </span>
              </div>
              <span style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 'clamp(16px, 4vw, 20px)',
          padding: 'clamp(8px, 2vw, 12px)',
          backgroundColor: '#ecfdf5',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          border: '1px solid #10b981'
        }}>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#047857',
            fontWeight: '600',
            marginBottom: 'clamp(3px, 1vw, 4px)'
          }}>
            ✅ System Status: Operational
          </div>
          <div style={{
            fontSize: 'clamp(9px, 1.8vw, 11px)',
            color: '#065f46',
            lineHeight: '1.4'
          }}>
            Gallery loaded successfully • ravixalgorithm • 2025-07-02 19:28:49 UTC
          </div>
        </div>
      </div>
    )
  }

  const getNewsIcon = (category) => {
    const icons = {
      launches: '🚀',
      satellites: '🛰️',
      mars: '🔴',
      astronomy: '🌟',
      earth: '🌍',
      system: '⚙️',
      data: '📊',
      gallery: '🖼️',
      general: '📰'
    }
    return icons[category] || '📰'
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'clamp(12px, 3vw, 20px)',
      padding: 'clamp(16px, 4vw, 24px)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      height: 'clamp(400px, 60vw, 500px)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Responsive Header - Title on top, tabs below on mobile */}
      <div style={{
        marginBottom: 'clamp(16px, 4vw, 20px)'
      }}>
        {/* Title Row */}
        <h3 style={{
          margin: 0,
          marginBottom: window.innerWidth < 640 ? 'clamp(12px, 3vw, 16px)' : 0,
          fontSize: 'clamp(16px, 3.5vw, 18px)',
          fontWeight: '700',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1.5vw, 8px)',
          lineHeight: '1.2'
        }}>
          <span style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>🌌</span>
          Space Gallery
        </h3>

        {/* Tab Navigation Row - Responsive layout */}
        <div style={{
          display: 'flex',
          justifyContent: window.innerWidth < 640 ? 'center' : 'flex-end',
          alignItems: 'center',
          marginTop: window.innerWidth < 640 ? 0 : 'clamp(-24px, -4vw, -20px)' // Negative margin to align with title on desktop
        }}>
          <div style={{
            display: 'flex',
            gap: 'clamp(2px, 0.5vw, 4px)',
            backgroundColor: '#f1f5f9',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            padding: 'clamp(2px, 0.5vw, 4px)'
          }}>
            {[
              { id: 'images', label: 'Images', icon: '🖼️' },
              { id: 'news', label: 'News', icon: '📰' },
              { id: 'data', label: 'Data', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                  backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? '#1f2937' : '#64748b',
                  border: 'none',
                  borderRadius: 'clamp(4px, 1vw, 6px)',
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(3px, 0.8vw, 4px)',
                  whiteSpace: 'nowrap',
                  boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <span style={{ fontSize: 'clamp(8px, 1.8vw, 10px)' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Content */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        minHeight: 0 // Allow flex item to shrink below content size
      }}>
        {renderContent()}
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        /* Touch-friendly button interactions */
        button:hover {
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }

        /* Smooth scrollbar styling */
        div::-webkit-scrollbar {
          width: clamp(4px, 1vw, 6px);
        }

        div::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: clamp(2px, 0.5vw, 3px);
        }

        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: clamp(2px, 0.5vw, 3px);
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile-specific optimizations */
        @media (max-width: 639px) {
          .gallery-mobile {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default SpaceGallery
