'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { projectApi } from '@/lib/api/project.api'
import { Project } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Github, ExternalLink, ArrowRight, Search, LayoutGrid, Brain, Globe, Code } from 'lucide-react'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { cn } from '@/lib/utils/cn'

const CATEGORIES = [
  { id: 'ALL', label: 'All', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'AI', label: 'AI Projects', icon: <Brain className="w-4 h-4" /> },
  { id: 'WEB', label: 'Web Projects', icon: <Globe className="w-4 h-4" /> },
  { id: 'SAAS', label: 'SaaS Projects', icon: <Code className="w-4 h-4" /> },
]

const CATEGORY_COLORS: Record<string, string> = {
  'AI': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'WEB': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'SAAS': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'AgroBrain AI', slug: 'agrobrain', description: 'Detailed desc', short_desc: 'Revolutionizing agriculture with AI-powered crop analysis and yield prediction.', thumbnail: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80', images: [], tech_stack: ['Next.js', 'FastAPI', 'PyTorch', 'PostgreSQL'], category: 'AI', is_featured: true, is_published: true },
  { id: '2', title: 'Meetoid', slug: 'meetoid', description: 'Detailed desc', short_desc: 'Intelligent video conferencing with real-time translation and automated summaries.', thumbnail: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80', images: [], tech_stack: ['WebRTC', 'OpenAI', 'TypeScript', 'Redis'], category: 'SAAS', is_featured: true, is_published: true },
  { id: '3', title: 'BillEasy', slug: 'billeasy', description: 'Detailed desc', short_desc: 'Modern invoicing and financial management platform for digital agencies.', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', images: [], tech_stack: ['React', 'PostgreSQL', 'Node.js', 'Tailwind'], category: 'WEB', is_featured: true, is_published: true },
  { id: '4', title: 'DocuChat', slug: 'docuchat', description: 'Detailed desc', short_desc: 'Chat with any PDF document using advanced RAG (Retrieval-Augmented Generation).', thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80', images: [], tech_stack: ['LangChain', 'Pinecone', 'Next.js', 'OpenAI'], category: 'AI', is_featured: false, is_published: true },
  { id: '5', title: 'FitSync', slug: 'fitsync', description: 'Detailed desc', short_desc: 'Comprehensive fitness tracking and workout social network for athletes.', thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', images: [], tech_stack: ['Flutter', 'Firebase', 'Express', 'MongoDB'], category: 'WEB', is_featured: false, is_published: true },
  { id: '6', title: 'CloudOps Dashboard', slug: 'cloudops', description: 'Detailed desc', short_desc: 'Real-time multi-cloud infrastructure monitoring and cost optimization tool.', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', images: [], tech_stack: ['Go', 'Kubernetes', 'Grafana', 'React'], category: 'SAAS', is_featured: false, is_published: true },
]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectApi.getAll()
        const data = res.data.data || []
        setProjects(data.length > 0 ? data : MOCK_PROJECTS)
      } catch (error) {
        console.warn("Backend fetch failed, using fallback mock data.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])


  const filteredProjects = projects.filter(p => 
    activeFilter === 'ALL' || p.category.toUpperCase() === activeFilter
  )

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <SectionHeading
            badge="Our Work"
            title="Our Portfolio"
            subtitle="50+ projects delivered across AI, Web, and SaaS"
            center
            className="mb-8"
          />
        </section>

        {/* Filter Tabs */}
        <section className="container mx-auto px-4 mb-16">
          <div className="flex flex-wrap justify-center gap-8 border-b border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={cn(
                  "relative pb-4 text-sm font-semibold transition-all flex items-center gap-2",
                  activeFilter === cat.id 
                    ? "text-brand-pink" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  {cat.icon} {cat.label}
                </span>
                {activeFilter === cat.id && (
                  <motion.div
                    layoutId="portfolio-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="container mx-auto px-4 min-h-[600px] mb-24">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard hover className="h-full flex flex-col p-0 overflow-hidden border-dark-border group">
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={project.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={cn(
                        "absolute top-4 right-4 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border z-10",
                        CATEGORY_COLORS[project.category.toUpperCase()] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      )}>
                        {project.category}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-display font-bold text-white mb-3 line-clamp-1 group-hover:text-brand-pink transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                        {project.short_desc}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech_stack.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <Link 
                          href={`/portfolio/${project.slug}`}
                          className="text-sm font-semibold text-brand-pink flex items-center gap-1 group/link"
                        >
                          Details <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-16">
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-50 transition-all">
              Previous
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg bg-brand-pink text-white font-bold">1</button>
              <button className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10">2</button>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all">
              Next
            </button>
          </div>

          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>No projects found in this category.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
