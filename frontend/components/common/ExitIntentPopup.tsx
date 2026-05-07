'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Copy, Loader2 } from 'lucide-react'
import { useExitIntent } from '@/lib/hooks/useExitIntent'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { PopupVariant, ExitPopupFormData } from '@/types'
import { contactApi } from '@/lib/api/contact.api'

const ExitIntentPopup: React.FC = () => {
  const { shouldShow, markAsShown, markAsConverted, resetPopup } = useExitIntent()
  const [variant, setVariant] = useState<PopupVariant>('A')
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [formData, setFormData] = useState<ExitPopupFormData>({
    name: '',
    email: '',
    website: '',
    projectType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  
  const countdown = useCountdown(48)

  // Determine variant on first mount
  useEffect(() => {
    const stored = sessionStorage.getItem('tfxai_exit_popup_variant')
    if (stored) {
      setVariant(stored as PopupVariant)
    } else {
      const newVariant = Math.random() > 0.5 ? 'B' : 'A'
      setVariant(newVariant)
      sessionStorage.setItem('tfxai_exit_popup_variant', newVariant)
    }
  }, [])

  // Show popup when shouldShow is true
  useEffect(() => {
    if (shouldShow && !isVisible) {
      setIsVisible(true)
      console.log('[TFX Analytics]', 'exit_popup_shown', { variant })
    }
  }, [shouldShow, isVisible, variant])

  // Analytics tracking
  const trackEvent = useCallback((eventName: string, data?: any) => {
    console.log('[TFX Analytics]', eventName, { variant, ...data })
  }, [variant])

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
    trackEvent('exit_popup_submitted', { email: formData.email })

    try {
      // Send to contact API
      await contactApi.submit({
        name: formData.name,
        email: formData.email,
        phone: '',
        subject: variant === 'A' 
          ? "Exit Popup - Free Website Audit Request"
          : "Exit Popup - 10% Discount Claim",
        message: variant === 'A'
          ? `Free audit requested. Website: ${formData.website || 'not provided'}`
          : `Discount claimed. Project type: ${formData.projectType}. Variant B popup.`
      })

      // If variant B, also subscribe to newsletter
      if (variant === 'B') {
        try {
          // await newsletterApi.subscribe({ email: formData.email })
          // Newsletter API would go here
        } catch (e) {
          // Don't fail the whole submission if newsletter fails
        }
      }

      // Success state
      setIsSubmitted(true)
      setSubmittedEmail(formData.email)
      markAsConverted()
      trackEvent('exit_popup_converted', { email: formData.email })

      // Auto-close after 8 seconds
      setTimeout(() => {
        handleClose()
      }, 8000)

    } catch (err) {
      console.error('Exit popup submission error:', err)
      setError('Something went wrong. Try WhatsApp instead 📱')
      trackEvent('exit_popup_error', { error: err })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, variant, markAsConverted, trackEvent])

  // Handle close
  const handleClose = useCallback(() => {
    setIsVisible(false)
    markAsShown()
    trackEvent('exit_popup_closed')
  }, [markAsShown, trackEvent])

  // Handle copy discount code
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText('TFX10FIRST')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
    trackEvent('exit_popup_code_copied')
  }, [trackEvent])

  // Handle CTA clicks
  const handleCTAClick = useCallback((url: string) => {
    trackEvent('exit_popup_cta_clicked', { url })
    window.location.href = url
  }, [trackEvent])

  // Render Variant A - Free Audit
  const renderVariantA = () => (
    <div className="flex flex-col md:flex-row max-w-4xl w-full mx-4">
      {/* Left decoration - desktop only */}
      <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-brand-purple to-brand-pink p-8 rounded-l-2xl flex-col justify-center items-center text-white">
        <div className="text-6xl mb-4">🎁</div>
        <div className="text-2xl font-bold mb-2">TFX AI</div>
        <div className="text-lg mb-4">60+ Happy Clients</div>
        <div className="text-sm italic text-center">"Their AI chatbot increased our leads by 40%!"</div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-900 p-8 md:rounded-r-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Wait! Before You Go... 🎁
          </h2>
          <h3 className="text-xl text-brand-purple mb-4">
            Get a FREE Website Audit
          </h3>
        </div>

        <div className="mb-6 text-gray-300">
          <p className="mb-4">
            Let us analyze your current website and tell you:
          </p>
          <ul className="space-y-2">
            <li>✅ Speed & performance issues</li>
            <li>✅ SEO gaps hurting your rankings</li>
            <li>✅ Missing AI opportunities</li>
            <li>✅ Quick wins for more conversions</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-brand-purple to-brand-pink text-white text-center py-2 px-4 rounded-lg mb-6">
          Worth ₹5,000 — Yours FREE
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
            />
            <input
              name="website"
              type="url"
              placeholder="your-website.com (optional)"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
            />
            
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Sending...
                </>
              ) : (
                "Send Me the Free Audit →"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check size={32} className="text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Audit Request Received! 🎉
            </h3>
            <p className="text-gray-300 mb-6">
              We'll analyze your website and send the full report to {submittedEmail} within 24 hours.
            </p>
            <p className="text-gray-400 mb-4">While you wait:</p>
            <div className="space-y-2">
              <button
                onClick={() => handleCTAClick('/portfolio')}
                className="block w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Our Portfolio
              </button>
              <button
                onClick={() => handleCTAClick('/pricing')}
                className="block w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Check Pricing
              </button>
              <button
                onClick={() => handleCTAClick('/book-call')}
                className="block w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Book a Call
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-gray-400 text-sm mt-4">
          🔒 No spam. Audit delivered within 24 hours.
        </div>
      </div>
    </div>
  )

  // Render Variant B - Discount
  const renderVariantB = () => (
    <div className="flex flex-col md:flex-row max-w-4xl w-full mx-4">
      {/* Left decoration - desktop only */}
      <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-brand-purple to-brand-pink p-8 rounded-l-2xl flex-col justify-center items-center text-white">
        <div className="text-6xl mb-4">⚡</div>
        <div className="text-2xl font-bold mb-2">TFX AI</div>
        <div className="text-lg mb-4">60+ Happy Clients</div>
        <div className="text-sm italic text-center">"Their AI solutions transformed our business!"</div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-900 p-8 md:rounded-r-2xl">
        <div className="bg-gradient-to-r from-brand-purple to-brand-pink text-white text-center py-2 px-4 rounded-lg mb-6">
          LIMITED TIME OFFER ⚡
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Get 10% OFF Your First Project
          </h2>
          <h3 className="text-xl text-brand-purple mb-4">
            Leaving already? Here's a special deal just for you — valid for 48 hours only.
          </h3>
        </div>

        {/* Countdown Timer */}
        <div className="text-center mb-6">
          <div className="text-gray-400 mb-2">Offer expires in:</div>
          {!countdown.isExpired ? (
            <div className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
              {String(countdown.hours).padStart(2, '0')}:
              {String(countdown.minutes).padStart(2, '0')}:
              {String(countdown.seconds).padStart(2, '0')}
            </div>
          ) : (
            <div className="text-2xl text-red-400">Offer Expired</div>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
            />
            <select
              name="projectType"
              required
              value={formData.projectType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
            >
              <option value="">Select project type</option>
              <option value="Website">Website</option>
              <option value="AI Chatbot">AI Chatbot</option>
              <option value="SaaS">SaaS</option>
              <option value="Other">Other</option>
            </select>
            
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || countdown.isExpired}
              className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Sending...
                </>
              ) : (
                "Claim My 10% Discount →"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check size={32} className="text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Your 10% Discount is Reserved! 🎉
            </h3>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
              <div className="text-gray-400 text-sm mb-1">Discount code:</div>
              <div className="flex items-center justify-center gap-2">
                <div className="text-2xl font-bold text-brand-purple">TFX10FIRST</div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                >
                  <Copy size={16} className="text-white" />
                </button>
              </div>
              {copiedCode && (
                <div className="text-green-400 text-sm mt-1">Copied!</div>
              )}
            </div>

            <p className="text-gray-300 mb-6">
              Valid for 48 hours. We've also sent it to {submittedEmail}
            </p>

            <button
              onClick={() => handleCTAClick('/contact')}
              className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Start Your Project Now →
            </button>
          </div>
        )}

        <div className="text-center text-gray-400 text-sm mt-4">
          ✨ Discount code sent to your email instantly
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-[102]"
            >
              <X size={24} />
            </button>

            {/* Popup content */}
            {variant === 'A' ? renderVariantA() : renderVariantB()}

            {/* No thanks link */}
            <button
              onClick={handleClose}
              className="absolute bottom-4 right-4 text-gray-400 hover:text-white text-sm transition-colors"
            >
              No thanks, I'll pass
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExitIntentPopup
