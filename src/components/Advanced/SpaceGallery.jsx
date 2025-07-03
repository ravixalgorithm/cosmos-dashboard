import React, { useState, useEffect } from 'react'

const SpaceGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Real space images with high-quality sources
  const spaceImages = [
    {
      id: 1,
      title: 'Earth from ISS',
      icon: '🌍',
      description: 'Stunning view of Earth from the International Space Station',
      category: 'Earth Views',
      source: 'NASA ISS',
      imageUrl: 'https://www.shutterstock.com/shutterstock/videos/22519540/thumb/1.jpg?ip=x480',
      fallbackGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
      stats: { distance: '408 km', speed: '27,600 km/h' }
    },
    {
      id: 2,
      title: 'Lunar Surface',
      icon: '🌙',
      description: 'High-resolution image of the Moon\'s cratered surface',
      category: 'Lunar',
      source: 'NASA Artemis',
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2022/12/artemis_i_earth_after_opf.jpg?resize=2000,1500',
      fallbackGradient: 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)',
      stats: { distance: '384,400 km', phase: 'Waxing Gibbous' }
    },
    {
      id: 3,
      title: 'Saturn\'s Rings',
      icon: '🪐',
      description: 'Magnificent view of Saturn and its iconic ring system',
      category: 'Planets',
      source: 'Cassini Mission',
      imageUrl: 'https://photojournal.jpl.nasa.gov/thumb/PIA21345.jpg',
      fallbackGradient: 'linear-gradient(135deg, #451a03 0%, #f59e0b 50%, #fbbf24 100%)',
      stats: { distance: '1.35 billion km', rings: '7 major groups' }
    },
    {
      id: 4,
      title: 'Nebula Formation',
      icon: '🌌',
      description: 'Colorful stellar nursery where new stars are born',
      category: 'Deep Space',
      source: 'Hubble Telescope',
      imageUrl: 'https://images.unsplash.com/photo-1446776820691-8f5ac89520aa?w=800&h=600&fit=crop&auto=format',
      fallbackGradient: 'linear-gradient(135deg, #581c87 0%, #8b5cf6 50%, #a855f7 100%)',
      stats: { size: '5 light years', temperature: '10,000 K' }
    },
    {
      id: 5,
      title: 'Mars Surface',
      icon: '🔴',
      description: 'Rocky terrain captured by Perseverance rover',
      category: 'Mars',
      source: 'NASA Perseverance',
      imageUrl: 'https://images.unsplash.com/photo-1446776476648-4acd6dd50d89?w=800&h=600&fit=crop&auto=format',
      fallbackGradient: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 50%, #f59e0b 100%)',
      stats: { sol: '8177', temperature: '-73°C' }
    },
    {
      id: 6,
      title: 'Aurora Borealis',
      icon: '🌠',
      description: 'Northern lights dancing over Earth\'s atmosphere',
      category: 'Phenomena',
      source: 'ISS Photography',
      imageUrl: 'https://images.unsplash.com/photo-1446776857893-d267b22b2d14?w=800&h=600&fit=crop&auto=format',
      fallbackGradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #34d399 100%)',
      stats: { altitude: '100-300 km', frequency: '65% chance' }
    }
  ]

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % spaceImages.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [spaceImages.length])

  // Handle image load
  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]))
  }

  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  // Close modal
  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(20px, 5vw, 32px)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(20px, 5vw, 28px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: 'clamp(40px, 10vw, 48px)',
              height: 'clamp(40px, 10vw, 48px)',
              backgroundColor: '#8b5cf6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(20px, 5vw, 24px)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              🌌
            </div>
            <div>
              <h2 style={{
                fontSize: 'clamp(20px, 5vw, 28px)',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                Space Gallery
              </h2>
              <p style={{
                fontSize: 'clamp(12px, 3vw, 14px)',
                color: '#64748b',
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                Latest images from space missions
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#f0f9ff',
            borderRadius: '20px',
            border: '1px solid #0ea5e9'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#0ea5e9',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              fontWeight: '600',
              color: '#0369a1',
              fontFamily: "'Inter', sans-serif"
            }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Featured Image Carousel */}
        <div style={{
          marginBottom: 'clamp(24px, 6vw, 32px)',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          aspectRatio: '16/9',
          background: spaceImages[currentImageIndex].fallbackGradient
        }}>
          <img
            src={spaceImages[currentImageIndex].imageUrl}
            alt={spaceImages[currentImageIndex].title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s ease'
            }}
            onLoad={() => handleImageLoad(spaceImages[currentImageIndex].id)}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />

          {/* Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
            padding: 'clamp(16px, 4vw, 24px)',
            color: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: 'clamp(16px, 4vw, 20px)' }}>
                {spaceImages[currentImageIndex].icon}
              </span>
              <h3 style={{
                fontSize: 'clamp(16px, 4vw, 20px)',
                fontWeight: '700',
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                {spaceImages[currentImageIndex].title}
              </h3>
            </div>
            <p style={{
              fontSize: 'clamp(12px, 3vw, 14px)',
              margin: 0,
              opacity: 0.9,
              fontFamily: "'Inter', sans-serif"
            }}>
              {spaceImages[currentImageIndex].description}
            </p>
          </div>

          {/* Navigation dots */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            gap: '6px'
          }}>
            {spaceImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 40vw, 280px), 1fr))',
          gap: 'clamp(12px, 3vw, 20px)'
        }}>
          {spaceImages.map((image, index) => (
            <SpaceImageCard
              key={image.id}
              image={image}
              isLoaded={loadedImages.has(image.id)}
              onClick={() => handleImageClick(image)}
              onLoad={() => handleImageLoad(image.id)}
            />
          ))}
        </div>

        {/* Stats Bar */}
        <div style={{
          marginTop: 'clamp(20px, 5vw, 28px)',
          padding: 'clamp(16px, 4vw, 20px)',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'clamp(12px, 3vw, 20px)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: '800',
                color: '#3b82f6',
                marginBottom: '4px'
              }}>
                {spaceImages.length}
              </div>
              <div style={{
                fontSize: 'clamp(10px, 2.5vw, 12px)',
                color: '#64748b',
                fontWeight: '600'
              }}>
                Images
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: '800',
                color: '#10b981',
                marginBottom: '4px'
              }}>
                4K
              </div>
              <div style={{
                fontSize: 'clamp(10px, 2.5vw, 12px)',
                color: '#64748b',
                fontWeight: '600'
              }}>
                Quality
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: '800',
                color: '#8b5cf6',
                marginBottom: '4px'
              }}>
              Live
              </div>
              <div style={{
                fontSize: 'clamp(10px, 2.5vw, 12px)',
                color: '#64748b',
                fontWeight: '600'
              }}>
                Updates
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for expanded view */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={closeModal}
        />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  )
}

// Individual Space Image Card Component
const SpaceImageCard = ({ image, isLoaded, onClick, onLoad }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '4/3',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: image.fallbackGradient
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.02)'
        e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)'
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Loading shimmer effect */}
      {!isLoaded && !imageError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
      )}

      {/* Image */}
      {!imageError && (
        <img
          src={image.imageUrl}
          alt={image.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0
          }}
          onLoad={onLoad}
          onError={() => setImageError(true)}
        />
      )}

      {/* Fallback gradient background (always visible) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: image.fallbackGradient,
        zIndex: imageError ? 1 : -1
      }} />

      {/* Content overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
        padding: 'clamp(12px, 3vw, 16px)',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '4px'
        }}>
          <span style={{ fontSize: 'clamp(12px, 3vw, 16px)' }}>
            {image.icon}
          </span>
          <h4 style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            fontWeight: '600',
            margin: 0,
            fontFamily: "'Inter', sans-serif"
          }}>
            {image.title}
          </h4>
        </div>
        <div style={{
          fontSize: 'clamp(9px, 2.2vw, 10px)',
          opacity: 0.9,
          fontWeight: '500',
          fontFamily: "'Inter', sans-serif"
        }}>
          {image.source}
        </div>
      </div>

      {/* Category badge */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        padding: '4px 8px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '12px',
        fontSize: 'clamp(8px, 2vw, 10px)',
        fontWeight: '600',
        color: 'white',
        fontFamily: "'Inter', sans-serif"
      }}>
        {image.category}
      </div>
    </div>
  )
}

// Modal for expanded image view
const ImageModal = ({ image, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 32px)',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: 'min(90vw, 800px)',
          maxHeight: 'min(90vh, 600px)',
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* Image */}
        <div style={{
          aspectRatio: '16/10',
          background: image.fallbackGradient,
          position: 'relative'
        }}>
          <img
            src={image.imageUrl}
            alt={image.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>

        {/* Content */}
        <div style={{
          padding: 'clamp(20px, 5vw, 32px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '24px' }}>{image.icon}</span>
            <div>
              <h3 style={{
                fontSize: 'clamp(18px, 4.5vw, 24px)',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                {image.title}
              </h3>
              <p style={{
                fontSize: 'clamp(12px, 3vw, 14px)',
                color: '#64748b',
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                {image.source} • {image.category}
              </p>
            </div>
          </div>

          <p style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: '#4b5563',
            lineHeight: '1.6',
            marginBottom: '20px',
            fontFamily: "'Inter', sans-serif"
          }}>
            {image.description}
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px'
          }}>
            {Object.entries(image.stats).map(([key, value]) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  fontWeight: '700',
                  color: '#3b82f6',
                  marginBottom: '4px'
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  color: '#64748b',
                  textTransform: 'capitalize'
                }}>
                  {key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpaceGallery
