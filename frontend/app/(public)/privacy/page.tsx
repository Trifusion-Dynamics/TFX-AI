"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Bell, Globe, Cookie } from 'lucide-react'
import { GradientText } from '@/components/common/GradientText'

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Lock className="w-5 h-5" />,
      content: "We collect information you provide directly to us, such as when you create an account, fill out a contact form, or apply for a job. This may include your name, email address, phone number, and professional history."
    },
    {
      title: "How We Use Information",
      icon: <Eye className="w-5 h-5" />,
      content: "We use the information we collect to provide, maintain, and improve our services, to process job applications, and to communicate with you about updates and project requests."
    },
    {
      title: "Data Security",
      icon: <Shield className="w-5 h-5" />,
      content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction."
    },
    {
      title: "Cookie Policy",
      icon: <Cookie className="w-5 h-5" />,
      content: "We use cookies and similar technologies to track activity on our service and hold certain information to improve your experience."
    }
  ]

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Privacy <GradientText>Policy</GradientText>
            </h1>
            <p className="text-gray-400">Last Updated: May 2026</p>
          </div>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-card/30 border border-dark-border p-8 rounded-3xl"
              >
                <div className="flex items-center gap-3 mb-4 text-brand-pink">
                  {section.icon}
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-brand-purple/5 border border-brand-purple/20 rounded-3xl">
            <p className="text-sm text-gray-400 text-center">
              If you have any questions about this Privacy Policy, please contact us at privacy@tfxai.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
