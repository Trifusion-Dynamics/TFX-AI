"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, AlertCircle, Scale, Globe, Terminal } from 'lucide-react'
import { GradientText } from '@/components/common/GradientText'

export default function TermsPage() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      icon: <CheckCircle className="w-5 h-5" />,
      content: "By accessing or using TFX AI's services, you agree to be bound by these Terms of Service and all applicable laws and regulations."
    },
    {
      title: "2. Use of Services",
      icon: <Terminal className="w-5 h-5" />,
      content: "You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for all activity that occurs under your project requests."
    },
    {
      title: "3. Intellectual Property",
      icon: <Scale className="w-5 h-5" />,
      content: "The service and its original content, features, and functionality are and will remain the exclusive property of TFX AI and its licensors."
    },
    {
      title: "4. Limitation of Liability",
      icon: <AlertCircle className="w-5 h-5" />,
      content: "TFX AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service."
    }
  ]

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Terms of <GradientText>Service</GradientText>
            </h1>
            <p className="text-gray-400">Last Updated: May 2026</p>
          </div>

          <div className="space-y-8">
            {terms.map((term, idx) => (
              <motion.div
                key={term.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-card/30 border border-dark-border p-8 rounded-3xl"
              >
                <div className="flex items-center gap-3 mb-4 text-brand-pink">
                  {term.icon}
                  <h2 className="text-xl font-bold text-white">{term.title}</h2>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>© 2026 TFX AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
