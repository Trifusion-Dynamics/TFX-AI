"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Home, 
  Info, 
  Briefcase, 
  Mail, 
  Shield, 
  FileText, 
  Cpu, 
  Code, 
  Database,
  Globe,
  Layout,
  Layers,
  Search
} from 'lucide-react'
import { GradientText } from '@/components/common/GradientText'

const sitemapData = [
  {
    title: "Main Pages",
    icon: <Globe className="w-5 h-5" />,
    links: [
      { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
      { name: "About Us", href: "/about", icon: <Info className="w-4 h-4" /> },
      { name: "Services", href: "/#services", icon: <Layers className="w-4 h-4" /> },
      { name: "Pricing", href: "/pricing", icon: <FileText className="w-4 h-4" /> },
      { name: "Careers", href: "/career", icon: <Briefcase className="w-4 h-4" /> },
      { name: "Contact", href: "/contact", icon: <Mail className="w-4 h-4" /> },
    ]
  },
  {
    title: "Services",
    icon: <Cpu className="w-5 h-5" />,
    links: [
      { name: "AI Development", href: "/services/ai-development", icon: <Cpu className="w-4 h-4" /> },
      { name: "Web Applications", href: "/services/web-apps", icon: <Globe className="w-4 h-4" /> },
      { name: "Mobile Apps", href: "/services/mobile-apps", icon: <Layout className="w-4 h-4" /> },
      { name: "UI/UX Design", href: "/services/ui-ux", icon: <Code className="w-4 h-4" /> },
    ]
  },
  {
    title: "Legal",
    icon: <Shield className="w-5 h-5" />,
    links: [
      { name: "Privacy Policy", href: "/privacy", icon: <Shield className="w-4 h-4" /> },
      { name: "Terms of Service", href: "/terms", icon: <FileText className="w-4 h-4" /> },
    ]
  },
  {
    title: "Resources",
    icon: <Database className="w-5 h-5" />,
    links: [
      { name: "Blog", href: "/blog", icon: <FileText className="w-4 h-4" /> },
      { name: "AI Tools", href: "/ai-tools", icon: <Cpu className="w-4 h-4" /> },
      { name: "Case Studies", href: "/case-studies", icon: <Search className="w-4 h-4" /> },
    ]
  }
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-20 relative">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Site <GradientText>Map</GradientText>
            </h1>
            <p className="text-gray-400">Navigate through all the pages of TFX AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sitemapData.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-card/30 border border-dark-border p-8 rounded-3xl hover:border-brand-pink/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-pink/10 rounded-lg text-brand-pink">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>

                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                      >
                        <span className="p-1 bg-white/5 rounded group-hover:bg-brand-pink/20 group-hover:text-brand-pink transition-colors">
                          {link.icon}
                        </span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
