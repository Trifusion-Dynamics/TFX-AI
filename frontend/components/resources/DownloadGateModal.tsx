'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Download, Mail, Share2, Linkedin, Twitter } from 'lucide-react'
import { Resource, ResourceDownloadRequest } from '@/types'
import { resourcesApi } from '@/lib/api/resources.api'
import { GlassCard } from '@/components/common/GlassCard'

interface DownloadGateModalProps {
  resource: Resource
  isOpen: boolean
  onClose: () => void
}

const DownloadGateModal: React.FC<DownloadGateModalProps> = ({ 
  resource, 
  isOpen, 
  onClose 
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subscribeToNewsletter: true
  })
  const [error, setError] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email is required')
      return
    }

    setIsSubmitting(true)

    try {
      const requestData: ResourceDownloadRequest = {
        name: formData.name,
        email: formData.email,
        resource_id: resource.id,
        source_page: window.location.pathname
      }

      const response = await resourcesApi.requestDownload(requestData)
      
      // Success state
      setIsSubmitted(true)
      setSubmittedEmail(formData.email)
      
      // Store downloaded resource in localStorage
      const downloaded = JSON.parse(localStorage.getItem('tfxai_downloaded_resources') || '[]')
      if (!downloaded.includes(resource.id)) {
        downloaded.push(resource.id)
        localStorage.setItem('tfxai_downloaded_resources', JSON.stringify(downloaded))
      }

      console.log('Resource download requested:', response)

    } catch (err) {
      console.error('Download request error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleShare = (platform: 'linkedin' | 'twitter') => {
    const shareText = `Just downloaded a free ${resource.title} from @TFX_AI. Get yours free: https://tfxai.vercel.app/free-resources`
    const shareUrl = platform === 'linkedin' 
      ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://tfxai.vercel.app/free-resources')}`
      : `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    
    window.open(shareUrl, '_blank')
  }

  const getRelevantLinks = () => {
    switch (resource.category) {
      case 'AI':
        return [
          { url: '/ai-tools', text: 'Explore AI Tools' },
          { url: '/services', text: 'AI Development Services' },
          { url: '/contact', text: 'Book AI Consultation' }
        ]
      case 'SaaS':
        return [
          { url: '/portfolio', text: 'View SaaS Projects' },
          { url: '/pricing', text: 'SaaS Pricing Plans' },
          { url: '/services/saas-development', text: 'SaaS Development' }
        ]
      case 'Performance':
        return [
          { url: '/services', text: 'Performance Audit' },
          { url: '/portfolio', text: 'Performance Case Studies' },
          { url: '/contact', text: 'Free Performance Check' }
        ]
      default:
        return [
          { url: '/portfolio', text: 'View Our Work' },
          { url: '/services', text: 'Our Services' },
          { url: '/contact', text: 'Get in Touch' }
        ]
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-brand-purple/20 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-purple/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Resource thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center">
                  <Download size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Get Instant Access</h2>
                  <p className="text-sm text-gray-400 line-clamp-2">{resource.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isSubmitted ? (
              <>
                {/* Value reinforcement */}
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-3">You're getting:</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={16} className="text-green-400" />
                      <span>{resource.pages}-page expert guide</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={16} className="text-green-400" />
                      <span>Downloadable PDF format</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={16} className="text-green-400" />
                      <span>100% free, no credit card</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={16} className="text-green-400" />
                      <span>Delivered to your inbox instantly</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                  <div>
                    <input
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <input
                      name="subscribeToNewsletter"
                      type="checkbox"
                      id="newsletter"
                      checked={formData.subscribeToNewsletter}
                      onChange={handleInputChange}
                      className="mt-1 bg-gray-800 border-gray-700 rounded text-brand-purple focus:ring-brand-purple focus:border-brand-purple"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-400 leading-tight">
                      Also subscribe to TFX AI newsletter for more free resources and AI tips
                    </label>
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending to your email...
                      </>
                    ) : (
                      <>
                        <Mail size={16} />
                        Send Me the Free PDF →
                      </>
                    )}
                  </button>
                </form>

                {/* Privacy note */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 We respect your privacy. Unsubscribe anytime.
                  </p>
                </div>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check size={32} className="text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Check Your Inbox! 📬
                </h3>
                <p className="text-gray-300 mb-6">
                  We've sent "{resource.title}" to {submittedEmail}
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Can't find it? Check your spam folder.
                </p>

                {/* While you wait section */}
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">While you wait, explore:</p>
                  <div className="space-y-2">
                    {getRelevantLinks().map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        className="block w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        {link.text} →
                      </a>
                    ))}
                  </div>
                </div>

                {/* Share buttons */}
                <div>
                  <p className="text-sm text-gray-400 mb-3">
                    Found this useful? Share with your network:
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin size={16} />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <Twitter size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DownloadGateModal
