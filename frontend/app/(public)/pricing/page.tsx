import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { CalendlyButton } from '@/components/common/CalendlyButton'
import QuickCalculator from '@/components/common/QuickCalculator'
import { pricingApi } from '@/lib/api/pricing.api'
import { PricingPlan } from '@/types'
import { Check, HelpCircle, MessageCircle, Calculator, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Pricing | TFX AI',
  description: 'Transparent pricing plans for AI development, web applications, and digital consulting.',
}

const MOCK_PLANS: PricingPlan[] = [
  { id: '1', name: 'Starter', slug: 'starter', description: 'Perfect for startups and small businesses looking to build their first AI-powered product.', price: 49000, currency: 'INR', billing_cycle: 'once', features: ['Custom Web App (3-5 pages)', 'Basic AI Chatbot Integration', 'Responsive Design', 'SEO Optimization', '1 Month Support'], is_popular: false, is_active: true },
  { id: '2', name: 'Professional', slug: 'pro', description: 'Ideal for growing companies needing advanced AI features and complex web systems.', price: 99000, currency: 'INR', billing_cycle: 'once', features: ['Custom Web App (Up to 10 pages)', 'Advanced RAG AI System', 'User Authentication & Dashboards', 'Payment Gateway Integration', '3 Months Support', 'Priority Development'], is_popular: true, is_active: true },
  { id: '3', name: 'Enterprise', slug: 'enterprise', description: 'Tailored solutions for large-scale enterprises with specific security and scalability needs.', price: 0, currency: 'INR', billing_cycle: 'once', features: ['Unlimited Pages', 'Custom LLM Fine-tuning', 'Dedicated Project Manager', 'SLA Support', 'On-premise Deployment', 'Quarterly Strategy Reviews'], is_popular: false, is_active: true },
]

async function getPricing() {
  try {
    const res = await pricingApi.getAll()
    return res.data.data || MOCK_PLANS
  } catch {
    return MOCK_PLANS
  }
}


export default async function PricingPage() {
  const plans = await getPricing()

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-24">
          <SectionHeading
            badge="Pricing"
            title="Simple, Transparent Pricing"
            subtitle="Choose the plan that fits your vision. No hidden costs."
            center
            className="mb-8"
          />
        </section>

        {/* Calculator CTA Banner */}
        <section className="container mx-auto px-4 mb-16">
          <GlassCard className="p-8 bg-gradient-brand/10 border-brand-pink/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <Calculator className="w-8 h-8 text-brand-pink" />
                  <h3 className="text-2xl font-display font-bold text-white">
                    Not sure which plan fits? 🤔
                  </h3>
                </div>
                <p className="text-gray-300 text-lg">
                  Use our interactive calculator to get an instant estimate
                </p>
              </div>
              <AnimatedButton 
                href="/pricing/calculator" 
                variant="primary"
                className="bg-gradient-brand text-white px-8 py-4 text-lg font-medium shadow-lg shadow-brand-pink/20"
              >
                Calculate My Project Cost
                <ArrowRight className="w-5 h-5 ml-2" />
              </AnimatedButton>
            </div>
          </GlassCard>
        </section>

        {/* Pricing Section with Calculator */}
        <section className="container mx-auto px-4 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pricing Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                  <PricingCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
            
            {/* Quick Calculator Sidebar */}
            <div className="lg:col-span-1">
              <QuickCalculator />
            </div>
          </div>
        </section>

        {/* Custom Project CTA */}
        <section className="container mx-auto px-4 mb-16">
          <GlassCard className="p-6 bg-gray-800/50 border-gray-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h4 className="text-xl font-display font-bold text-white mb-2">
                  Custom project? Get exact quote →
                </h4>
                <p className="text-gray-400">
                  Every project is unique. Let us provide a tailored estimate for your specific needs.
                </p>
              </div>
              <AnimatedButton 
                href="/pricing/calculator" 
                variant="outline"
                className="border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white"
              >
                Get Custom Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </GlassCard>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 max-w-4xl mb-32">
          <SectionHeading title="Frequently Asked Questions" center className="mb-16" />
          <div className="space-y-6">
            <FAQItem 
              question="How long does a typical project take?" 
              answer="A standard Starter project takes 2-4 weeks, while Professional and Enterprise solutions can take 6-12 weeks depending on complexity." 
            />
            <FAQItem 
              question="Do you offer custom pricing for ongoing work?" 
              answer="Yes, we offer retainer models for businesses that need continuous AI improvements and maintenance." 
            />
            <FAQItem 
              question="Which AI models do you use?" 
              answer="We work with various state-of-the-art models including Gemini, GPT-4, and open-source models like Llama, depending on your needs." 
            />
            <FAQItem 
              question="Is the payment structure flexible?" 
              answer="Typically, we work with a 50% upfront and 50% upon completion model, but we are open to milestone-based payments for larger projects." 
            />
            <FAQItem 
              question="Do you provide the source code?" 
              answer="Absolutely. Once the project is completed and the final payment is made, you own the full source code and intellectual property." 
            />
          </div>
        </section>

        {/* Custom CTA */}
        <section className="container mx-auto px-4">
          <GlassCard className="p-12 bg-gradient-brand/10 border-brand-pink/30 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-display font-bold text-white mb-2">Need something specific?</h3>
              <p className="text-gray-400">Let&apos;s talk about your custom requirements and build a tailored solution.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <AnimatedButton href="https://wa.me" variant="primary" className="bg-green-600 shadow-green-600/20">
                <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Us
              </AnimatedButton>
              <AnimatedButton href="/contact" variant="outline">
                Contact Form
              </AnimatedButton>
            </div>
          </GlassCard>
        </section>
      </main>
      <Footer />
    </>
  )
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <GlassCard 
      className={`relative p-10 flex flex-col h-full border-2 ${
        plan.is_popular ? 'border-brand-pink/50 bg-brand-pink/5 scale-105 z-10 shadow-2xl shadow-brand-pink/10' : 'border-white/10'
      } hover:border-brand-pink/40 transition-all duration-300`}
    >
      {plan.is_popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-brand text-white text-xs font-bold rounded-full uppercase tracking-widest">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h4 className="text-xl font-display font-bold text-white mb-2">{plan.name}</h4>
        <p className="text-gray-500 text-sm">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-display font-bold text-white">
            {plan.price === 0 ? 'Custom' : `₹${plan.price.toLocaleString()}`}
          </span>
          {plan.price !== 0 && (
            <span className="text-gray-500 text-sm font-medium">/{plan.billing_cycle === 'once' ? 'project' : 'mo'}</span>
          )}
        </div>
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
            <Check className="w-5 h-5 text-brand-pink shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <AnimatedButton 
        href={`/contact?plan=${plan.slug}`} 
        variant={plan.is_popular ? 'primary' : 'outline'} 
        className="w-full"
      >
        Choose Plan
      </AnimatedButton>
      
      {/* Calendly CTA */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <CalendlyButton 
          text="Have questions about this plan? Book a call →" 
          variant="ghost" 
          size="sm"
          className="w-full"
        />
      </div>
    </GlassCard>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-start gap-4">
        <HelpCircle className="w-6 h-6 text-brand-pink shrink-0 mt-1" />
        <div>
          <h4 className="text-lg font-display font-bold text-white mb-2">{question}</h4>
          <p className="text-gray-400 leading-relaxed text-sm">{answer}</p>
        </div>
      </div>
    </GlassCard>
  )
}
