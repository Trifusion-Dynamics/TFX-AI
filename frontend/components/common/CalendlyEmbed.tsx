'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface CalendlyEmbedProps {
  height?: number
  prefillName?: string
  prefillEmail?: string
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/tfxai/consultation'

export function CalendlyEmbed({
  height = 700,
  prefillName,
  prefillEmail
}: CalendlyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Listen for booking confirmation
    if (typeof window === 'undefined') return

    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        toast.success('🎉 Call booked! Check your email for confirmation.')
        
        // Send lead to backend (you'll need to implement this API call)
        // contactApi.submit({
        //   name: e.data.payload?.invitee?.name || 'New Booking',
        //   email: e.data.payload?.invitee?.email || '',
        //   subject: 'Calendly Call Booked',
        //   message: `Call scheduled for: ${e.data.payload?.event?.start_time}`,
        //   phone: ''
        // })
      }
    }

    window.addEventListener('message', handleCalendlyEvent)
    return () => window.removeEventListener('message', handleCalendlyEvent)
  }, [])

  useEffect(() => {
    // Initialize Calendly widget when component mounts
    if (typeof window === 'undefined') return

    if (window.Calendly) {
      setIsLoading(false)
    } else {
      // Check if Calendly script loads
      const checkCalendly = setInterval(() => {
        if (typeof window !== 'undefined' && window.Calendly) {
          setIsLoading(false)
          clearInterval(checkCalendly)
        }
      }, 100)

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(checkCalendly)
        setIsLoading(false)
      }, 10000)

      return () => clearInterval(checkCalendly)
    }
  }, [])

  const calendlyUrlWithPrefill = prefillName || prefillEmail 
    ? `${CALENDLY_URL}?${new URLSearchParams({
        ...(prefillName && { name: prefillName }),
        ...(prefillEmail && { email: prefillEmail })
      }).toString()}`
    : CALENDLY_URL

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink"></div>
            <p className="text-gray-400 animate-pulse">Loading calendar...</p>
          </div>
        </div>
      )}
      
      <div 
        className="calendly-inline-widget w-full"
        data-url={calendlyUrlWithPrefill}
        style={{ 
          minWidth: '320px', 
          height: `${height}px`,
          background: 'white'
        }}
        onLoad={() => setIsLoading(false)}
      />
      
      <script 
        type="text/javascript"
        src="https://assets.calendly.com/assets/external/widget.js"
        async
      />
    </div>
  )
}
