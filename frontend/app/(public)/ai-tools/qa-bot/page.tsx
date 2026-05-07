'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { MessageSquare, Send, Bot, User, ArrowLeft, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp: Date
  confidence?: 'High' | 'Medium' | 'Low'
  helpful?: boolean
}

export default function QABotPage() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'bot', 
      text: '👋 Hello! I\'m the TFX AI Assistant. I can help you with information about our services, pricing, technology stack, and more. What would you like to know?', 
      timestamp: new Date(),
      confidence: 'High'
    }
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAsk = async (q?: string) => {
    const finalQ = q || question
    if (!finalQ.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: finalQ,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1500))
      const response = generateResponse(finalQ)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response.text,
        timestamp: new Date(),
        confidence: response.confidence
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      toast.error('Bot is currently unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase()
    
    // Service-related queries
    if (lowerQuery.includes('service') || lowerQuery.includes('what do you do')) {
      return {
        text: 'TFX AI offers comprehensive digital services including:\n\n🚀 **AI Development** - Custom AI solutions, chatbots, and automation\n🌐 **Web Development** - High-performance websites and web applications\n📱 **Mobile Apps** - iOS and Android app development\n☁️ **Cloud Solutions** - Scalable infrastructure and DevOps\n🎨 **UI/UX Design** - Beautiful, user-centered design\n\nAll our solutions are built with cutting-edge technology and tailored to your specific needs. Would you like to know more about any particular service?',
        confidence: 'High' as const
      }
    }
    
    // Pricing queries
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('how much')) {
      return {
        text: 'Our pricing is flexible and depends on your specific requirements:\n\n💡 **Custom Projects** - Starting from ₹50,000\n🤖 **AI Solutions** - Starting from ₹75,000\n📱 **Mobile Apps** - Starting from ₹1,00,000\n☁️ **Cloud Services** - Starting from ₹25,000/month\n\nWe also offer:\n• Fixed-price projects for well-defined scopes\n• Hourly consulting at ₹2,500/hour\n• Monthly retainers for ongoing support\n\nWould you like a detailed quote for your specific project?',
        confidence: 'High' as const
      }
    }
    
    // Technology queries
    if (lowerQuery.includes('technology') || lowerQuery.includes('tech stack') || lowerQuery.includes('what technology')) {
      return {
        text: 'We work with modern, cutting-edge technologies:\n\n**Frontend:** React, Next.js, TypeScript, Tailwind CSS\n**Backend:** Node.js, Python, FastAPI, PostgreSQL\n**AI/ML:** TensorFlow, PyTorch, OpenAI APIs, Gemini\n**Mobile:** React Native, Flutter, Swift, Kotlin\n**Cloud:** AWS, Google Cloud, Vercel, Docker\n**DevOps:** GitHub Actions, Kubernetes, Terraform\n\nWe choose the best technology stack based on your project requirements, scalability needs, and team expertise. What type of project are you planning?',
        confidence: 'High' as const
      }
    }
    
    // Contact queries
    if (lowerQuery.includes('contact') || lowerQuery.includes('reach') || lowerQuery.includes('talk')) {
      return {
        text: 'I\'d love to connect you with our team! Here are the best ways to reach us:\n\n📧 **Email:** hello@tfxai.vercel.app\n📱 **Phone/WhatsApp:** +91 98765 43210\n🎯 **Book a Call:** https://tfxai.vercel.app/book-call\n📝 **Contact Form:** https://tfxai.vercel.app/contact\n\nOur team typically responds within 24 hours. For urgent inquiries, feel free to call us directly. Would you like me to help you prepare for a consultation call?',
        confidence: 'High' as const
      }
    }
    
    // Portfolio queries
    if (lowerQuery.includes('portfolio') || lowerQuery.includes('work') || lowerQuery.includes('examples')) {
      return {
        text: 'We\'ve worked on some amazing projects! Here are a few highlights:\n\n🤖 **AI Chatbot Platform** - Reduced customer support costs by 60%\n📱 **E-commerce Mobile App** - 200% increase in mobile sales\n☁️ **SaaS Dashboard** - Handles 1M+ users with 99.9% uptime\n🎯 **Marketing Automation** - 300% ROI for client campaigns\n\nYou can view our complete portfolio at https://tfxai.vercel.app/portfolio. Each case study includes detailed metrics and technologies used. Would you like me to tell you more about any specific project?',
        confidence: 'High' as const
      }
    }
    
    // Experience/expertise queries
    if (lowerQuery.includes('experience') || lowerQuery.includes('how long') || lowerQuery.includes('team')) {
      return {
        text: 'Our team brings over 15 years of combined experience in technology and design:\n\n👥 **Team Size:** 12+ experts including developers, designers, and AI specialists\n🏆 **Projects Delivered:** 200+ successful projects\n🌍 **Global Clients:** Serving clients across 15+ countries\n⭐ **Client Satisfaction:** 98% satisfaction rate with 5-star reviews\n\nOur expertise spans fintech, healthcare, e-commerce, education, and more. We\'ve worked with startups, enterprises, and everything in between. What industry are you in?',
        confidence: 'High' as const
      }
    }
    
    // Default response
    return {
      text: `That\'s a great question about "${query}"! While I don\'t have specific information about that topic, I\'d be happy to help with:\n\n• Our AI development services\n• Web and mobile app development\n• Pricing and project timelines\n• Technology recommendations\n• Booking a consultation\n\nCould you rephrase your question or let me know how I can assist you better? You can also reach our team directly at hello@tfxai.vercel.app for detailed inquiries.`,
      confidence: 'Medium' as const
    }
  }

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
    ))
    toast.success(helpful ? 'Thanks for your feedback!' : 'We\'ll work on improving!')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/ai-tools"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-purple transition-colors"
            >
              <ArrowLeft size={16} />
              Back to AI Tools
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <SectionHeading
              badge="AI Tool"
              title="Q&A Bot"
              subtitle="Get instant answers about TFX AI services, pricing, technology, and more. Our AI assistant is here to help 24/7."
              center
              className="mb-8"
            />
            
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-white font-semibold mb-2">24/7 Available</h3>
                <p className="text-gray-400 text-sm">Get answers anytime, anywhere</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-pink/20 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-brand-pink" />
                </div>
                <h3 className="text-white font-semibold mb-2">Instant Responses</h3>
                <p className="text-gray-400 text-sm">No waiting for human support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-orange/20 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-white font-semibold mb-2">Personalized Help</h3>
                <p className="text-gray-400 text-sm">Context-aware assistance</p>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8 border-brand-purple/20">
              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto mb-8 pr-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.role === 'bot' && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          <Bot size={16} />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                        <div className={`rounded-2xl p-4 ${
                          message.role === 'user' 
                            ? 'bg-brand-purple text-white rounded-br-sm' 
                            : 'bg-white/5 border border-white/10 rounded-tl-sm'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                        </div>
                        
                        {/* Message metadata */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          
                          {message.confidence && (
                            <div className="flex items-center gap-1.5">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                message.confidence === 'High' ? 'bg-green-500' : 
                                message.confidence === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                              )} />
                              <span className="text-[10px] font-bold text-gray-500 uppercase">
                                {message.confidence}
                              </span>
                            </div>
                          )}
                          
                          {message.role === 'bot' && !message.helpful && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleFeedback(message.id, true)}
                                className="p-1 text-gray-500 hover:text-green-400 transition-colors"
                                title="Helpful"
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, false)}
                                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                title="Not helpful"
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          <User size={16} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Loading indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 w-24 flex gap-1 justify-center">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Quick Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'What services do you offer?',
                    'How much does it cost?',
                    'What technology do you use?',
                    'Can I see your portfolio?',
                    'How do I get started?',
                    'Do you offer support?'
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleAsk(q)}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:border-brand-purple transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about TFX AI... (Press Enter to send)"
                  className="w-full pl-6 pr-16 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-purple transition-all resize-none h-20"
                  disabled={loading}
                />
                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !question.trim()}
                  className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-brand-purple to-brand-pink rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Tips */}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span>💡</span>
                <span>Try asking about our services, pricing, technology stack, or portfolio</span>
              </div>
            </GlassCard>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-purple mb-2">98%</div>
              <div className="text-sm text-gray-400">Response Accuracy</div>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-pink mb-2">&lt;2s</div>
              <div className="text-sm text-gray-400">Average Response Time</div>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-orange mb-2">24/7</div>
              <div className="text-sm text-gray-400">Availability</div>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-sm text-gray-400">Questions Answered</div>
            </GlassCard>
          </div>

          {/* Try Other Tools CTA */}
          <div className="text-center mt-16">
            <GlassCard className="p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Try Our Other AI Tools</h3>
              <p className="text-gray-400 mb-6">Explore more AI-powered tools to boost your productivity.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ai-tools/resume-analyzer">
                  <AnimatedButton className="w-full sm:w-auto">
                    Resume Analyzer
                  </AnimatedButton>
                </Link>
                <Link href="/ai-tools/text-generator">
                  <AnimatedButton variant="outline" className="w-full sm:w-auto">
                    Text Generator
                  </AnimatedButton>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
