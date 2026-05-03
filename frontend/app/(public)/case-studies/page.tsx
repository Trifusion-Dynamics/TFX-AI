import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { caseStudyApi } from '@/lib/api/case-study.api'
import { CaseStudy } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Users, Zap, Building2 } from 'lucide-react'
import { AnimatedButton } from '@/components/common/AnimatedButton'

export const metadata = {
  title: 'Case Studies | TFX AI',
  description: 'Deep dives into how we solve complex problems with AI and web technology.',
}

const MOCK_CASE_STUDIES: CaseStudy[] = [
  { id: '1', title: 'Optimizing Global Supply Chain with AI', slug: 'supply-chain-ai', client_name: 'LogiCorp', industry: 'Logistics', thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', problem: 'Problem text', solution: 'Solution text', result: 'Result text', tech_stack: ['Python', 'TensorFlow'], metrics: [{ label: 'Efficiency', value: '+45%' }, { label: 'Cost Reduction', value: '$1.2M' }] },
  { id: '2', title: 'Next-Gen E-commerce Personalization', slug: 'ecommerce-personalization', client_name: 'ShopSmart', industry: 'Retail', thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80', problem: 'Problem text', solution: 'Solution text', result: 'Result text', tech_stack: ['Next.js', 'OpenAI'], metrics: [{ label: 'Conversion Rate', value: '+28%' }, { label: 'Avg Order Value', value: '+15%' }] },
]

async function getCaseStudies() {
  try {
    const res = await caseStudyApi.getAll()
    return res.data.data || MOCK_CASE_STUDIES
  } catch {
    return MOCK_CASE_STUDIES
  }
}


export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-24">
          <SectionHeading
            badge="Case Studies"
            title="Real Results. Real Impact."
            subtitle="Deep dives into how we solve complex problems for modern enterprises."
            center
            className="mb-8"
          />
        </section>

        {/* Featured Carousel Placeholder */}
        <section className="container mx-auto px-4 mb-24">
          <div className="h-[400px] w-full bg-gradient-brand/5 border border-white/10 rounded-[40px] flex items-center justify-center text-gray-500 italic">
            Featured Case Studies Carousel Coming Soon
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {caseStudies.map((study) => (
              <Link key={study.id} href={`/case-studies/${study.slug}`} className="group">
                <GlassCard className="p-0 overflow-hidden h-full border-white/10 group-hover:border-brand-pink/30 transition-all">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 relative aspect-video md:aspect-auto overflow-hidden">
                      <Image src={study.thumbnail} alt={study.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8 md:w-2/3 flex flex-col gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-pink uppercase mb-3">
                          <Building2 className="w-3 h-3" /> {study.industry}
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-brand-pink transition-colors">
                          {study.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">Client: {study.client_name}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {study.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="px-3 py-1.5 bg-brand-pink/10 border border-brand-pink/20 rounded-lg flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-brand-pink" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{metric.value} {metric.label}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-2">
                        {study.problem}
                      </p>

                      <div className="mt-auto text-sm font-semibold text-brand-pink flex items-center gap-2 group/link">
                        Read Case Study <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-24">
          <GlassCard className="p-12 text-center bg-white/5 border-white/10 flex flex-col items-center gap-6">
            <Zap className="w-12 h-12 text-brand-yellow" />
            <h3 className="text-3xl font-display font-bold text-white">Want Similar Results?</h3>
            <p className="text-gray-400 max-w-xl">
              Let&apos;s discuss how we can apply our AI expertise and engineering excellence to solve your biggest challenges.
            </p>
            <AnimatedButton href="/contact">Schedule a Free Strategy Call</AnimatedButton>
          </GlassCard>
        </section>
      </main>
      <Footer />
    </>
  )
}
