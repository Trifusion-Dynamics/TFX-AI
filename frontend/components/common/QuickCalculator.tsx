'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { Calculator, Globe, Bot, BarChart3, Smartphone, Link, Palette, ArrowRight } from 'lucide-react'

const quickProjectTypes = [
  { id: 'website', name: 'Website', icon: Globe, basePrice: 15000 },
  { id: 'ai_chatbot', name: 'AI Chatbot', icon: Bot, basePrice: 25000 },
  { id: 'saas', name: 'SaaS App', icon: BarChart3, basePrice: 60000 },
  { id: 'web_mobile', name: 'Web + Mobile', icon: Smartphone, basePrice: 80000 },
  { id: 'api', name: 'API Development', icon: Link, basePrice: 20000 },
  { id: 'uiux', name: 'UI/UX Design', icon: Palette, basePrice: 18000 }
]

interface QuickCalculatorProps {
  className?: string
}

export default function QuickCalculator({ className = '' }: QuickCalculatorProps) {
  const [selectedType, setSelectedType] = useState('')
  const [complexity, setComplexity] = useState<'basic' | 'standard' | 'advanced'>('standard')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [isCalculating, setIsCalculating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && selectedType) {
      calculateQuickPrice()
    }
  }, [selectedType, complexity, isMounted])

  const calculateQuickPrice = async () => {
    setIsCalculating(true)
    
    try {
      const baseProject = quickProjectTypes.find(p => p.id === selectedType)
      if (!baseProject) return

      // Quick calculation without AI for instant preview
      let multiplier = 1
      
      switch (complexity) {
        case 'basic':
          multiplier = 0.8
          break
        case 'standard':
          multiplier = 1.0
          break
        case 'advanced':
          multiplier = 1.5
          break
      }

      const basePrice = baseProject.basePrice * multiplier
      const min = Math.round(basePrice * 0.9)
      const max = Math.round(basePrice * 1.3)

      setPriceRange({ min, max })

      // Optional: Get AI-powered estimate in background
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/v1/ai-pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectType: selectedType,
            features: { complexity },
            timeline: 'normal',
            budgetPreference: 'balanced'
          })
        }).then(response => response.json())
          .then(result => {
            if (result.success && !result.fallback) {
              setPriceRange({ min: result.data.minPrice, max: result.data.maxPrice })
            }
          })
          .catch(console.error)
      }
    } catch (error) {
      console.error('Quick calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <GlassCard className={`p-6 bg-gradient-brand/5 border-brand-pink/20 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-brand-pink" />
        <h3 className="text-xl font-display font-bold text-white">Quick Cost Estimate</h3>
      </div>

      {/* Project Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">Select Project Type</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickProjectTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id
            
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  isSelected 
                    ? 'border-brand-pink bg-brand-pink/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <Icon className="w-5 h-5 text-brand-pink mx-auto mb-1" />
                <div className="text-xs text-white font-medium">{type.name}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Complexity Selection */}
      {selectedType && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Project Complexity</label>
          <div className="flex gap-2">
            {[
              { id: 'basic', name: 'Basic', desc: 'Simple features' },
              { id: 'standard', name: 'Standard', desc: 'Moderate complexity' },
              { id: 'advanced', name: 'Advanced', desc: 'Complex features' }
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setComplexity(level.id as any)}
                className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                  complexity === level.id 
                    ? 'border-brand-pink bg-brand-pink/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-sm text-white font-medium">{level.name}</div>
                <div className="text-xs text-gray-400">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Display */}
      {priceRange.min > 0 && (
        <div className="mb-6">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Estimated Cost</div>
            <div className={`text-2xl font-display font-bold bg-gradient-brand bg-clip-text text-transparent ${
              isCalculating ? 'animate-pulse' : ''
            }`}>
              {isCalculating ? 'Calculating...' : `₹${priceRange.min.toLocaleString()} - ₹${priceRange.max.toLocaleString()}`}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ≈ ${(Math.round(priceRange.min / 84)).toLocaleString()} - ${(Math.round(priceRange.max / 84)).toLocaleString()} USD
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <AnimatedButton 
        href="/pricing/calculator" 
        variant="primary"
        className="w-full"
        disabled={!selectedType}
      >
        Get Detailed Estimate
        <ArrowRight className="w-4 h-4 ml-2" />
      </AnimatedButton>

      <div className="text-center mt-3">
        <p className="text-xs text-gray-500">
          AI-powered accurate pricing • 2-minute estimate
        </p>
      </div>
    </GlassCard>
  )
}
