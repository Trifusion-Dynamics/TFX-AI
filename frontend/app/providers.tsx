'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

import { AnimationProvider } from '@/components/providers/AnimationProvider'

// Dynamically import ChatWidget to avoid SSR issues
const ChatWidget = dynamic(() => import('@/components/chatbot/ChatWidget'), {
  ssr: false
})

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
      
      <ChatWidget />
    </ThemeProvider>
  )
}
