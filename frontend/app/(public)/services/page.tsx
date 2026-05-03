import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { serviceApi } from '@/lib/api/service.api'
import { Service } from '@/types'
import { Brain, Code, Smartphone, Database, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Services | TFX AI',
  description: 'Explore our range of AI-powered digital services, from automation to custom web applications.',
}

// Mock services for fallback
const MOCK_SERVICES: Service[] = [
  { id: '1', title: 'AI & Machine Learning', slug: 'ai-development', description: 'Unlock the potential of your data with our custom AI and Machine Learning solutions. We build everything from predictive models to advanced natural language processing systems that help you automate complex tasks and gain deeper insights into your business.', short_desc: 'Custom AI models and intelligent automation systems.', icon: 'brain', features: ['Natural Language Processing', 'Computer Vision', 'Predictive Analytics', 'Recommendation Engines', 'LLM Fine-tuning'], is_active: true, order: 1 },
  { id: '2', title: 'Web Application Development', slug: 'web-apps', description: 'We create high-performance, scalable, and secure web applications using the latest technologies. Whether you need a simple dashboard or a complex enterprise platform, our team delivers robust solutions that provide exceptional user experiences and drive business growth.', short_desc: 'Next-gen web platforms built with modern tech stacks.', icon: 'code', features: ['Next.js / React Development', 'Full-stack Architecture', 'API Integration', 'Progressive Web Apps (PWA)', 'Cloud-native Solutions'], is_active: true, order: 2 },
  { id: '3', title: 'Mobile App Development', slug: 'mobile-apps', description: 'Reach your customers wherever they are with our custom mobile applications. We specialize in cross-platform development that ensures your app works flawlessly on both iOS and Android, providing a native feel and performance without the double development cost.', short_desc: 'Cross-platform mobile apps for iOS and Android.', icon: 'smartphone', features: ['React Native / Flutter', 'Custom UI/UX Design', 'App Store Optimization', 'Backend Synchronization', 'Push Notifications'], is_active: true, order: 3 },
]

async function getServices() {
  try {
    const res = await serviceApi.getAll()
    return res.data.data || MOCK_SERVICES
  } catch {
    return MOCK_SERVICES
  }
}


export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-24">
          <SectionHeading
            badge="What We Do"
            title="Comprehensive Digital Solutions"
            subtitle="Powered by AI, designed for humans."
            center
            className="mb-8"
          />
        </section>

        {/* Detailed Services List */}
        <section className="container mx-auto px-4">
          <div className="flex flex-col gap-12">
            {services.map((service, idx) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Visual Area */}
                <div className="flex-1 w-full">
                  <div className="relative group aspect-square max-w-md mx-auto lg:mx-0">
                    <div className="absolute inset-0 bg-gradient-brand opacity-20 rounded-3xl blur-3xl group-hover:opacity-40 transition-opacity" />
                    <GlassCard className="h-full flex items-center justify-center border-white/10 group-hover:border-brand-pink/30 transition-colors">
                      <div className="p-12 rounded-full bg-white/5 flex items-center justify-center">
                        <ServiceIcon slug={service.slug} className="w-24 h-24 text-brand-pink" />
                      </div>
                    </GlassCard>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-brand-pink shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <AnimatedButton href={`/contact?service=${service.slug}`}>
                      Get This Service
                    </AnimatedButton>
                    <Link 
                      href={`/services/${service.slug}`} 
                      className="text-gray-400 hover:text-white font-medium flex items-center gap-2 group"
                    >
                      View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-dark-bg/50 py-24 mt-24">
          <div className="container mx-auto px-4 text-center">
            <SectionHeading title="Our Process" subtitle="How we turn your vision into reality" center className="mb-16" />
            
            <div className="relative max-w-5xl mx-auto">
              {/* Connector line for desktop */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-brand opacity-20 hidden lg:block -translate-y-1/2" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <ProcessStep number="01" title="Discovery" desc="Initial call to understand your goals and requirements." />
                <ProcessStep number="02" title="Planning" desc="Detailed roadmap, UI/UX wireframes, and tech selection." />
                <ProcessStep number="03" title="Development" desc="Agile building phase with regular updates and feedback." />
                <ProcessStep number="04" title="Launch" desc="Final testing, deployment, and official project rollout." />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ServiceIcon({ slug, className }: { slug: string, className?: string }) {
  if (slug.includes('ai')) return <Brain className={className} />
  if (slug.includes('web')) return <Code className={className} />
  if (slug.includes('mobile')) return <Smartphone className={className} />
  return <Database className={className} />
}

function ProcessStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-dark-bg border-2 border-brand-pink flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-brand-pink/20">
        {number}
      </div>
      <h4 className="text-xl font-display font-bold text-white">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{desc}</p>
    </div>
  )
}
