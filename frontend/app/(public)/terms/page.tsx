import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'

export const metadata = {
  title: 'Terms of Service | TFX AI',
  description: 'The terms and conditions for using TFX AI services and website.',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading
            badge="Legal"
            title="Terms of Service"
            className="mb-12"
          />
          
          <div className="prose prose-invert prose-pink max-w-none">
            <p className="text-gray-400 mb-8 italic">Last Updated: March 15, 2026</p>
            
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, then you may not access the website or use any services.</p>
            
            <h2>2. Intellectual Property Rights</h2>
            <p>Unless otherwise indicated, the website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by TFX AI.</p>
            
            <h2>3. User Responsibilities</h2>
            <p>You agree not to use the website for any purpose that is prohibited by these terms. You are responsible for all of your activity in connection with the website.</p>
            
            <h2>4. Limitation of Liability</h2>
            <p>In no event will TFX AI, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the website.</p>

            <h2>5. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.</p>

            <h2>6. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
