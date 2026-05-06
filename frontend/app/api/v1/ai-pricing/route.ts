import { NextRequest, NextResponse } from 'next/server'

// Gemini AI API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDemoKey' // Replace with actual key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

interface PricingRequest {
  projectType: string
  features: Record<string, any>
  timeline: string
  budgetPreference: string
  customRequirements?: string
}

interface PricingResponse {
  minPrice: number
  maxPrice: number
  breakdown: Array<{
    item: string
    cost: number
    description: string
  }>
  timeline: string
  confidence: number
  reasoning: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PricingRequest = await request.json()
    const { projectType, features, timeline, budgetPreference, customRequirements } = body

    // Validate required fields
    if (!projectType || !features || !timeline) {
      return NextResponse.json(
        { error: 'Project type, features, and timeline are required' },
        { status: 400 }
      )
    }

    console.log('🤖 AI Pricing Request:', { projectType, features, timeline, budgetPreference })

    // Create prompt for Gemini AI
    const prompt = createPricingPrompt(body)

    // Call Gemini AI API
    const aiResponse = await callGeminiAPI(prompt)

    // Parse AI response
    const pricingData = parseAIResponse(aiResponse)

    // Apply budget preference multiplier
    const budgetMultiplier = getBudgetMultiplier(budgetPreference)
    pricingData.minPrice = Math.round(pricingData.minPrice * budgetMultiplier)
    pricingData.maxPrice = Math.round(pricingData.maxPrice * budgetMultiplier)

    // Apply timeline multiplier
    const timelineMultiplier = getTimelineMultiplier(timeline)
    pricingData.minPrice = Math.round(pricingData.minPrice * (1 + timelineMultiplier))
    pricingData.maxPrice = Math.round(pricingData.maxPrice * (1 + timelineMultiplier))

    console.log('🎯 AI Pricing Result:', pricingData)

    return NextResponse.json({
      success: true,
      data: pricingData
    })

  } catch (error) {
    console.error('❌ AI Pricing Error:', error)
    
    // Fallback to static pricing if AI fails
    const fallbackPricing = getFallbackPricing({ projectType: 'website', features: {}, timeline: 'normal', budgetPreference: 'balanced' })
    
    return NextResponse.json({
      success: true,
      data: fallbackPricing,
      fallback: true
    })
  }
}

function createPricingPrompt(request: PricingRequest): string {
  const { projectType, features, timeline, budgetPreference, customRequirements } = request
  
  return `
You are a senior project estimator at TFX AI, a premium web development and AI solutions company. 

Please provide a detailed project estimate in JSON format for the following requirements:

PROJECT DETAILS:
- Project Type: ${projectType}
- Features: ${JSON.stringify(features, null, 2)}
- Timeline: ${timeline}
- Budget Preference: ${budgetPreference}
- Custom Requirements: ${customRequirements || 'None'}

PRICING CONTEXT:
- We are a premium agency with experienced developers
- Base rates: ₹1500-2500 per hour depending on complexity
- Projects include: development, testing, deployment, basic documentation
- Indian market pricing with international quality standards

Please provide a detailed estimate in this exact JSON format:
{
  "minPrice": <minimum price in INR>,
  "maxPrice": <maximum price in INR>,
  "breakdown": [
    {
      "item": "<component name>",
      "cost": <cost in INR>,
      "description": "<brief description>"
    }
  ],
  "timeline": "<estimated delivery time>",
  "confidence": <0.1 to 1.0>,
  "reasoning": "<brief explanation of pricing logic>"
}

Consider:
- Project complexity and technical requirements
- Number of features and their integration complexity
- Development time and team size needed
- Testing and quality assurance
- Project management overhead
- Timeline urgency (if mentioned)

Be realistic but competitive for the Indian market while maintaining quality standards.
`.trim()
}

async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text

  } catch (error) {
    console.error('Gemini API call failed:', error)
    throw error
  }
}

function parseAIResponse(aiResponse: string): PricingResponse {
  try {
    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    return {
      minPrice: parsed.minPrice || 15000,
      maxPrice: parsed.maxPrice || 25000,
      breakdown: parsed.breakdown || [],
      timeline: parsed.timeline || '4-6 weeks',
      confidence: parsed.confidence || 0.8,
      reasoning: parsed.reasoning || 'Based on project complexity and market rates'
    }

  } catch (error) {
    console.error('Failed to parse AI response:', error)
    throw error
  }
}

function getBudgetMultiplier(preference: string): number {
  switch (preference) {
    case 'budget-friendly': return 0.9
    case 'balanced': return 1.0
    case 'premium': return 1.3
    default: return 1.0
  }
}

function getTimelineMultiplier(timeline: string): number {
  switch (timeline) {
    case 'flexible': return 0
    case 'normal': return 0.1
    case 'fast': return 0.25
    case 'urgent': return 0.4
    default: return 0.1
  }
}

function getFallbackPricing(request: PricingRequest): PricingResponse {
  const { projectType, features } = request
  
  const basePrices = {
    website: 15000,
    ecommerce: 35000,
    ai_chatbot: 25000,
    saas: 60000,
    web_mobile: 80000,
    api: 20000,
    uiux: 18000
  }

  let basePrice = basePrices[projectType as keyof typeof basePrices] || 20000
  let additionalCost = 0

  // Simple fallback logic
  if (projectType === 'website') {
    if (features.pages === '4-8') additionalCost += 8000
    else if (features.pages === '9-15') additionalCost += 18000
    else if (features.pages === '15+') additionalCost += 35000
    if (features.cms) additionalCost += 8000
    if (features.blog) additionalCost += 5000
  }

  const minPrice = basePrice + additionalCost
  const maxPrice = minPrice * 1.3

  return {
    minPrice,
    maxPrice,
    breakdown: [
      { item: 'Base Development', cost: basePrice, description: 'Core development work' },
      { item: 'Additional Features', cost: additionalCost, description: 'Extra features and functionality' }
    ],
    timeline: '4-6 weeks',
    confidence: 0.6,
    reasoning: 'Fallback pricing based on standard rates'
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Pricing API is ready',
    status: 'operational'
  })
}
