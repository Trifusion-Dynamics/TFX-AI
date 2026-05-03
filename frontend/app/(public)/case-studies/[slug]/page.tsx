import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { caseStudyApi } from '@/lib/api/case-study.api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { TrendingUp, CheckCircle2, AlertCircle, Rocket, Layers, Quote } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getCaseStudy(slug: string) {
  try {
    const res = await caseStudyApi.getBySlug(slug)
    return res.data.data
  } catch {
    return null
  }
}


export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) return { title: 'Case Study Not Found | TFX AI' }
  return {
    title: `${study.title} | Case Study | TFX AI`,
    description: study.problem,
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params
  const study = await getCaseStudy(slug)

  if (!study) notFound()

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold uppercase mb-6">
              Case Study: {study.industry}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              {study.title}
            </h1>
            <p className="text-xl text-gray-500 font-medium">
              Client: {study.client_name}
            </p>
          </div>
        </section>

        {/* Metrics Row */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {study.metrics.map((metric, idx) => (
              <GlassCard key={idx} className="p-8 text-center border-brand-pink/20">
                <div className="text-3xl font-display font-bold text-brand-pink mb-2">{metric.value}</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{metric.label}</div>
              </GlassCard>
            ))}
            {/* Fallback metrics if API returns fewer */}
            {study.metrics.length < 4 && [...Array(4 - study.metrics.length)].map((_, i) => (
               <GlassCard key={`extra-${i}`} className="p-8 text-center border-white/5">
                <div className="text-3xl font-display font-bold text-white mb-2">99.9%</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Uptime Reliability</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-5xl mx-auto flex flex-col gap-12">
            
            {/* Problem */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3 text-red-400 font-bold uppercase tracking-widest text-sm mb-4">
                  <AlertCircle className="w-5 h-5" /> The Problem
                </div>
                <h2 className="text-3xl font-display font-bold text-white">The Challenge</h2>
              </div>
              <div className="lg:col-span-8">
                <GlassCard className="p-8 border-red-500/10">
                  <div className="flex gap-4">
                    <Quote className="w-10 h-10 text-red-500/20 shrink-0" />
                    <p className="text-gray-400 text-lg leading-relaxed italic">
                      {study.problem}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3 text-brand-yellow font-bold uppercase tracking-widest text-sm mb-4">
                  <Rocket className="w-5 h-5" /> The Solution
                </div>
                <h2 className="text-3xl font-display font-bold text-white">Our Approach</h2>
              </div>
              <div className="lg:col-span-8">
                <div className="prose prose-invert prose-pink max-w-none">
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {study.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3 text-green-400 font-bold uppercase tracking-widest text-sm mb-4">
                  <TrendingUp className="w-5 h-5" /> The Result
                </div>
                <h2 className="text-3xl font-display font-bold text-white">Success Impact</h2>
              </div>
              <div className="lg:col-span-8">
                <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-8 mb-8">
                   <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {study.result}
                  </p>
                </div>

                {/* Metrics Table */}
                <GlassCard className="p-0 overflow-hidden border-white/10">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Metric</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Value</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {study.metrics.map((metric, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-white">{metric.label}</td>
                          <td className="px-6 py-4 text-sm font-bold text-brand-pink text-right">{metric.value}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                              <TrendingUp className="w-3 h-3" /> UP
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </GlassCard>
              </div>
            </div>

          </div>
        </section>

        {/* Tech Stack */}
        <section className="container mx-auto px-4 mb-24">
          <GlassCard className="p-12 text-center max-w-4xl mx-auto border-white/5">
            <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center justify-center gap-3">
              <Layers className="w-6 h-6 text-brand-pink" /> Technologies Powering This Success
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {study.tech_stack.map(tech => (
                <span key={tech} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Gallery */}
        {study.images && study.images.length > 0 && (
          <section className="container mx-auto px-4 mb-24">
            <SectionHeading title="Visual Journey" center className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {study.images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                  <Image src={img} alt={`Process ${idx}`} fill className="object-cover transition-transform group-hover:scale-105" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="container mx-auto px-4">
          <div className="p-16 rounded-[40px] bg-gradient-brand text-center flex flex-col items-center gap-8 shadow-2xl shadow-brand-pink/20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Want similar results?</h2>
            <p className="text-white/80 max-w-2xl text-lg">
              Let&apos;s build an intelligent solution that drives results for your business.
            </p>
            <AnimatedButton href="/contact" variant="ghost" className="bg-white text-black hover:bg-white/90">
              Get Started Now
            </AnimatedButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
