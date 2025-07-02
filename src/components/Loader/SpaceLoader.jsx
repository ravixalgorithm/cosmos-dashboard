import React, { useState, useEffect, useRef } from 'react'

const SpaceLoader = ({ loading, spaceData, children }) => {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [showLoader, setShowLoader] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Use refs to prevent dependency loops
  const loadingStartTime = useRef(null)
  const stepTimeouts = useRef([])
  const isLoadingSequenceActive = useRef(false)

  const steps = [
    { id: 'init', label: 'Initializing COSMOS...', icon: '🌌', duration: 1000 },
    { id: 'iss', label: 'Connecting to ISS...', icon: '🛰️', duration: 1200 },
    { id: 'spacex', label: 'Fetching SpaceX data...', icon: '🚀', duration: 1000 },
    { id: 'mars', label: 'Getting Mars weather...', icon: '🔴', duration: 1100 },
    { id: 'people', label: 'Counting people in space...', icon: '👨‍🚀', duration: 800 },
    { id: 'satellites', label: 'Tracking satellites...', icon: '📡', duration: 900 },
    { id: 'ready', label: 'COSMOS ready! 🎉', icon: '✨', duration: 800 }
  ]

  const MINIMUM_LOADING_TIME = 7000 // 7 seconds minimum

  // Initialize loading when needed
  useEffect(() => {
    if ((loading || !spaceData) && !isInitialized) {
      console.log('🔄 SpaceLoader: Initializing loading sequence at', new Date().toISOString())

      // Clear any existing timeouts
      stepTimeouts.current.forEach(timeout => clearTimeout(timeout))
      stepTimeouts.current = []

      // Reset state
      loadingStartTime.current = Date.now()
      setLoadingProgress(0)
      setCompletedSteps(new Set())
      setCurrentStepIndex(-1)
      setShowLoader(true)
      setIsInitialized(true)
      isLoadingSequenceActive.current = true

      // Start the loading sequence
      startLoadingSequence()
    }
  }, [loading, spaceData, isInitialized])

  // Check if we can hide the loader
  useEffect(() => {
    if (!loading && spaceData && isInitialized && completedSteps.size === steps.length) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - loadingStartTime.current

      console.log(`⏱️ Checking completion: elapsed ${elapsedTime}ms, minimum ${MINIMUM_LOADING_TIME}ms`)

      if (elapsedTime >= MINIMUM_LOADING_TIME) {
        // Can hide immediately
        console.log('🎉 SpaceLoader: Minimum time reached, hiding loader')
        setTimeout(() => {
          setShowLoader(false)
        }, 500)
      } else {
        // Wait for minimum time
        const remainingTime = MINIMUM_LOADING_TIME - elapsedTime
        console.log(`⏳ Waiting ${remainingTime}ms more for minimum time`)

        const hideTimeout = setTimeout(() => {
          console.log('🎉 SpaceLoader: Minimum time completed, hiding loader')
          setShowLoader(false)
        }, remainingTime + 500)

        stepTimeouts.current.push(hideTimeout)
      }
    }
  }, [loading, spaceData, isInitialized, completedSteps.size])

  const startLoadingSequence = () => {
    if (!isLoadingSequenceActive.current) return

    console.log('🚀 Starting loading sequence with', steps.length, 'steps')

    let totalDelay = 200 // Initial delay

    steps.forEach((step, index) => {
      // Start step timeout
      const startTimeout = setTimeout(() => {
        if (!isLoadingSequenceActive.current) return

        console.log(`📡 Starting step ${index + 1}/${steps.length}: ${step.label}`)
        setCurrentStepIndex(index)

        // Calculate progress
        const progress = ((index + 1) / steps.length) * 100
        setLoadingProgress(progress)

      }, totalDelay)

      stepTimeouts.current.push(startTimeout)

      // Complete step timeout
      const completeTimeout = setTimeout(() => {
        if (!isLoadingSequenceActive.current) return

        console.log(`✅ Completed step ${index + 1}/${steps.length}: ${step.label}`)
        setCompletedSteps(prev => new Set([...prev, index]))

        if (index === steps.length - 1) {
          setCurrentStepIndex(-1) // No current step when all done
          console.log('🎉 All loading steps completed')
        }

      }, totalDelay + step.duration)

      stepTimeouts.current.push(completeTimeout)
      totalDelay += step.duration
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stepTimeouts.current.forEach(timeout => clearTimeout(timeout))
      isLoadingSequenceActive.current = false
    }
  }, [])

  // Reset when component unmounts or data changes significantly
  useEffect(() => {
    return () => {
      setIsInitialized(false)
      isLoadingSequenceActive.current = false
    }
  }, [])

  // Show loader
  if (showLoader) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0f172a',
        zIndex: 10000,
        display: 'flex',
        flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: 'clamp(12px, 3vw, 24px)',
        overflow: 'hidden'
      }}>
        {/* Enhanced Animated Space Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, #60a5fa, transparent),
            radial-gradient(2px 2px at 40px 70px, #a78bfa, transparent),
            radial-gradient(1px 1px at 90px 40px, #34d399, transparent),
            radial-gradient(1px 1px at 130px 80px, #60a5fa, transparent),
            radial-gradient(2px 2px at 160px 30px, #a78bfa, transparent),
            radial-gradient(1px 1px at 200px 90px, #34d399, transparent),
            radial-gradient(2px 2px at 240px 50px, #60a5fa, transparent),
            radial-gradient(1px 1px at 280px 10px, #a78bfa, transparent),
            radial-gradient(1px 1px at 320px 70px, #34d399, transparent),
            radial-gradient(2px 2px at 360px 40px, #60a5fa, transparent)
          `,
          backgroundSize: 'clamp(250px, 50vw, 350px) clamp(250px, 50vw, 350px)',
          animation: 'stars 25s linear infinite',
          opacity: 0.7
        }} />

        {/* Shooting Stars */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '-50px',
            width: 'clamp(1px, 0.3vw, 2px)',
            height: 'clamp(1px, 0.3vw, 2px)',
            backgroundColor: '#60a5fa',
            borderRadius: '50%',
            animation: 'shooting-star-1 3s linear infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '-50px',
            width: 'clamp(0.5px, 0.2vw, 1px)',
            height: 'clamp(0.5px, 0.2vw, 1px)',
            backgroundColor: '#a78bfa',
            borderRadius: '50%',
            animation: 'shooting-star-2 4s linear infinite 1s'
          }} />
        </div>

        {/* Main Content Container */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: window.innerWidth < 1024 ? 'clamp(16px, 4vw, 24px)' : 'clamp(24px, 6vw, 48px)',
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 'min(1200px, 98vw)',
          height: window.innerWidth < 1024 ? 'auto' : 'min(100vh, 100%)'
        }}>

          {/* Main Loading Display - Appears first on mobile */}
          <div style={{
            textAlign: 'center',
            flex: 1,
            order: window.innerWidth < 1024 ? 1 : 2,
            width: '100%'
          }}>
            {/* COSMOS Logo */}
            <div style={{
              fontSize: 'clamp(2.5rem, 10vw, 6rem)',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 'clamp(16px, 4vw, 24px)',
              animation: 'glow 2s ease-in-out infinite alternate',
              letterSpacing: '-0.02em'
            }}>
              COSMOS
            </div>

            {/* Enhanced Orbital Animation */}
            <div style={{
              position: 'relative',
              width: 'clamp(160px, 32vw, 220px)',
              height: 'clamp(160px, 32vw, 220px)',
              margin: `0 auto clamp(16px, 4vw, 24px)`
            }}>
              {/* Outer Orbit Ring */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                border: `clamp(1px, 0.3vw, 2px) solid rgba(96, 165, 250, 0.2)`,
                animation: 'rotate-slow 20s linear infinite'
              }} />

              {/* Inner Orbit Ring */}
              <div style={{
                position: 'absolute',
                top: 'clamp(16px, 3.2vw, 22px)',
                left: 'clamp(16px, 3.2vw, 22px)',
                right: 'clamp(16px, 3.2vw, 22px)',
                bottom: 'clamp(16px, 3.2vw, 22px)',
                borderRadius: '50%',
                border: `clamp(0.5px, 0.2vw, 1px) solid rgba(167, 139, 250, 0.3)`,
                animation: 'rotate-slow 15s linear infinite reverse'
              }} />

              {/* Earth */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(60px, 12vw, 85px)',
                height: 'clamp(60px, 12vw, 85px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(20px, 4.5vw, 28px)',
                boxShadow: '0 0 clamp(16px, 3vw, 24px) rgba(59, 130, 246, 0.5)',
                animation: 'earth-pulse 3s ease-in-out infinite'
              }}>
                🌍
              </div>

              {/* ISS Orbiting */}
              <div style={{
                position: 'absolute',
                top: 'clamp(8px, 1.6vw, 12px)',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'orbit 4s linear infinite'
              }}>
                <div style={{
                  fontSize: 'clamp(14px, 3vw, 20px)',
                  filter: 'drop-shadow(0 0 clamp(4px, 1vw, 6px) rgba(255, 255, 255, 0.8))'
                }}>
                  🛰️
                </div>
              </div>

              {/* Satellite on different orbit */}
              <div style={{
                position: 'absolute',
                top: 'clamp(20px, 4vw, 28px)',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'orbit-reverse 6s linear infinite'
              }}>
                <div style={{
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  filter: 'drop-shadow(0 0 clamp(3px, 0.8vw, 5px) rgba(167, 139, 250, 0.8))'
                }}>
                  📡
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div style={{
              width: 'min(320px, 85vw)',
              height: 'clamp(8px, 1.8vw, 12px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'clamp(4px, 0.8vw, 6px)',
              margin: '0 auto clamp(12px, 3vw, 18px)',
              overflow: 'hidden',
              border: `clamp(0.5px, 0.2vw, 1px) solid rgba(96, 165, 250, 0.2)`
            }}>
              <div style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #34d399)',
                borderRadius: 'clamp(4px, 0.8vw, 6px)',
                transition: 'width 0.8s ease',
                boxShadow: '0 0 clamp(8px, 1.6vw, 12px) rgba(96, 165, 250, 0.6)',
                animation: 'progress-glow 2s ease-in-out infinite alternate'
              }} />
            </div>

            {/* Progress Percentage */}
            <div style={{
              fontSize: 'clamp(13px, 2.8vw, 16px)',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '600',
              letterSpacing: '0.5px',
              marginBottom: 'clamp(8px, 1.8vw, 12px)'
            }}>
              {Math.round(loadingProgress)}% Complete
            </div>

            {/* Built by Attribution */}
            <div style={{
              fontSize: 'clamp(10px, 2.2vw, 12px)',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Built by <span style={{ color: '#60a5fa', fontWeight: '600' }}>ravixalgorithm</span><br/>
              <span style={{ fontSize: 'clamp(9px, 1.8vw, 10px)', opacity: 0.8 }}>
                AstroHack 2025 • {new Date().toLocaleDateString()} • 2025-07-02 18:47:34
              </span>
            </div>
          </div>

          {/* Loading Steps - More Compact */}
          <div style={{
            width: window.innerWidth < 1024 ? '100%' : 'clamp(240px, 22vw, 300px)',
            maxWidth: window.innerWidth < 1024 ? '420px' : 'none',
            padding: 'clamp(14px, 3vw, 20px)',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderRadius: 'clamp(10px, 2.5vw, 16px)',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 clamp(4px, 1.5vw, 8px) clamp(16px, 5vw, 32px) rgba(0, 0, 0, 0.3)',
            order: window.innerWidth < 1024 ? 2 : 1,
            margin: window.innerWidth < 1024 ? '0 auto' : '0'
          }}>
            <h3 style={{
              margin: '0 0 clamp(10px, 2.5vw, 14px) 0',
              fontSize: 'clamp(12px, 2.5vw, 15px)',
              fontWeight: '600',
              color: '#60a5fa',
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}>
              Loading Progress
            </h3>

            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(index)
              const isCurrent = index === currentStepIndex
              const isPending = index > currentStepIndex

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(8px, 2vw, 12px)',
                    padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                    marginBottom: 'clamp(4px, 1vw, 6px)',
                    borderRadius: 'clamp(6px, 1.5vw, 10px)',
                    backgroundColor: isCurrent ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
                    border: isCurrent ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
                    transition: 'all 0.5s ease',
                    opacity: isPending ? 0.5 : 1,
                    transform: isCurrent ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  {/* Status Indicator */}
                  <div style={{
                    width: 'clamp(16px, 3.2vw, 22px)',
                    height: 'clamp(16px, 3.2vw, 22px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#60a5fa' : 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.5s ease',
                    fontSize: 'clamp(8px, 1.6vw, 10px)',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {isCompleted ? '✓' : isCurrent ? (
                      <div style={{
                        width: 'clamp(5px, 1.2vw, 7px)',
                        height: 'clamp(5px, 1.2vw, 7px)',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        animation: 'pulse 1s ease-in-out infinite'
                      }} />
                    ) : (index + 1)}
                  </div>

                  {/* Step Icon */}
                  <span style={{
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    animation: isCurrent ? 'bounce 1s ease-in-out infinite' : 'none',
                    filter: isCurrent ? 'drop-shadow(0 0 clamp(4px, 1vw, 6px) rgba(96, 165, 250, 0.6))' : 'none',
                    flexShrink: 0
                  }}>
                    {step.icon}
                  </span>

                  {/* Step Label */}
                  <span style={{
                    fontSize: 'clamp(10px, 2.2vw, 12px)',
                    fontWeight: isCurrent ? '600' : '500',
                    color: isCompleted ? '#10b981' : isCurrent ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
                    flex: 1,
                    lineHeight: '1.2'
                  }}>
                    {step.label}
                  </span>

                  {/* Loading Spinner for Current Step */}
                  {isCurrent && (
                    <div style={{
                      width: 'clamp(10px, 2.2vw, 14px)',
                      height: 'clamp(10px, 2.2vw, 14px)',
                      border: `clamp(1px, 0.2vw, 1.5px) solid rgba(96, 165, 250, 0.3)`,
                      borderTop: `clamp(1px, 0.2vw, 1.5px) solid #60a5fa`,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      flexShrink: 0
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Enhanced CSS Animations with Responsive Values */}
        <style jsx>{`
          @keyframes stars {
            0% { transform: translateY(0); }
            100% { transform: translateY(clamp(-250px, -50vw, -350px)); }
          }

          @keyframes orbit {
            0% { transform: translateX(-50%) rotate(0deg) translateY(clamp(-80px, -16vw, -110px)) rotate(0deg); }
            100% { transform: translateX(-50%) rotate(360deg) translateY(clamp(-80px, -16vw, -110px)) rotate(-360deg); }
          }

          @keyframes orbit-reverse {
            0% { transform: translateX(-50%) rotate(0deg) translateY(clamp(-60px, -12vw, -96px)) rotate(0deg); }
            100% { transform: translateX(-50%) rotate(-360deg) translateY(clamp(-60px, -12vw, -96px)) rotate(360deg); }
          }

          @keyframes glow {
            0% { text-shadow: 0 0 clamp(12px, 2.5vw, 16px) rgba(96, 165, 250, 0.5); }
            100% { text-shadow: 0 0 clamp(20px, 4vw, 28px) rgba(96, 165, 250, 0.8), 0 0 clamp(28px, 5.5vw, 40px) rgba(167, 139, 250, 0.4); }
          }

          @keyframes earth-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
          }

          @keyframes progress-glow {
            0% { box-shadow: 0 0 clamp(8px, 1.6vw, 12px) rgba(96, 165, 250, 0.6); }
            100% { box-shadow: 0 0 clamp(16px, 3.2vw, 20px) rgba(96, 165, 250, 0.9), 0 0 clamp(20px, 4vw, 28px) rgba(167, 139, 250, 0.4); }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(clamp(-2px, -0.6vw, -4px)); }
          }

          @keyframes rotate-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes shooting-star-1 {
            0% { transform: translateX(0) translateY(0) scale(0); opacity: 1; }
            10% { transform: translateX(clamp(25px, 5vw, 40px)) translateY(clamp(25px, 5vw, 40px)) scale(1); opacity: 1; }
            90% { transform: translateX(calc(100vw + clamp(25px, 5vw, 40px))) translateY(calc(100vh + clamp(25px, 5vw, 40px))) scale(0); opacity: 0; }
            100% { transform: translateX(calc(100vw + clamp(50px, 10vw, 80px))) translateY(calc(100vh + clamp(50px, 10vw, 80px))) scale(0); opacity: 0; }
          }

          @keyframes shooting-star-2 {
            0% { transform: translateX(0) translateY(0) scale(0); opacity: 1; }
            15% { transform: translateX(clamp(16px, 3.2vw, 24px)) translateY(clamp(16px, 3.2vw, 24px)) scale(1); opacity: 1; }
            85% { transform: translateX(calc(100vw + clamp(16px, 3.2vw, 24px))) translateY(calc(50vh + clamp(16px, 3.2vw, 24px))) scale(0); opacity: 0; }
            100% { transform: translateX(calc(100vw + clamp(32px, 6.4vw, 48px))) translateY(calc(50vh + clamp(32px, 6.4vw, 48px))) scale(0); opacity: 0; }
          }
        `}</style>
      </div>
    )
  }

  // Data is ready and minimum time has passed, show the app
  return children
}

export default SpaceLoader
