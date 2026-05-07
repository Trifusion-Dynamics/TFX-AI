'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import ResourceCard from '@/components/resources/ResourceCard'
import DownloadGateModal from '@/components/resources/DownloadGateModal'
import { resourcesApi } from '@/lib/api/resources.api'
import { Resource } from '@/types'
import toast from 'react-hot-toast'

export default function FreeResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [downloadedResources, setDownloadedResources] = useState<string[]>([])

  useEffect(() => {
    // Load downloaded resources from localStorage
    const downloaded = JSON.parse(localStorage.getItem('tfxai_downloaded_resources') || '[]')
    setDownloadedResources(downloaded)

    // Fetch resources
    const fetchResources = async () => {
      try {
        const response = await resourcesApi.getList()
        setResources(response.data)
      } catch (error) {
        console.error('Failed to fetch resources:', error)
        toast.error('Failed to load resources')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const handleDownload = (resource: Resource) => {
    setSelectedResource(resource)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedResource(null)
  }

  const handleDownloadSuccess = (resourceId: string) => {
    if (!downloadedResources.includes(resourceId)) {
      setDownloadedResources(prev => [...prev, resourceId])
    }
  }

  return (
    <div className="flex-1 pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 border border-brand-purple/30 text-brand-purple font-semibold text-sm mb-4">
              🎁 100% Free Resources
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Free <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">Resources</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Download our expert guides and checklists. No spam, just value. Used by 500+ developers & founders.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                <span className="text-brand-purple font-bold text-sm">3</span>
              </div>
              <span className="font-medium">Free Resources</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-brand-pink/20 flex items-center justify-center">
                <span className="text-brand-pink font-bold text-sm">PDF</span>
              </div>
              <span className="font-medium">PDF Format</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                <span className="text-brand-orange font-bold text-sm">⚡</span>
              </div>
              <span className="font-medium">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">✓</span>
              </div>
              <span className="font-medium">No Credit Card</span>
            </div>
          </motion.div>
        </div>

        {/* Resources Grid */}
        <div className="mb-16">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ResourceCard
                    resource={resource}
                    onDownload={handleDownload}
                    isDownloaded={downloadedResources.includes(resource.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Social Proof Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-16"
        >
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-900"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 ml-3">+500 more</span>
            </div>
            <p className="text-lg text-gray-300 mb-2">
              Join <span className="text-brand-purple font-semibold">500+ founders and developers</span> who've downloaded our resources
            </p>
            <p className="text-sm text-gray-500">
              Get the same insights that helped companies launch successful products
            </p>
          </GlassCard>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-8 text-center max-w-2xl mx-auto border-brand-purple/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want all future resources automatically?
            </h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter and get new resources delivered to your inbox the moment they're released.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const email = formData.get('email') as string
                // Handle newsletter subscription
                toast.success('Thanks for subscribing!')
                e.currentTarget.reset()
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
              />
              <AnimatedButton
                type="submit"
                className="bg-gradient-brand text-white px-6 py-3 rounded-lg"
              >
                Subscribe
              </AnimatedButton>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              🔒 We respect your privacy. Unsubscribe with one click.
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Download Gate Modal */}
      {selectedResource && (
        <DownloadGateModal
          resource={selectedResource}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
