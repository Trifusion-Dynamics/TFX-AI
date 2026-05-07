'use client'

import { useEffect, useState } from 'react'

export const useChatTrigger = (onTrigger: () => void) => {
  const [shouldTrigger, setShouldTrigger] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    // Check if already triggered this session
    const triggered = sessionStorage.getItem('tfxai_chat_triggered')
    if (triggered) {
      setHasTriggered(true)
      return
    }

    let scrollTimeout: NodeJS.Timeout
    let triggerTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercentage = (scrollTop / scrollHeight) * 100

        if (scrollPercentage >= 30 && !hasTriggered) {
          // User has scrolled at least 30%
          triggerTimeout = setTimeout(() => {
            setShouldTrigger(true)
            sessionStorage.setItem('tfxai_chat_triggered', 'true')
            setHasTriggered(true)
          }, 45000) // 45 seconds after reaching 30% scroll
        }
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      clearTimeout(triggerTimeout)
    }
  }, [hasTriggered, onTrigger])

  useEffect(() => {
    if (shouldTrigger) {
      onTrigger()
      setShouldTrigger(false)
    }
  }, [shouldTrigger, onTrigger])

  return { hasTriggered }
}
