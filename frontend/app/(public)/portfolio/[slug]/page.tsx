import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { projectApi } from '@/lib/api/project.api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Github, ExternalLink, ArrowLeft, Share2, Calendar, Tag, Layers } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  try {
    const res = await projectApi.getBySlug(slug)
    return res.data.data
  } catch {
    return null
  }
}


export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project Not Found | TFX AI' }
  return {
    title: `${project.title} | Portfolio | TFX AI`,
    description: project.short_desc,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          {/* Project Hero */}
          <section className="mb-16">
            <div className="flex flex-col lg:flex-row gap-12 items-start mb-12">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold uppercase rounded-full">
                    {project.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                  {project.title}
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed mb-8">
                  {project.short_desc}
                </p>
                
                <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-purple" />
                    <span>{project.tech_stack.length} Technologies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-purple" />
                    <span>Completed 2024</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <AnimatedButton href={project.live_url || '#'} className="w-full" size="lg">
                  <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
                </AnimatedButton>
                {project.github_url && (
                  <AnimatedButton href={project.github_url} variant="outline" className="w-full" size="lg">
                    <Github className="w-5 h-5 mr-2" /> View Source
                  </AnimatedButton>
                )}
              </div>
            </div>

            <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src={project.thumbnail} 
                alt={project.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </section>

          {/* Main Content */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
            <div className="lg:col-span-2 flex flex-col gap-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-6">Project Overview</h2>
                <div className="prose prose-invert prose-pink max-w-none">
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {project.images && project.images.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5">
                        <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1 flex flex-col gap-8">
              <GlassCard className="p-8 sticky top-32">
                <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-pink" /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech_stack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Client</span>
                    <span className="text-white font-medium">Confidential</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-white font-medium">3 Months</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="text-white font-medium">{project.category}</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <button className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>

              <div className="p-8 rounded-3xl bg-gradient-brand flex flex-col items-center text-center gap-6">
                <h3 className="text-xl font-display font-bold text-white">Start a Similar Project</h3>
                <p className="text-white/80 text-sm">Let&apos;s build your vision together using our AI-first approach.</p>
                <AnimatedButton href="/contact" variant="ghost" className="bg-white text-black hover:bg-white/90">
                  Get Started
                </AnimatedButton>
              </div>
            </aside>
          </section>

          {/* Related Projects */}
          <section className="border-t border-white/10 pt-24">
            <SectionHeading title="Related Projects" className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50 pointer-events-none">
              <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
