'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../common/SectionHeading'
import { Project } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import { AnimatedButton } from '../common/AnimatedButton'
import { cn } from '@/lib/utils/cn'

interface FeaturedProjectsProps {
  projects: Project[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'AI': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'WEB': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'SAAS': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'default': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="py-24 px-4 bg-dark-bg/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <SectionHeading
            badge="Portfolio"
            title="Featured Projects"
            className="flex-grow"
          />
          <AnimatedButton href="/portfolio" variant="ghost" className="hidden md:flex">
            View All Projects <ArrowRight className="w-4 h-4 ml-2" />
          </AnimatedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group flex flex-col bg-dark-card rounded-2xl border border-dark-border overflow-hidden hover:border-brand-pink/30 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={project.thumbnail || '/placeholder-project.png'}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Link 
                    href={`/portfolio/${project.slug}`}
                    className="px-6 py-2 bg-white text-black font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border",
                    CATEGORY_COLORS[project.category.toUpperCase()] || CATEGORY_COLORS.default
                  )}>
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-brand-pink transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                  {project.short_desc}
                </p>

                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5">
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5">
                      +{project.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <AnimatedButton href="/portfolio" variant="outline" className="w-full">
            View All Projects
          </AnimatedButton>
        </div>
      </div>
    </section>
  )
}
