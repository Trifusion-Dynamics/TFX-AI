import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import PortfolioClient from './PortfolioClient'

export const metadata = {
  title: 'Portfolio | TFX AI - AI Projects, Web Apps & SaaS Solutions',
  description: 'Explore TFX AI\'s portfolio of 50+ successful projects including AI applications, web development, and SaaS platforms. See our expertise in action.',
  keywords: ['TFX AI Portfolio', 'AI Projects', 'Web Development Portfolio', 'SaaS Projects', 'AI Applications', 'Next.js Projects', 'Machine Learning Projects'],
  openGraph: {
    title: 'Portfolio | TFX AI - AI Projects, Web Apps & SaaS Solutions',
    description: 'Explore our portfolio of 50+ successful AI, web, and SaaS projects. See our expertise in cutting-edge technology solutions.',
    url: 'https://tfxai.vercel.app/portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | TFX AI - AI Projects, Web Apps & SaaS Solutions',
    description: 'Explore our portfolio of 50+ successful AI, web, and SaaS projects.',
  },
  alternates: {
    canonical: '/portfolio',
  },
}

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <PortfolioClient />
      </main>
      <Footer />
    </>
  )
}
