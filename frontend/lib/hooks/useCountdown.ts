'use client'

import { useState, useEffect } from 'react'

interface CountdownReturn {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export const useCountdown = (hours: number = 48) => {
  const [timeLeft, setTimeLeft] = useState<CountdownReturn>({
    hours: hours,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const getTimerStart = () => {
      const stored = sessionStorage.getItem('tfxai_discount_timer_start')
      if (stored) {
        return parseInt(stored)
      }
      const now = Date.now()
      sessionStorage.setItem('tfxai_discount_timer_start', now.toString())
      return now
    }

    const calculateTimeLeft = () => {
      const start = getTimerStart()
      const now = Date.now()
      const totalDuration = hours * 60 * 60 * 1000 // Convert hours to milliseconds
      const elapsed = now - start
      const remaining = totalDuration - elapsed

      if (remaining <= 0) {
        return {
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        }
      }

      const h = Math.floor(remaining / (1000 * 60 * 60))
      const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((remaining % (1000 * 60)) / 1000)

      return {
        hours: h,
        minutes: m,
        seconds: s,
        isExpired: false
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [hours])

  return timeLeft
}
