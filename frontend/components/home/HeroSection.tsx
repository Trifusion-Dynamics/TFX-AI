'use client'

import {  useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedButton } from '../common/AnimatedButton'
import { ChevronDown, Zap } from 'lucide-react'
import { GradientText } from '../common/GradientText'
import { cn } from '@/lib/utils/cn'

const TECH_BADGES = [
  { name: 'Next.js', color: 'bg-white/10' },
  { name: 'FastAPI', color: 'bg-green-500/10' },
  { name: 'AI', color: 'bg-purple-500/10' },
  { name: 'React', color: 'bg-blue-500/10' },
  { name: 'PostgreSQL', color: 'bg-blue-600/10' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-dark-bg">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[80px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-base/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 group cursor-default"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-20 transition-opacity animate-pulse" />
          <Zap className="w-4 h-4 text-brand-yellow" />
          <span className="text-sm font-medium text-brand-pink">🤖 AI-Powered Development Agency</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight"
        >
          We Build <br />
          <GradientText className="text-6xl md:text-8xl lg:text-9xl">Intelligent Digital Products</GradientText>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          From AI Chatbots to full-scale SaaS platforms — we turn your ideas into powerful digital experiences.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <AnimatedButton href="/contact" size="lg">
            Start Your Project →
          </AnimatedButton>
          <AnimatedButton href="/portfolio" variant="outline" size="lg">
            View Our Work
          </AnimatedButton>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-10 border-t border-white/10"
        >
          <StatItem value={50} label="Projects" suffix="+" />
          <StatItem value={15} label="AI Tools Built" suffix="+" />
          <StatItem value={100} label="Client Satisfaction" suffix="%" />
        </motion.div>
      </div>

      {/* Floating Tech Stack Badges */}
      {TECH_BADGES.map((tech, idx) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + idx * 0.1 }}
          className={cn(
            "absolute hidden xl:block px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm text-sm font-medium text-white/60 animate-float",
            idx === 0 && "top-1/4 left-10",
            idx === 1 && "top-1/3 right-10 animation-delay-1000",
            idx === 2 && "bottom-1/4 left-20 animation-delay-2000",
            idx === 3 && "bottom-1/3 right-20 animation-delay-3000",
            idx === 4 && "top-1/2 right-[15%] animation-delay-4000"
          )}
          style={{ animationDelay: `${idx * 1.5}s` }}
        >
          {tech.name}
        </motion.div>
      ))}

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  )
}

function StatItem({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 2000
    const stepTime = Math.abs(Math.floor(duration / end))
    
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
        {count}{suffix}
      </span>
      <span className="text-sm text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
  )
}
