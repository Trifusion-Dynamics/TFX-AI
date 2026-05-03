import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'

export const metadata = {
  title: 'Privacy Policy | TFX AI',
  description: 'Learn how TFX AI collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading
            badge="Legal"
            title="Privacy Policy"
            className="mb-12"
          />
          
          <div className="prose prose-invert prose-pink max-w-none">
            <p className="text-gray-400 mb-8 italic">Last Updated: March 15, 2024</p>
            
            <h2>1. Introduction</h2>
            <p>Welcome to TFX AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
            
            <h2>2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on our website or otherwise when you contact us.</p>
            <ul>
              <li><strong>Personal Data:</strong> Names, phone numbers, email addresses, mailing addresses, job titles, and other similar information.</li>
              <li><strong>Usage Data:</strong> We may collect information about your interaction with our website, such as pages visited, time spent, and other diagnostic data.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            
            <h2>4. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

            <h2>5. Contact Us</h2>
            <p>If you have questions or comments about this policy, you may email us at privacy@tfxai.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
