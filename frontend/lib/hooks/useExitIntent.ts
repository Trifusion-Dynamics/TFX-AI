'use client'

import { useEffect, useState, useCallback } from 'react'

export const useExitIntent = () => {
  const [shouldShow, setShouldShow] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [hasScrolled25, setHasScrolled25] = useState(false)

  // Check if popup should show based on smart rules
  const checkSmartRules = useCallback(() => {
    // Rule 1: User has been on page for at least 20 seconds
    if (timeOnPage < 20) return false

    // Rule 2: User has scrolled at least 25% of page height
    if (!hasScrolled25) return false

    // Rule 3: Popup NOT shown in last 3 days
    const lastShown = localStorage.getItem('tfxai_exit_popup_shown')
    if (lastShown) {
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000)
      if (parseInt(lastShown) > threeDaysAgo) return false
    }

    // Rule 4: Not on admin pages
    const pathname = window.location.pathname
    if (pathname.startsWith('/admin') || 
        pathname.includes('/login') || 
        pathname.includes('/register') || 
        pathname.includes('/book-call')) {
      return false
    }

    // Rule 5: Not triggered more than once per session
    if (hasTriggered) return false

    // Rule 6: User has NOT already submitted contact form this session
    const formSubmitted = sessionStorage.getItem('tfxai_form_submitted')
    if (formSubmitted) return false

    return true
  }, [timeOnPage, hasScrolled25, hasTriggered])

  // Desktop exit intent detection
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!checkSmartRules()) return

    // Mouse near top of browser (moving upward)
    if (e.clientY < 50 && e.movementY < 0) {
      setShouldShow(true)
      setHasTriggered(true)
    }
  }, [checkSmartRules])

  // Mobile exit intent detection
  const handleScroll = useCallback(() => {
    // Track scroll depth
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = (scrollTop / scrollHeight) * 100

    if (scrollPercentage >= 25) {
      setHasScrolled25(true)
    }

    // Mobile exit: scroll up quickly after scrolling down
    if (!checkSmartRules()) return

    // This would need velocity tracking, simplified for now
    if (scrollPercentage > 30 && hasScrolled25) {
      // Could add velocity detection here
    }
  }, [checkSmartRules, hasScrolled25])

  // Page visibility change (tab switch)
  const handleVisibilityChange = useCallback(() => {
    if (!checkSmartRules()) return
    
    if (document.hidden) {
      setShouldShow(true)
      setHasTriggered(true)
    }
  }, [checkSmartRules])

  // Back button detection
  const handlePopState = useCallback(() => {
    if (!checkSmartRules()) return
    
    setShouldShow(true)
    setHasTriggered(true)
  }, [checkSmartRules])

  // Track time on page
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Track scroll depth
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Desktop mouse tracking
  useEffect(() => {
    if (window.innerWidth > 768) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  // Mobile/tab tracking
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [handleVisibilityChange, handlePopState])

  // Mark popup as shown
  const markAsShown = useCallback(() => {
    localStorage.setItem('tfxai_exit_popup_shown', Date.now().toString())
    setShouldShow(false)
  }, [])

  // Mark popup as converted
  const markAsConverted = useCallback(() => {
    localStorage.setItem('tfxai_exit_popup_converted', 'true')
    markAsShown()
  }, [markAsShown])

  // Reset popup (for testing)
  const resetPopup = useCallback(() => {
    localStorage.removeItem('tfxai_exit_popup_shown')
    localStorage.removeItem('tfxai_exit_popup_converted')
    sessionStorage.removeItem('tfxai_form_submitted')
    setShouldShow(false)
    setHasTriggered(false)
    setTimeOnPage(0)
    setHasScrolled25(false)
  }, [])

  return {
    shouldShow,
    markAsShown,
    markAsConverted,
    resetPopup
  }
}
