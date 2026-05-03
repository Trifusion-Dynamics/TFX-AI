'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { GradientText } from '@/components/common/GradientText'
import { Home, MessageSquare, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center min-h-[80vh] container mx-auto px-4 text-center">
        <div className="relative mb-8">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[120px] md:text-[200px] font-display font-black leading-none tracking-tighter opacity-10"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AlertTriangle className="w-24 h-24 text-brand-pink mb-4 mx-auto animate-pulse" />
              <GradientText className="text-4xl md:text-6xl font-display font-bold">
                Lost in Space?
              </GradientText>
            </motion.div>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl max-w-md mb-12"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a different dimension.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <AnimatedButton href="/">
            <Home className="w-5 h-5 mr-2" /> Back to Home
          </AnimatedButton>
          <AnimatedButton href="/contact" variant="outline">
            <MessageSquare className="w-5 h-5 mr-2" /> Contact Support
          </AnimatedButton>
        </motion.div>

        {/* Floating Stars Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              initial={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%` 
              }}
              animate={{ 
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
