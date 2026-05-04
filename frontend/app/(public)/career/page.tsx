"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Send,
  Upload,
  User,
  Mail,
  Phone,
  FileText
} from 'lucide-react'
import { GradientText } from '@/components/common/GradientText'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { toast } from 'react-hot-toast'

interface Job {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  type: string
  salary_range: string
}

export default function CareerPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    resume_url: '',
    cover_letter: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`)
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Application submitted successfully!')
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          resume_url: '',
          cover_letter: ''
        })
        setSelectedJob(null)
      } else {
        toast.error('Failed to submit application.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-20 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Join the <GradientText>Future of AI</GradientText>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              We're looking for visionary engineers, researchers, and designers to help us build the next generation of intelligent systems.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Jobs List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
              <Briefcase className="text-brand-pink" />
              Open Positions
            </h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-dark-card/50 rounded-2xl animate-pulse border border-dark-border" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-dark-card/30 border border-dark-border p-12 rounded-2xl text-center">
                <p className="text-gray-400">No open positions at the moment. Check back later!</p>
              </div>
            ) : (
              jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
                    selectedJob?.id === job.id 
                      ? 'bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 border-brand-pink shadow-[0_0_30px_rgba(255,46,151,0.1)]' 
                      : 'bg-dark-card/30 border-dark-border hover:border-brand-purple/50'
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-pink transition-colors">
                      {job.title}
                    </h3>
                    <div className="bg-brand-purple/10 text-brand-purple text-xs font-bold px-3 py-1 rounded-full border border-brand-purple/20">
                      {job.type}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4 text-brand-pink" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <DollarSign className="w-4 h-4 text-brand-pink" />
                      {job.salary_range}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 line-clamp-1 max-w-[80%]">
                      {job.description}
                    </p>
                    <ChevronRight className={`w-5 h-5 transition-transform ${selectedJob?.id === job.id ? 'rotate-90 text-brand-pink' : 'text-gray-600 group-hover:translate-x-1'}`} />
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Application Form */}
          <div className="relative">
            <div className="sticky top-24">
              {selectedJob ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-card/50 backdrop-blur-xl border border-dark-border p-8 rounded-3xl"
                >
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Apply for Position</h2>
                  <p className="text-brand-pink font-medium mb-8">{selectedJob.title}</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <User className="w-3 h-3" /> Full Name
                        </label>
                        <input
                          required
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          className="w-full bg-dark-bg/50 border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-pink focus:outline-none transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email Address
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-dark-bg/50 border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-pink focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Phone Number
                        </label>
                        <input
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-dark-bg/50 border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-pink focus:outline-none transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <Upload className="w-3 h-3" /> Resume Link (PDF)
                        </label>
                        <input
                          required
                          type="url"
                          name="resume_url"
                          value={formData.resume_url}
                          onChange={handleInputChange}
                          className="w-full bg-dark-bg/50 border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-pink focus:outline-none transition-colors"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Cover Letter / Why TFX AI?
                      </label>
                      <textarea
                        required
                        name="cover_letter"
                        value={formData.cover_letter}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-dark-bg/50 border border-dark-border rounded-xl px-4 py-3 text-white focus:border-brand-pink focus:outline-none transition-colors resize-none"
                        placeholder="Tell us about your passion for AI..."
                      />
                    </div>

                    <AnimatedButton
                      type="submit"
                      className="w-full py-4 text-lg justify-center group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : (
                        <>
                          Submit Application
                          <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </AnimatedButton>
                  </form>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-dark-border rounded-3xl p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Select a Position</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Click on an open role from the list to view details and start your application.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
