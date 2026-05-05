'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { WhatsAppButton } from '@/components/common/WhatsAppButton'
import { contactSchema, ContactFormData } from '@/lib/validations/contact.schema'
import { contactApi } from '@/lib/api/contact.api'
import { Mail, Phone, MapPin, Clock, Github, Linkedin, Twitter, CheckCircle, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export const metadata = {
  title: 'Contact TFX AI | Get Started with AI-Powered Solutions',
  description: 'Reach out to TFX AI for expert AI development, web solutions, and digital transformation. Get a free consultation and turn your ideas into reality with our expert team.',
  keywords: ['Contact TFX AI', 'AI Development Consultation', 'Web Development Contact', 'AI Solutions', 'Digital Transformation', 'Project Inquiry', 'TFX AI Contact'],
  openGraph: {
    title: 'Contact TFX AI | Get Started with AI-Powered Solutions',
    description: 'Reach out to TFX AI for expert AI development and web solutions. Get a free consultation and turn your ideas into reality.',
    url: 'https://tfxai.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact TFX AI | Get Started with AI-Powered Solutions',
    description: 'Reach out to TFX AI for expert AI development and web solutions. Get a free consultation.',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    try {
      await contactApi.submit(data)
      setIsSubmitted(true)
      toast.success('Message sent successfully!')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left: Contact Info */}
            <div className="lg:w-2/5 flex flex-col gap-10">
              <div>
                <SectionHeading
                  badge="Get in Touch"
                  title="Let's Build Something Together"
                  subtitle="Have an idea? Let's turn it into a powerful AI-driven reality. Reach out and we'll respond within 24 hours."
                  className="mb-0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <ContactInfoCard 
                  icon={<Mail className="w-5 h-5 text-brand-pink" />}
                  label="Email Us"
                  value="contact@tfxai.com"
                  href="mailto:contact@tfxai.com"
                />
                <ContactInfoCard 
                  icon={<Phone className="w-5 h-5 text-brand-purple" />}
                  label="WhatsApp"
                  value="+91 98765 43210"
                  href="https://wa.me/919876543210"
                />
                <ContactInfoCard 
                  icon={<MapPin className="w-5 h-5 text-brand-orange" />}
                  label="Location"
                  value="Delhi/Noida, India"
                />
                <ContactInfoCard 
                  icon={<Clock className="w-5 h-5 text-brand-yellow" />}
                  label="Response Time"
                  value="Within 24 hours"
                />
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-gray-400 font-semibold">Follow Our Journey</p>
                <div className="flex gap-4">
                  <SocialIcon href="#" icon={<Github />} />
                  <SocialIcon href="#" icon={<Linkedin />} />
                  <SocialIcon href="#" icon={<Twitter />} />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold self-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Currently Accepting Projects
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:w-3/5">
              <GlassCard className="p-8 md:p-12 border-brand-pink/20 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput 
                          label="Full Name"
                          placeholder="Arun Kumar"
                          error={errors.name?.message}
                          {...register('name')}
                        />
                        <FormInput 
                          label="Email Address"
                          placeholder="arun@example.com"
                          type="email"
                          error={errors.email?.message}
                          {...register('email')}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput 
                          label="Phone Number (Optional)"
                          placeholder="1234567890"
                          error={errors.phone?.message}
                          {...register('phone')}
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-gray-400 ml-1">Service Interested In</label>
                          <select 
                            {...register('service')}
                            className={cn(
                              "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all appearance-none",
                              errors.service && "border-red-500"
                            )}
                          >
                            <option value="" className="bg-dark-bg">Select a service</option>
                            <option value="Web Development" className="bg-dark-bg">Web Development</option>
                            <option value="AI Chatbot" className="bg-dark-bg">AI Chatbot</option>
                            <option value="SaaS" className="bg-dark-bg">SaaS Development</option>
                            <option value="UI/UX" className="bg-dark-bg">UI/UX Design</option>
                            <option value="API Dev" className="bg-dark-bg">API Development</option>
                            <option value="Other" className="bg-dark-bg">Other</option>
                          </select>
                          {errors.service && <span className="text-xs text-red-500 ml-1">{errors.service.message}</span>}
                        </div>
                      </div>
                      <FormInput 
                        label="Subject"
                        placeholder="Project Inquiry: AI Dashboard"
                        error={errors.subject?.message}
                        {...register('subject')}
                      />
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Your Message</label>
                        <textarea 
                          {...register('message')}
                          placeholder="Tell us about your project..."
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all min-h-[150px]",
                            errors.message && "border-red-500"
                          )}
                        />
                        {errors.message && <span className="text-xs text-red-500 ml-1">{errors.message.message}</span>}
                      </div>

                      <AnimatedButton 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-brand text-white py-4 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </AnimatedButton>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-12 flex flex-col items-center gap-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-white">Message Sent!</h3>
                      <p className="text-gray-400 max-w-sm mx-auto">
                        Thank you for reaching out. We&apos;ve received your message and our team will get back to you within 24 hours.
                      </p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-brand-pink font-semibold hover:underline"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </div>

          </div>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  )
}

function ContactInfoCard({ icon, label, value, href }: { icon: any, label: string, value: string, href?: string }) {
  const content = (
    <GlassCard className="p-5 flex items-center gap-4 border-white/5 hover:border-brand-pink/20 transition-all cursor-default">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </GlassCard>
  )

  if (href) return <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{content}</a>
  return content
}

function SocialIcon({ href, icon }: { href: string, icon: any }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-pink transition-all">
      {icon}
    </a>
  )
}

const FormInput = ({ label, error, ...props }: any) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-400 ml-1">{label}</label>
      <input 
        {...props}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
          error && "border-red-500"
        )}
      />
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  )
}
