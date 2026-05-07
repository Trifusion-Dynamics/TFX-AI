'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { CalendlyButton } from '@/components/common/CalendlyButton'
import { ArrowLeft, ArrowRight, Calculator, Globe, ShoppingBag, Bot, BarChart3, Smartphone, Link, Palette, Clock, DollarSign, User, Mail, Phone, MessageSquare, Check, ChevronRight } from 'lucide-react'

interface CalculatorData {
  projectType: string
  features: Record<string, any>
  timeline: string
  budgetPreference: string
  userDetails: {
    name: string
    email: string
    phone: string
    description: string
    source: string
  }
}

const basePrices = {
  website: 15000,
  ecommerce: 35000,
  ai_chatbot: 25000,
  saas: 60000,
  web_mobile: 80000,
  api: 20000,
  uiux: 18000
}

const projectTypes = [
  { id: 'website', name: 'Website / Landing Page', icon: Globe, description: 'Professional websites and landing pages' },
  { id: 'ecommerce', name: 'E-commerce Store', icon: ShoppingBag, description: 'Online stores with payment integration' },
  { id: 'ai_chatbot', name: 'AI Chatbot / Assistant', icon: Bot, description: 'Intelligent conversational AI solutions' },
  { id: 'saas', name: 'SaaS Web Application', icon: BarChart3, description: 'Software as a Service platforms' },
  { id: 'web_mobile', name: 'Web + Mobile App', icon: Smartphone, description: 'Complete web and mobile solutions' },
  { id: 'api', name: 'API Development', icon: Link, description: 'RESTful APIs and backend services' },
  { id: 'uiux', name: 'UI/UX Design Only', icon: Palette, description: 'Design and prototyping services' }
]

const timelineOptions = [
  { id: 'flexible', name: 'Flexible (2-3 months)', multiplier: 0, weeks: '8-12' },
  { id: 'normal', name: 'Normal (4-6 weeks)', multiplier: 0.1, weeks: '4-6' },
  { id: 'fast', name: 'Fast (2-3 weeks)', multiplier: 0.25, weeks: '2-3' },
  { id: 'urgent', name: 'Urgent (< 2 weeks)', multiplier: 0.4, weeks: '1-2' }
]

const budgetPreferences = [
  { id: 'budget-friendly', name: 'Budget-friendly', multiplier: 0.9 },
  { id: 'balanced', name: 'Balanced', multiplier: 1.0 },
  { id: 'premium', name: 'Premium quality', multiplier: 1.3 }
]

const sources = ['Google', 'LinkedIn', 'GitHub', 'Referral', 'Other']

export default function CalculatorClient() {
  const [currentStep, setCurrentStep] = useState(1)
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    projectType: '',
    features: {},
    timeline: '',
    budgetPreference: 'balanced',
    userDetails: {
      name: '',
      email: '',
      phone: '',
      description: '',
      source: ''
    }
  })
  const [showResults, setShowResults] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [pricingBreakdown, setPricingBreakdown] = useState<any[]>([])
  const [timeline, setTimeline] = useState('4-6 weeks')
  const [livePrice, setLivePrice] = useState({ min: 0, max: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const saved = sessionStorage.getItem('calculatorData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCalculatorData(data)
      } catch (error) {
        console.error('Failed to parse saved calculator data:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      try {
        sessionStorage.setItem('calculatorData', JSON.stringify(calculatorData))
      } catch (error) {
        console.error('Failed to save calculator data:', error)
      }
    }
  }, [calculatorData, isMounted])

  // Live price preview
  useEffect(() => {
    if (isMounted && calculatorData.projectType && Object.keys(calculatorData.features).length > 0) {
      calculateLivePrice()
    } else {
      setLivePrice({ min: 0, max: 0 })
    }
  }, [calculatorData.projectType, calculatorData.features, calculatorData.timeline, calculatorData.budgetPreference, isMounted])

  const calculateLivePrice = () => {
    let basePrice = basePrices[calculatorData.projectType as keyof typeof basePrices] || 0
    let additionalCost = 0

    // Dynamic pricing based on current selection
    if (calculatorData.projectType === 'website') {
      const pages = calculatorData.features.customPages || 
                   (calculatorData.features.pages === '1-3' ? 2 : 
                    calculatorData.features.pages === '4-8' ? 6 : 
                    calculatorData.features.pages === '9-15' ? 12 : 
                    calculatorData.features.pages === '15+' ? 20 : 0)
      
      if (pages > 0) {
        additionalCost += Math.max(0, (pages - 3) * 2000) // ₹2000 per additional page after 3
      }
      
      if (calculatorData.features.cms) additionalCost += 8000
      if (calculatorData.features.blog) additionalCost += 5000
      if (calculatorData.features.contactForms) additionalCost += 3000
      if (calculatorData.features.animations) additionalCost += 10000
    }

    if (calculatorData.projectType === 'ai_chatbot') {
      if (calculatorData.features.aiModel === 'llm') additionalCost += 15000
      else if (calculatorData.features.aiModel === 'custom') additionalCost += 30000
      
      if (calculatorData.features.platform === 'whatsapp' || calculatorData.features.platform === 'both') {
        additionalCost += 8000
      }
      if (calculatorData.features.integration) additionalCost += 10000
    }

    if (calculatorData.projectType === 'saas') {
      const userRoles = calculatorData.features.userRoles === '1' ? 1 : 
                       calculatorData.features.userRoles === '2-3' ? 2.5 : 
                       calculatorData.features.userRoles === '4+' ? 4 : 1
      
      additionalCost += Math.max(0, (userRoles - 1) * 5000)
      
      if (calculatorData.features.payment) additionalCost += 12000
      if (calculatorData.features.adminPanel) additionalCost += 20000
      if (calculatorData.features.aiFeatures) additionalCost += 25000
      if (calculatorData.features.pwa) additionalCost += 15000
    }

    const subtotal = basePrice + additionalCost
    const timelineMultiplier = timelineOptions.find(t => t.id === calculatorData.timeline)?.multiplier || 0
    const budgetMultiplier = budgetPreferences.find(b => b.id === calculatorData.budgetPreference)?.multiplier || 1.0
    
    const total = subtotal * (1 + timelineMultiplier) * budgetMultiplier
    
    setLivePrice({
      min: Math.round(total * 0.9),
      max: Math.round(total * 1.1)
    })
  }

  const calculatePrice = async () => {
    setIsCalculating(true)
    try {
      // Use AI-powered pricing
      const response = await fetch('/api/v1/ai-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectType: calculatorData.projectType,
          features: calculatorData.features,
          timeline: calculatorData.timeline,
          budgetPreference: calculatorData.budgetPreference,
          customRequirements: calculatorData.userDetails.description
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setPriceRange({
          min: result.data.minPrice,
          max: result.data.maxPrice
        })
        
        // Store breakdown for results page
        setPricingBreakdown(result.data.breakdown || [])
        setTimeline(result.data.timeline || '4-6 weeks')
        
        if (result.fallback) {
          console.log('⚠️ Using fallback pricing due to AI unavailability')
        }
      } else {
        throw new Error(result.error || 'Pricing calculation failed')
      }
    } catch (error) {
      console.error('Pricing calculation error:', error)
      // Fallback to static calculation
      calculateStaticPrice()
    } finally {
      setIsCalculating(false)
    }
  }

  const calculateStaticPrice = () => {
    let basePrice = basePrices[calculatorData.projectType as keyof typeof basePrices] || 0
    let additionalCost = 0

    // Add feature costs
    if (calculatorData.projectType === 'website') {
      if (calculatorData.features.pages === '4-8') additionalCost += 8000
      else if (calculatorData.features.pages === '9-15') additionalCost += 18000
      else if (calculatorData.features.pages === '15+') additionalCost += 35000
      
      if (calculatorData.features.cms) additionalCost += 8000
      if (calculatorData.features.blog) additionalCost += 5000
      if (calculatorData.features.contactForms) additionalCost += 3000
      if (calculatorData.features.animations) additionalCost += 10000
    }

    if (calculatorData.projectType === 'ai_chatbot') {
      if (calculatorData.features.aiModel === 'llm') additionalCost += 15000
      else if (calculatorData.features.aiModel === 'custom') additionalCost += 30000
      
      if (calculatorData.features.platform === 'whatsapp' || calculatorData.features.platform === 'both') {
        additionalCost += 8000
      }
      if (calculatorData.features.integration) additionalCost += 10000
    }

    if (calculatorData.projectType === 'saas') {
      if (calculatorData.features.userRoles === '2-3') additionalCost += 8000
      else if (calculatorData.features.userRoles === '4+') additionalCost += 15000
      
      if (calculatorData.features.payment) additionalCost += 12000
      if (calculatorData.features.adminPanel) additionalCost += 20000
      if (calculatorData.features.aiFeatures) additionalCost += 25000
      if (calculatorData.features.pwa) additionalCost += 15000
    }

    const subtotal = basePrice + additionalCost
    const timelineMultiplier = timelineOptions.find(t => t.id === calculatorData.timeline)?.multiplier || 0
    const budgetMultiplier = budgetPreferences.find(b => b.id === calculatorData.budgetPreference)?.multiplier || 1.0
    
    const total = subtotal * (1 + timelineMultiplier) * budgetMultiplier
    
    setPriceRange({
      min: Math.round(total * 0.9),
      max: Math.round(total * 1.1)
    })
  }

  const handleSubmitLead = async () => {
    if (!calculatorData.userDetails.name || !calculatorData.userDetails.email) return

    try {
      const leadData = {
        name: calculatorData.userDetails.name,
        email: calculatorData.userDetails.email,
        phone: calculatorData.userDetails.phone || '',
        subject: `Calculator Lead - ${projectTypes.find(p => p.id === calculatorData.projectType)?.name}`,
        message: `Project Type: ${calculatorData.projectType}, Features: ${JSON.stringify(calculatorData.features)}, Timeline: ${calculatorData.timeline}, Budget Range: ₹${priceRange.min.toLocaleString()} - ₹${priceRange.max.toLocaleString()}, Source: calculator`
      }

      await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })
    } catch (error) {
      console.error('Failed to submit lead:', error)
    }
  }

  const handleNext = () => {
    if (currentStep === 4) {
      calculatePrice()
      setShowResults(true)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (showResults) {
      setShowResults(false)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setShowResults(false)
    setCalculatorData({
      projectType: '',
      features: {},
      timeline: '',
      budgetPreference: 'balanced',
      userDetails: {
        name: '',
        email: '',
        phone: '',
        description: '',
        source: ''
      }
    })
  }

  const sendWhatsAppMessage = () => {
    const message = `Hi, I got an estimate of ₹${priceRange.min.toLocaleString()} - ₹${priceRange.max.toLocaleString()} for my ${projectTypes.find(p => p.id === calculatorData.projectType)?.name} project on your calculator.`
    window.open(`https://wa.me/919129939972?text=${encodeURIComponent(message)}`, '_blank')
  }

  const sendEstimateEmail = async () => {
    setIsSubmitting(true)
    try {
      await handleSubmitLead()
      alert('Estimate sent to your email successfully!')
    } catch (error) {
      alert('Failed to send estimate. Please try again.')
    }
    setIsSubmitting(false)
  }

  // Show loading state until component is mounted
if (!isMounted) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading Calculator...</p>
      </div>
    </div>
  )
}

if (showResults) {
    return (
      <>
        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Calculator
        </button>

        <GlassCard className="p-12 bg-gradient-brand/10 border-brand-pink/30">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">Your Project Estimate</h1>
            <p className="text-gray-400">This is an estimate. Final quote after consultation.</p>
          </div>

          <div className="text-center mb-12">
            <div className="text-6xl font-display font-bold bg-gradient-brand bg-clip-text text-transparent mb-2">
              ₹{priceRange.min.toLocaleString()} – ₹{priceRange.max.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">
              Approximately ${(Math.round(priceRange.min / 84)).toLocaleString()} – ${(Math.round(priceRange.max / 84)).toLocaleString()} USD
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-4">Project Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Project Type:</span>
                  <span className="text-white">{projectTypes.find(p => p.id === calculatorData.projectType)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Timeline:</span>
                  <span className="text-white">{timelineOptions.find(t => t.id === calculatorData.timeline)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Delivery:</span>
                  <span className="text-white">{timelineOptions.find(t => t.id === calculatorData.timeline)?.weeks} weeks</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-white mb-4">What&apos;s Included</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                  <span className="text-gray-300">Professional development team</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                  <span className="text-gray-300">Quality assurance & testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                  <span className="text-gray-300">Deployment & setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                  <span className="text-gray-300">Basic documentation</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <AnimatedButton 
              onClick={sendWhatsAppMessage}
              variant="primary" 
              className="flex-1 bg-green-600 shadow-green-600/20"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp Us This Estimate
            </AnimatedButton>
            <AnimatedButton 
              onClick={sendEstimateEmail}
              variant="outline" 
              className="flex-1"
              disabled={isSubmitting}
            >
              <Mail className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Me This Estimate'}
            </AnimatedButton>
            <CalendlyButton 
              text=" Book Free Consultation"
              variant="outline" 
              className="flex-1"
              prefillName={calculatorData.userDetails.name}
              prefillEmail={calculatorData.userDetails.email}
            />
          </div>

          <div className="text-center">
            <button onClick={handleStartOver} className="text-gray-400 hover:text-white transition-colors text-sm">
              Start Over
            </button>
          </div>
        </GlassCard>
      </>
    )
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">Step {currentStep} of 4</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-brand-pink' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-brand h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Live Price Preview */}
      {livePrice.min > 0 && currentStep >= 2 && (
        <GlassCard className="p-4 mb-6 bg-gradient-brand/10 border-brand-pink/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Live Estimate</div>
              <div className="text-2xl font-display font-bold bg-gradient-brand bg-clip-text text-transparent">
                ₹{livePrice.min.toLocaleString()} - ₹{livePrice.max.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                ≈ ${(Math.round(livePrice.min / 84)).toLocaleString()} - ${(Math.round(livePrice.max / 84)).toLocaleString()} USD
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">AI-powered</div>
              <div className="text-xs text-brand-pink">Real-time calculation</div>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard className="p-8">
        {currentStep === 1 && <Step1 data={calculatorData} setData={setCalculatorData} />}
        {currentStep === 2 && <Step2 data={calculatorData} setData={setCalculatorData} />}
        {currentStep === 3 && <Step3 data={calculatorData} setData={setCalculatorData} />}
        {currentStep === 4 && <Step4 data={calculatorData} setData={setCalculatorData} onLeadSubmit={handleSubmitLead} />}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={(currentStep === 1 && !calculatorData.projectType) || 
                     (currentStep === 4 && (!calculatorData.userDetails.name || !calculatorData.userDetails.email))}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-brand text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 4 ? 'Get Estimate' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </>
  )
}

function Step1({ data, setData }: { data: CalculatorData, setData: (data: CalculatorData) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">What type of project do you need?</h2>
      <p className="text-gray-400 mb-8">Select the category that best describes your project</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectTypes.map((type) => {
          const Icon = type.icon
          const isSelected = data.projectType === type.id
          
          return (
            <button
              key={type.id}
              onClick={() => setData({ ...data, projectType: type.id })}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected 
                  ? 'border-brand-pink bg-brand-pink/10 shadow-lg shadow-brand-pink/20' 
                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-8 h-8 text-brand-pink mb-3" />
              <h3 className="text-lg font-display font-bold text-white mb-2">{type.name}</h3>
              <p className="text-gray-400 text-sm">{type.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step2({ data, setData }: { data: CalculatorData, setData: (data: CalculatorData) => void }) {
  const renderWebsiteFeatures = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-white font-medium mb-3">Number of pages</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {['1-3', '4-8', '9-15', '15+'].map((option) => (
            <button
              key={option}
              onClick={() => setData({ ...data, features: { ...data.features, pages: option, customPages: undefined } })}
              className={`p-3 rounded-lg border-2 transition-all ${
                data.features.pages === option && !data.features.customPages
                  ? 'border-brand-pink bg-brand-pink/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Or custom number:</span>
          <input
            type="number"
            min="1"
            max="100"
            value={data.features.customPages || ''}
            onChange={(e) => {
              const value = e.target.value
              setData({ 
                ...data, 
                features: { 
                  ...data.features, 
                  customPages: value ? parseInt(value) : undefined,
                  pages: value ? undefined : data.features.pages
                } 
              })
            }}
            className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-brand-pink focus:outline-none"
            placeholder="20"
          />
          <span className="text-xs text-gray-500">pages</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'cms', label: 'CMS needed' },
          { key: 'blog', label: 'Blog section' },
          { key: 'contactForms', label: 'Contact forms' },
          { key: 'animations', label: 'Advanced animations' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setData({ ...data, features: { ...data.features, [key]: !data.features[key] } })}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              data.features[key] 
                ? 'border-brand-pink bg-brand-pink/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{label}</span>
              {data.features[key] && <Check className="w-5 h-5 text-brand-pink" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderAIChatbotFeatures = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-white font-medium mb-3">Platform</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'website', label: 'Website' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'both', label: 'Both' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setData({ ...data, features: { ...data.features, platform: option.id } })}
              className={`p-3 rounded-lg border-2 transition-all ${
                data.features.platform === option.id 
                  ? 'border-brand-pink bg-brand-pink/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-3">AI Model</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'basic', label: 'Basic (rule-based)' },
            { id: 'llm', label: 'Smart (LLM)' },
            { id: 'custom', label: 'Custom trained' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setData({ ...data, features: { ...data.features, aiModel: option.id } })}
              className={`p-3 rounded-lg border-2 transition-all ${
                data.features.aiModel === option.id 
                  ? 'border-brand-pink bg-brand-pink/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-3">Languages</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'english', label: 'English only' },
            { id: 'hindi-english', label: 'Hindi + English' },
            { id: 'multilingual', label: 'Multilingual' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setData({ ...data, features: { ...data.features, languages: option.id } })}
              className={`p-3 rounded-lg border-2 transition-all ${
                data.features.languages === option.id 
                  ? 'border-brand-pink bg-brand-pink/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setData({ ...data, features: { ...data.features, integration: !data.features.integration } })}
        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
          data.features.integration 
            ? 'border-brand-pink bg-brand-pink/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-white">Integration with existing system</span>
          {data.features.integration && <Check className="w-5 h-5 text-brand-pink" />}
        </div>
      </button>
    </div>
  )

  const renderSaaSFeatures = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-white font-medium mb-3">User Roles</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: '1', label: '1' },
            { id: '2-3', label: '2-3' },
            { id: '4+', label: '4+' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setData({ ...data, features: { ...data.features, userRoles: option.id } })}
              className={`p-3 rounded-lg border-2 transition-all ${
                data.features.userRoles === option.id 
                  ? 'border-brand-pink bg-brand-pink/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'payment', label: 'Payment integration' },
          { key: 'adminPanel', label: 'Admin panel' },
          { key: 'aiFeatures', label: 'AI features' },
          { key: 'pwa', label: 'PWA support' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setData({ ...data, features: { ...data.features, [key]: !data.features[key] } })}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              data.features[key] 
                ? 'border-brand-pink bg-brand-pink/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{label}</span>
              {data.features[key] && <Check className="w-5 h-5 text-brand-pink" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">Features & Complexity</h2>
      <p className="text-gray-400 mb-8">Customize your project requirements</p>
      
      {data.projectType === 'website' && renderWebsiteFeatures()}
      {data.projectType === 'ai_chatbot' && renderAIChatbotFeatures()}
      {data.projectType === 'saas' && renderSaaSFeatures()}
      
      {!['website', 'ai_chatbot', 'saas'].includes(data.projectType) && (
        <div className="text-center py-12">
          <p className="text-gray-400">Feature options will be available based on your project type selection</p>
        </div>
      )}
    </div>
  )
}

function Step3({ data, setData }: { data: CalculatorData, setData: (data: CalculatorData) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">Timeline & Priority</h2>
      <p className="text-gray-400 mb-8">Select your preferred timeline and budget preference</p>
      
      <div className="space-y-8">
        <div>
          <label className="block text-white font-medium mb-4">Project Timeline</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timelineOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setData({ ...data, timeline: option.id })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  data.timeline === option.id 
                    ? 'border-brand-pink bg-brand-pink/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{option.name}</span>
                  {option.multiplier > 0 && (
                    <span className="text-brand-pink text-sm">+{Math.round(option.multiplier * 100)}%</span>
                  )}
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-4">Budget Preference</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {budgetPreferences.map((option) => (
              <button
                key={option.id}
                onClick={() => setData({ ...data, budgetPreference: option.id })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  data.budgetPreference === option.id 
                    ? 'border-brand-pink bg-brand-pink/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{option.name}</span>
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step4({ data, setData, onLeadSubmit }: { data: CalculatorData, setData: (data: CalculatorData) => void, onLeadSubmit: () => void }) {
  const handleEmailBlur = () => {
    if (data.userDetails.email && data.userDetails.name) {
      onLeadSubmit()
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">Your Details</h2>
      <p className="text-gray-400 mb-8">Tell us about yourself to get your estimate</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={data.userDetails.name}
                onChange={(e) => setData({ ...data, userDetails: { ...data.userDetails, name: e.target.value } })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-brand-pink focus:outline-none"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={data.userDetails.email}
                onChange={(e) => setData({ ...data, userDetails: { ...data.userDetails, email: e.target.value } })}
                onBlur={handleEmailBlur}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-brand-pink focus:outline-none"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Phone (optional)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={data.userDetails.phone}
              onChange={(e) => setData({ ...data, userDetails: { ...data.userDetails, phone: e.target.value } })}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-brand-pink focus:outline-none"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Project Description (optional)</label>
          <textarea
            value={data.userDetails.description}
            onChange={(e) => setData({ ...data, userDetails: { ...data.userDetails, description: e.target.value } })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-brand-pink focus:outline-none resize-none"
            rows={4}
            placeholder="Tell us more about your project requirements..."
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">How did you find us?</label>
          <select
            value={data.userDetails.source}
            onChange={(e) => setData({ ...data, userDetails: { ...data.userDetails, source: e.target.value } })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-brand-pink focus:outline-none"
          >
            <option value="">Select an option</option>
            {sources.map((source) => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
