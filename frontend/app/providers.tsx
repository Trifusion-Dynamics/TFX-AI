'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { ReactNode } from 'react'

import { AnimationProvider } from '@/components/providers/AnimationProvider'
import CookieConsent from '@/components/common/CookieConsent'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AnimationProvider>
        {children}
      </AnimationProvider>

      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0f0f1a',
            color: '#fff',
            border: '1px solid rgba(188, 80, 144, 0.2)',
          },
        }}
      />
      <CookieConsent />
    </ThemeProvider>
  )
}
