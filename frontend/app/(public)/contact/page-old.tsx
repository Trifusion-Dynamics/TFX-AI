import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/common/WhatsAppButton'
import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact TFX AI | Get Started with AI-Powered Solutions',
  description: 'Reach out to TFX AI for expert AI development, web solutions, and digital transformation. Get a free consultation and turn your ideas into reality with our expert team.',
  keywords: ['Contact TFX AI', 'AI Development Consultation', 'Web Development Contact', 'AI Solutions', 'Digital Transformation', 'Project Inquiry', 'TFX AI Contact'],
  openGraph: {
    title: 'Contact TFX AI | Get Started with AI-Powered Solutions',
    description: 'Reach out to TFX AI for expert AI development and web solutions. Get a free consultation and turn your ideas into reality.',
    url: 'https://tfxai.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact TFX AI | Get Started with AI-Powered Solutions',
    description: 'Reach out to TFX AI for expert AI development and web solutions. Get a free consultation.',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactClient />
      <WhatsAppButton />
      <Footer />
    </>
  )
}
