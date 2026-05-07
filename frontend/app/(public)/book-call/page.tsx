import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { CalendlyButton } from '@/components/common/CalendlyButton'
import { CalendlyEmbed } from '@/components/common/CalendlyEmbed'
import { Calendar, Clock, Video, DollarSign, Languages, CalendarDays, User, Users, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Book a Free Consultation | TFX AI',
  description: 'Schedule a free 30-minute consultation call with TFX AI. Discuss your project, get expert advice, and receive a custom quote.',
}

export default function BookCallPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT COLUMN - Info Panel */}
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-brand p-0.5 mb-6">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-brand-pink" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
                Book a Free 30-min Call
              </h1>
              <p className="text-xl text-gray-400">
                No commitment. No sales pressure. Just expert advice.
              </p>
            </div>

            {/* What to Expect */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 text-white">What to expect</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-300">Project scope discussion</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-300">Tech stack recommendation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-300">Rough timeline & budget estimate</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-300">Q&A — ask us anything</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-300">Next steps if you want to proceed</span>
                </li>
              </ul>
            </div>

            {/* Call Details */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 text-white">Call Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-brand-pink" />
                  <div>
                    <div className="font-medium text-white">Duration</div>
                    <div className="text-gray-400">30 minutes</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Video className="w-5 h-5 text-brand-pink" />
                  <div>
                    <div className="font-medium text-white">Platform</div>
                    <div className="text-gray-400">Google Meet / Zoom</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <DollarSign className="w-5 h-5 text-brand-pink" />
                  <div>
                    <div className="font-medium text-white">Cost</div>
                    <div className="text-gray-400">Completely FREE</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Languages className="w-5 h-5 text-brand-pink" />
                  <div>
                    <div className="font-medium text-white">Language</div>
                    <div className="text-gray-400">English / Hindi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 text-white">Availability</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <CalendarDays className="w-5 h-5 text-brand-pink" />
                  <div>
                    <div className="font-medium text-white">Days</div>
                    <div className="text-gray-400">Monday – Saturday</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-brand-pink" />
                  <div>
                    <div className="font-medium text-white">Hours</div>
                    <div className="text-gray-400">9:00 AM – 7:00 PM IST</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Same-day slots</div>
                    <div className="text-gray-400">Often available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Card */}
            <div className="bg-gradient-brand/10 backdrop-blur-md rounded-xl p-6 border border-brand-pink/20">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">AK</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">You'll be talking to:</div>
                  <h3 className="text-xl font-semibold text-white mb-1">Arun Kumar Bind</h3>
                  <p className="text-brand-pink mb-2">Founder & Lead AI Engineer</p>
                  <p className="text-gray-300 text-sm">60+ projects delivered</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 mb-4">
                Join 50+ founders who've already consulted with us
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                {['JD', 'SM', 'RK', 'AP', 'TM'].map((initials, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-pink/20 to-brand-yellow/20 flex items-center justify-center border border-white/10"
                  >
                    <span className="text-xs font-medium text-white">{initials}</span>
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gradient-brand/20 flex items-center justify-center border border-white/10">
                  <span className="text-xs font-medium text-white">+...</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Calendly Embed */}
          <div className="lg:sticky lg:top-24">
            <CalendlyEmbed height={800} />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <summary className="font-semibold text-white cursor-pointer hover:text-brand-pink transition-colors">
                Do I need to prepare anything?
              </summary>
              <p className="mt-4 text-gray-300">
                Just have a rough idea of your project. We'll handle the rest. No need for detailed requirements or technical specifications.
              </p>
            </details>
            
            <details className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <summary className="font-semibold text-white cursor-pointer hover:text-brand-pink transition-colors">
                What if I'm not ready to start immediately?
              </summary>
              <p className="mt-4 text-gray-300">
                That's completely fine! We love early conversations and are happy to help you plan your project timeline, whether you're starting next week or next year.
              </p>
            </details>
            
            <details className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <summary className="font-semibold text-white cursor-pointer hover:text-brand-pink transition-colors">
                Can I reschedule?
              </summary>
              <p className="mt-4 text-gray-300">
                Yes, Calendly allows easy rescheduling anytime. You'll receive a confirmation email with a link to reschedule if needed.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
