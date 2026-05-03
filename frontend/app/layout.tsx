import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tfxai.com'),
  title: {
    default: 'TFX AI | AI + Web Development Agency',
    template: '%s | TFX AI'
  },
  description: 'TFX AI is a premier AI agency building high-performance web applications, intelligent chatbots, and scalable SaaS solutions.',
  keywords: ['AI Agency', 'Web Development', 'Next.js 15', 'AI Solutions', 'SaaS Development', 'TFX AI'],
  authors: [{ name: 'TFX AI Team' }],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'TFX AI | AI + Web Development Agency',
    description: 'Empowering businesses with cutting-edge AI and elite web engineering.',
    url: 'https://tfxai.com',
    siteName: 'TFX AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TFX AI | AI + Web Development Agency',
    description: 'Empowering businesses with cutting-edge AI and elite web engineering.',
    creator: '@tfxai',
  },
}


import { BackToTop } from '@/components/common/BackToTop'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  )
}
