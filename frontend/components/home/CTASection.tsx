'use client'

import { motion } from 'framer-motion'
import { AnimatedButton } from '../common/AnimatedButton'
import { GradientText } from '../common/GradientText'

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background with opacity */}
      <div className="absolute inset-0 bg-brand-base opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-brand opacity-[0.05] pointer-events-none" />
      
      {/* Floating Decorative Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-brand-pink/20 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-purple/20 rounded-full blur-[100px] pointer-events-none" 
      />

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-tight">
            Ready to Build Something <br />
            <GradientText>Amazing?</GradientText>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl">
            Join the forward-thinking companies that are already leveraging TFX AI to scale their impact and intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <AnimatedButton href="/contact" size="lg">
              Start Project Now
            </AnimatedButton>
            <AnimatedButton href="https://calendly.com" variant="outline" size="lg">
              Schedule a Call
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  )
}
