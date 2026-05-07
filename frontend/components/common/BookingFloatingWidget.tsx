'use client'

import { useState, useEffect } from 'react'
import { CalendlyButton } from './CalendlyButton'

export function BookingFloatingWidget() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    // Hide on mobile and on book-call page
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024
      const isBookCallPage = window.location.pathname === '/book-call'
      setShouldShow(!isMobile && !isBookCallPage)
    }
  }, [])

  if (!shouldShow) return null

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <div
          className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
            showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
          }`}
        >
          Book Free 30-min Consultation →
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-900" />
        </div>

        {/* Floating Button */}
        <div className="bg-gradient-brand text-white px-3 py-6 rounded-r-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer group">
          <div
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            className="text-sm font-medium"
          >
            📅 Book a Call
          </div>
        </div>

        {/* Click overlay */}
        <CalendlyButton
          text=""
          className="absolute inset-0 opacity-0 cursor-pointer"
          variant="primary"
        />
      </div>
    </div>
  )
}
