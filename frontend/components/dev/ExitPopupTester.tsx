'use client'

import React from 'react'
import { useExitIntent } from '@/lib/hooks/useExitIntent'

const ExitPopupTester: React.FC = () => {
  const { resetPopup } = useExitIntent()

  const handleTestPopup = () => {
    // Reset popup state
    resetPopup()
    
    // Trigger popup immediately by simulating exit intent
    setTimeout(() => {
      // Force trigger by moving mouse to top
      const event = new MouseEvent('mousemove', {
        clientY: 10,
        movementY: -50
      })
      window.dispatchEvent(event)
    }, 100)
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9998]">
      <button
        onClick={handleTestPopup}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm shadow-lg"
      >
        Test Exit Popup
      </button>
    </div>
  )
}

export default ExitPopupTester
