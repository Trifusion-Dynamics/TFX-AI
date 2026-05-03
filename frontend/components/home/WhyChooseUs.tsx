import { SectionHeading } from '../common/SectionHeading'
import { GlassCard } from '../common/GlassCard'
import { Rocket, Brain, ShieldCheck, Headphones, ArrowRight } from 'lucide-react'
import { AnimatedButton } from '../common/AnimatedButton'

const FEATURES = [
  {
    icon: <Rocket className="w-6 h-6 text-brand-pink" />,
    title: 'Fast Delivery',
    desc: 'Production-ready in weeks, not months. We use modern boilerplates and AI to speed up development.',
  },
  {
    icon: <Brain className="w-6 h-6 text-brand-purple" />,
    title: 'AI-First Approach',
    desc: 'Every solution is powered by the latest AI technologies to give you a competitive edge.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-brand-red" />,
    title: 'Premium Quality',
    desc: 'Clean, scalable code that is fully tested and documented to ensure long-term stability.',
  },
  {
    icon: <Headphones className="w-6 h-6 text-brand-yellow" />,
    title: 'Full Support',
    desc: '6 months of post-launch support and maintenance included with every major project.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 px-4 bg-dark-bg relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <SectionHeading
              badge="Why Us"
              title="Why Choose TFX AI"
              gradient
            />
            <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
              We don&apos;t just build software; we build intelligent ecosystems. Our team combines deep technical expertise with a passion for innovation to deliver results that exceed expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <AnimatedButton href="/about">
                Learn More About Us
              </AnimatedButton>
              <AnimatedButton href="/contact" variant="ghost">
                Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feature, idx) => (
              <GlassCard key={idx} hover className="flex flex-col gap-4 p-8">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
