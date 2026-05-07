'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { Resource } from '@/types'

interface InlineResourceWidgetProps {
  resourceId: string
  title: string
  description: string
  variant?: 'banner' | 'card' | 'sidebar'
  onDownload: (resourceId: string) => void
  isDownloaded?: boolean
}

const InlineResourceWidget: React.FC<InlineResourceWidgetProps> = ({
  resourceId,
  title,
  description,
  variant = 'card',
  onDownload,
  isDownloaded = false
}) => {
  const baseContent = () => (
    <>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center flex-shrink-0">
          <FileText size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white mb-1">{title}</div>
          <div className="text-xs text-gray-400 line-clamp-2">{description}</div>
        </div>
      </div>
    </>
  )

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <GlassCard className="p-4 border-brand-purple/20">
          <div className="flex items-center justify-between">
            {baseContent()}
            <button
              onClick={() => onDownload(resourceId)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isDownloaded
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90'
              }`}
            >
              {isDownloaded ? (
                <>
                  <Download size={14} />
                  Downloaded
                </>
              ) : (
                <>
                  <Download size={14} />
                  Download Free →
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full"
      >
        <GlassCard className="p-4 border-brand-purple/20">
          <div className="mb-3">
            <div className="text-xs font-semibold text-brand-purple mb-2">📥 Free Download</div>
            <div className="text-sm font-bold text-white mb-1">{title}</div>
            <div className="text-xs text-gray-400 mb-3">{description}</div>
          </div>
          <button
            onClick={() => onDownload(resourceId)}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              isDownloaded
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90'
            }`}
          >
            {isDownloaded ? (
              <>
                <Download size={14} />
                Download Again →
              </>
            ) : (
              <>
                <Download size={14} />
                Download Free →
              </>
            )}
          </button>
        </GlassCard>
      </motion.div>
    )
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="w-full"
    >
      <GlassCard className="p-4 border-white/5 hover:border-brand-purple/20 transition-all duration-300">
        {baseContent()}
        <div className="mt-3">
          <button
            onClick={() => onDownload(resourceId)}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              isDownloaded
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90'
            }`}
          >
            {isDownloaded ? (
              <>
                <Download size={14} />
                Downloaded
              </>
            ) : (
              <>
                <Download size={14} />
                Download Free →
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Pre-configured widgets for specific resources
export const AIIntegrationWidget: React.FC<{ onDownload: (resourceId: string) => void; isDownloaded?: boolean }> = ({ 
  onDownload, 
  isDownloaded 
}) => (
  <InlineResourceWidget
    resourceId="ai-integration-checklist"
    title="AI Integration Checklist"
    description="50-point checklist to add AI to your product"
    variant="sidebar"
    onDownload={onDownload}
    isDownloaded={isDownloaded}
  />
)

export const SaaSRoadmapWidget: React.FC<{ onDownload: (resourceId: string) => void; isDownloaded?: boolean }> = ({ 
  onDownload, 
  isDownloaded 
}) => (
  <InlineResourceWidget
    resourceId="saas-development-roadmap"
    title="Free SaaS Roadmap"
    description="From idea to ₹1 Lakh MRR complete playbook"
    variant="card"
    onDownload={onDownload}
    isDownloaded={isDownloaded}
  />
)

export const PerformanceGuideWidget: React.FC<{ onDownload: (resourceId: string) => void; isDownloaded?: boolean }> = ({ 
  onDownload, 
  isDownloaded 
}) => (
  <InlineResourceWidget
    resourceId="web-performance-guide"
    title="Performance Guide"
    description="Make your website load in under 2 seconds"
    variant="banner"
    onDownload={onDownload}
    isDownloaded={isDownloaded}
  />
)

export default InlineResourceWidget
