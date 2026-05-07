'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Clock, HardDrive } from 'lucide-react'
import { Resource } from '@/types'
import { GlassCard } from '@/components/common/GlassCard'

interface ResourceCardProps {
  resource: Resource
  onDownload: (resource: Resource) => void
  isDownloaded?: boolean
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onDownload, 
  isDownloaded = false 
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI':
        return 'bg-brand-purple/20 text-brand-purple border-brand-purple/30'
      case 'SaaS':
        return 'bg-brand-orange/20 text-brand-orange border-brand-orange/30'
      case 'Performance':
        return 'bg-brand-red/20 text-brand-red border-brand-red/30'
      case 'Design':
        return 'bg-brand-pink/20 text-brand-pink border-brand-pink/30'
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    }
  }

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'AI':
        return 'from-brand-purple to-brand-purple/60'
      case 'SaaS':
        return 'from-brand-orange to-brand-orange/60'
      case 'Performance':
        return 'from-brand-red to-brand-red/60'
      case 'Design':
        return 'from-brand-pink to-brand-pink/60'
      default:
        return 'from-gray-500 to-gray-500/60'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <GlassCard className="p-6 h-full border-white/5 hover:border-brand-purple/20 transition-all duration-300 group">
        {/* Header with category badge and thumbnail */}
        <div className="flex items-start justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </div>
          
          {/* Thumbnail area */}
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getCategoryGradient(resource.category)} flex items-center justify-center relative overflow-hidden`}>
            <FileText size={24} className="text-white" />
            <div className="absolute top-1 right-1 bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs text-white font-medium">
              PDF
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-brand-purple transition-colors">
            {resource.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-3 mb-3">
            {resource.description}
          </p>
        </div>

        {/* Meta information */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FileText size={12} />
            <span>{resource.pages} pages</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive size={12} />
            <span>{resource.size}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>Instant</span>
          </div>
        </div>

        {/* What you'll learn */}
        {resource.bullets && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">What you'll learn:</div>
            <ul className="space-y-1">
              {resource.bullets.slice(0, 3).map((bullet, index) => (
                <li key={index} className="text-xs text-gray-400 flex items-start gap-1">
                  <span className="text-brand-purple mt-0.5">•</span>
                  <span className="line-clamp-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Download button */}
        <div className="space-y-2">
          <button
            onClick={() => onDownload(resource)}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              isDownloaded 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90 shadow-lg hover:shadow-xl'
            }`}
          >
            {isDownloaded ? (
              <>
                <Download size={16} />
                Download Again →
              </>
            ) : (
              <>
                <Download size={16} />
                Download Free →
              </>
            )}
          </button>
          
          {isDownloaded && (
            <div className="text-xs text-gray-500 text-center">
              Delivered to your email earlier
            </div>
          )}
          
          {!isDownloaded && (
            <div className="text-xs text-gray-500 text-center">
              Enter email to get instant access
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default ResourceCard
