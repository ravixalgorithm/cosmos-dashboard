import React, { useState, useEffect } from 'react'
import TopNavigation from './TopNavigation'
import MainNavigation from './MainNavigation'
import UnifiedNavigation from './UnifiedNavigation'

const NavigationManager = ({ activeSection, setActiveSection, isMobile }) => {
  // Mobile: Use unified navigation
  if (isMobile) {
    return (
      <UnifiedNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    )
  }

  // Desktop/Tablet: Use original two-navigation system
  return (
    <>
      <TopNavigation setActiveSection={setActiveSection} />

      {/* Only show MainNavigation if not on Docs page */}
      {activeSection !== 'Docs' && (
        <MainNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
    </>
  )
}

export default NavigationManager
