'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../common/SectionHeading'
import { GlassCard } from '../common/GlassCard'
import { FileSearch, MessageSquare, Wand2, ArrowRight } from 'lucide-react'
import { AnimatedButton } from '../common/AnimatedButton'

const AI_TOOLS = [
  {
    icon: <FileSearch className="w-8 h-8 text-brand-purple" />,
    title: 'Resume Analyzer',
    desc: 'Get instant feedback on your resume and optimize it for ATS systems with AI-driven insights.',
    href: '/ai-tools/resume-analyzer',
  },
  {
    icon: <Wand2 className="w-8 h-8 text-brand-pink" />,
    title: 'Text Generator',
    desc: 'Generate high-quality marketing copy, emails, and blog posts in seconds with our advanced LLMs.',
    href: '/ai-tools/text-generator',
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-brand-yellow" />,
    title: 'Q&A Bot',
    desc: 'Upload your documents and chat with them using our intelligent retrieval-augmented generation.',
    href: '/ai-tools/qa-bot',
  },
]

export function AIToolsPreview() {
  return (
    <section className="py-24 px-4 bg-dark-bg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <SectionHeading
            badge="AI Tools"
            title="Try Our AI Tools"
            center={false}
          />
          <AnimatedButton href="/ai-tools" variant="outline" className="hidden md:flex">
            Access All Tools <ArrowRight className="w-4 h-4 ml-2" />
          </AnimatedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AI_TOOLS.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-[1px] rounded-2xl overflow-hidden"
            >
              {/* Animated Gradient Border */}
              <div className="absolute inset-0 bg-gradient-brand opacity-20 group-hover:opacity-100 transition-opacity animate-pulse" />
              
              <GlassCard className="relative h-full flex flex-col items-center text-center p-10 bg-dark-card/90">
                <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-4">
                  {tool.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {tool.desc}
                </p>
                <AnimatedButton href={tool.href} variant="ghost" size="sm" className="mt-auto group/btn">
                  Try Now <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </AnimatedButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <AnimatedButton href="/ai-tools" variant="outline" className="w-full">
            Access All Tools
          </AnimatedButton>
        </div>
      </div>
    </section>
  )
}
