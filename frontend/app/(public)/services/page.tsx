import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import ServicesClient from './ServicesClient'

export const metadata = {
  title: 'Professional Web Development & Digital Services | TFX AI Agency',
  description: 'Expert AI development, web & mobile apps, SaaS solutions, API development, cloud DevOps, UI/UX design, and SEO services. Transform your business with cutting-edge technology solutions.',
  keywords: ['AI development', 'web development', 'mobile app development', 'SaaS development', 'API development', 'cloud DevOps', 'UI/UX design', 'SEO services', 'machine learning', 'React development', 'Next.js development', 'custom software solutions'],
  openGraph: {
    title: 'Professional Web Development & Digital Services | TFX AI Agency',
    description: 'Expert AI development, web & mobile apps, SaaS solutions, API development, cloud DevOps, UI/UX design, and SEO services. Transform your business with cutting-edge technology solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Web Development & Digital Services | TFX AI Agency',
    description: 'Expert AI development, web & mobile apps, SaaS solutions, API development, cloud DevOps, UI/UX design, and SEO services.',
  },
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <ServicesClient />
      </main>
      <Footer />
    </>
  )
}
