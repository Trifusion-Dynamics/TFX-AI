'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface CalendlyButtonProps {
  text?: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  prefillName?: string
  prefillEmail?: string
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/tfxai/consultation'

export function CalendlyButton({
  text = "Book Free Consultation",
  variant = 'primary',
  size = 'md',
  className = '',
  prefillName,
  prefillEmail
}: CalendlyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    
    // Track analytics event (only on client)
    if (typeof window !== 'undefined') {
      console.log('Calendly opened from:', window.location.pathname)
    }

    // Check if Calendly script is loaded
    if (typeof window !== 'undefined' && !window.Calendly) {
      toast.loading('Opening calendar...')
      
      // Wait for script to load and retry
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.Calendly) {
          openCalendlyPopup()
        } else {
          // Fallback: redirect to Calendly URL directly
          if (typeof window !== 'undefined') {
            window.open(CALENDLY_URL, '_blank')
          }
          toast.dismiss()
        }
        setIsLoading(false)
      }, 500)
      return
    }

    openCalendlyPopup()
    setIsLoading(false)
  }

  const openCalendlyPopup = () => {
    if (typeof window === 'undefined' || !window.Calendly) return
    
    const options: any = {
      url: CALENDLY_URL
    }

    if (prefillName || prefillEmail) {
      options.prefill = {}
      if (prefillName) options.prefill.name = prefillName
      if (prefillEmail) options.prefill.email = prefillEmail
    }

    window.Calendly.initPopupWidget(options)
  }

  // Listen for booking confirmation
  useEffect(() => {
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

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantClasses = {
    primary: 'bg-gradient-brand text-white hover:opacity-90 focus:ring-brand-pink',
    outline: 'border border-gradient bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-yellow hover:bg-gradient-brand/10 focus:ring-brand-pink',
    ghost: 'text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-yellow hover:bg-gradient-brand/5 focus:ring-brand-pink'
  }

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={classes}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Opening...
        </>
      ) : (
        text
      )}
    </button>
  )
}
