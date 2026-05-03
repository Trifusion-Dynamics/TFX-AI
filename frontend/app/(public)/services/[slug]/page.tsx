import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { serviceApi } from '@/lib/api/service.api'
import { notFound } from 'next/navigation'
import { Check, ArrowLeft, Brain, Code, Smartphone, Database, Zap } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

// Mock service for fallback
const MOCK_SERVICE_DETAILS = {
  'ai-development': { id: '1', title: 'AI & Machine Learning', slug: 'ai-development', description: 'Unlock the potential of your data with our custom AI and Machine Learning solutions. We build everything from predictive models to advanced natural language processing systems that help you automate complex tasks and gain deeper insights into your business.', short_desc: 'Custom AI models and intelligent automation systems.', icon: 'brain', features: ['Natural Language Processing', 'Computer Vision', 'Predictive Analytics', 'Recommendation Engines', 'LLM Fine-tuning', 'Autonomous Agents', 'Voice Recognition', 'Anomaly Detection'], is_active: true, order: 1 },
}

async function getService(slug: string) {
  try {
    const res = await serviceApi.getBySlug(slug)
    return res.data.data || MOCK_SERVICE_DETAILS[slug as keyof typeof MOCK_SERVICE_DETAILS]
  } catch {
    return MOCK_SERVICE_DETAILS[slug as keyof typeof MOCK_SERVICE_DETAILS]
  }
}


export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Service Not Found | TFX AI' }
  return {
    title: `${service.title} | TFX AI Services`,
    description: service.short_desc,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) notFound()

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          {/* Service Hero */}
          <section className="flex flex-col lg:flex-row gap-16 items-start mb-24">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" /> Service Detail
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-10">
                {service.description}
              </p>
              <AnimatedButton href={`/contact?service=${service.slug}`} size="lg">
                Start This Project
              </AnimatedButton>
            </div>

            <div className="flex-1 w-full lg:max-w-md">
              <GlassCard className="p-10 flex flex-col gap-8 sticky top-32">
                <h4 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4">Key Features</h4>
                <div className="flex flex-col gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-gray-300">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-pink/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-brand-pink" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </section>

          {/* More Content Placeholder */}
          <section className="border-t border-white/10 pt-24">
            <SectionHeading title="Related Services" className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* This would normally be filtered results from serviceApi.getAll() */}
              <GlassCard hover className="p-8">
                <h4 className="text-xl font-display font-bold text-white mb-3">Web Development</h4>
                <p className="text-gray-400 text-sm mb-6">Scalable web platforms for modern businesses.</p>
                <Link href="/services/web-apps" className="text-brand-pink font-semibold flex items-center gap-2 group">
                  Learn More <Zap className="w-3 h-3 group-hover:fill-brand-pink transition-all" />
                </Link>
              </GlassCard>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
