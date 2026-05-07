import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  fallback: ['system-ui', 'arial', 'sans-serif'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tfxai.com'),
  title: {
    default: 'TFX AI | AI-Powered Solutions for Modern Businesses',
    template: '%s | TFX AI'
  },
  description: 'TFX AI is a premier AI agency building high-performance web applications, intelligent chatbots, and scalable SaaS solutions.',
  keywords: ['AI Agency', 'Web Development', 'Next.js 15', 'AI Solutions', 'SaaS Development', 'TFX AI'],
  authors: [{ name: 'TFX AI Team' }],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'TFX AI | AI-Powered Solutions for Modern Businesses',
    description: 'Empowering businesses with cutting-edge AI and elite web engineering.',
    url: 'https://tfxai.com',
    siteName: 'TFX AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TFX AI | AI-Powered Solutions for Modern Businesses',
    description: 'Empowering businesses with cutting-edge AI and elite web engineering.',
    creator: '@tfxai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Preload critical resources
  other: {
    'preconnect': 'https://fonts.googleapis.com',
    'preconnect-2': 'https://fonts.gstatic.com',
    'dns-prefetch': 'https://images.unsplash.com',
  },
}


import { BackToTop } from '@/components/common/BackToTop'
import { BookingFloatingWidget } from '@/components/common/BookingFloatingWidget'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            body{background-color:#0a0a0f;color:white;font-family:var(--font-sans),system-ui,-apple-system,sans-serif;font-weight:400;line-height:1.5}
            .min-h-screen{min-height:100vh}.flex{display:flex}.items-center{align-items:center}.justify-center{justify-content:center}
            .pt-20{padding-top:5rem}.overflow-hidden{overflow:hidden}.text-center{text-align:center}
            .container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
            @media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}
            @media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}
            .text-5xl{font-size:3rem;line-height:1}@media (min-width:768px){.text-5xl{font-size:3.75rem}}
            @media (min-width:1024px){.text-5xl{font-size:4rem}}.text-7xl{font-size:4.5rem;line-height:1}
            @media (min-width:768px){.text-7xl{font-size:5.25rem}}@media (min-width:1024px){.text-7xl{font-size:6rem}}
            .text-9xl{font-size:8rem;line-height:1}@media (min-width:768px){.text-9xl{font-size:9rem}}
            .font-display{font-family:var(--font-display),system-ui,-apple-system,sans-serif}.font-bold{font-weight:700}
            .text-white{color:white}.mb-6{margin-bottom:1.5rem}.mb-12{margin-bottom:3rem}.leading-tight{line-height:1.25}
            .text-lg{font-size:1.125rem;line-height:1.75rem}@media (min-width:768px){.text-lg{font-size:1.25rem}}
            .text-xl{font-size:1.25rem;line-height:1.75rem}@media (min-width:768px){.text-xl{font-size:1.5rem;line-height:2rem}}
            .text-gray-400{color:#9ca3af}.max-w-3xl{max-width:48rem}.mx-auto{margin-left:auto;margin-right:auto}
            .gradient-text{background:linear-gradient(135deg,#bc5090,#ff6361,#ffa600);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:transparent}
            .flex-col{flex-direction:column}.gap-4{gap:1rem}@media (min-width:640px){.sm\\:flex-row{flex-direction:row}}
            .px-8{padding-left:2rem;padding-right:2rem}.py-4{padding-top:1rem;padding-bottom:1rem}
            .bg-gradient-brand{background:linear-gradient(135deg,#58508d,#bc5090)}.rounded-lg{border-radius:.5rem}
            .font-semibold{font-weight:600}.border{border-width:1px}.border-white\\/20{border-color:rgba(255,255,255,.2)}
            .absolute{position:absolute}.inset-0{top:0;right:0;bottom:0;left:0}.z-0{z-index:0}.w-96{width:24rem}.h-96{height:24rem}
            .bg-brand-pink\\/20{background-color:rgba(188,80,144,.2)}.rounded-full{border-radius:9999px}.blur-\\[80px\\]{filter:blur(80px)}
            .animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
            .inline-flex{display:inline-flex}.gap-2{gap:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}
            .bg-white\\/5{background-color:rgba(255,255,255,.05)}.backdrop-blur-md{backdrop-filter:blur(12px)}.mb-8{margin-bottom:2rem}
            .text-sm{font-size:.875rem;line-height:1.25rem}.text-brand-pink{color:#bc5090}.w-4{width:1rem}.h-4{height:1rem}.text-brand-yellow{color:#ffa600}
          `
        }} />
        {/* Preload critical resources */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
              </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          {children}
          <BackToTop />
          <BookingFloatingWidget />
        </Providers>
        
        {/* Calendly Integration */}
        <Script 
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
        <link 
          href="https://assets.calendly.com/assets/external/widget.css" 
          rel="stylesheet"
        />
      </body>
    </html>
  )
}
