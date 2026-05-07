'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Minimize2, Send, Bot } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { aiToolsApi } from '@/lib/api/ai-tools.api'
import { ChatMessage, ChatbotResponse, VisitorInfo } from '@/types'
import ARIAAvatar from './ARIAAvatar'

const ChatWidget: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Don't show on admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null
  }

  // Generate session ID on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('tfxai_chat_session')
    if (stored) {
      setSessionId(stored)
    } else {
      const newSession = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      setSessionId(newSession)
      sessionStorage.setItem('tfxai_chat_session', newSession)
    }

    // Load saved messages
    const savedMessages = sessionStorage.getItem('tfxai_chat_messages')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load saved messages:', e)
      }
    }

    // Load visitor info
    const savedVisitor = localStorage.getItem('tfxai_chat_visitor')
    if (savedVisitor) {
      try {
        const parsed = JSON.parse(savedVisitor)
        setVisitorInfo(parsed)
        setLeadCaptured(true)
      } catch (e) {
        console.error('Failed to load visitor info:', e)
      }
    }
  }, [])

  // Save messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('tfxai_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Force bottom positioning with CSS
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .chatbot-fixed-bottom {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 9999 !important;
      }
      .chatbot-window-fixed {
        position: fixed !important;
        bottom: 100px !important;
        right: 24px !important;
        z-index: 9999 !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Show tooltip on hover
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setShowTooltip(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Get page context
  const getPageContext = useCallback(() => {
    if (pathname === '/') return 'Homepage'
    if (pathname?.includes('services')) return 'Services page'
    if (pathname?.includes('pricing')) return 'Pricing page'
    if (pathname?.includes('portfolio')) return 'Portfolio page'
    if (pathname?.includes('contact')) return 'Contact page'
    if (pathname?.includes('calculator')) return 'Project cost calculator'
    return 'Website'
  }, [pathname])

  // Send initial greeting on first open
  const handleFirstOpen = useCallback(() => {
    if (!hasGreeted && !messages.length) {
      setTimeout(() => {
        const greeting: ChatMessage = {
          id: 'greeting_' + Date.now(),
          role: 'assistant',
          content: `Hi there! 👋 I'm ARIA, TFX AI's assistant.\n\nI can help you with:\n- Our services & pricing\n- Past projects & case studies\n- Booking a free consultation\n\nWhat brings you here today? 😊`,
          timestamp: new Date(),
          suggestedActions: [
            "Tell me about your services",
            "What's the pricing?", 
            "I have a project idea"
          ]
        }
        setMessages([greeting])
        setHasGreeted(true)
        setUnreadCount(1)
      }, 500)
    }
  }, [hasGreeted, messages.length])

  // Handle chat open
  const handleOpenChat = useCallback(() => {
    setIsOpen(true)
    setUnreadCount(0)
    handleFirstOpen()
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [handleFirstOpen])

  // Handle chat close
  const handleCloseChat = useCallback(() => {
    setIsOpen(false)
    setIsMinimized(false)
  }, [])

  // Send message to AI
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await aiToolsApi.chatbot({
        message,
        conversation_history: conversationHistory,
        visitor_name: visitorInfo?.name,
        page_context: getPageContext()
      })

      const data = response.data.data as ChatbotResponse

      const assistantMessage: ChatMessage = {
        id: 'assistant_' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        suggestedActions: data.suggested_actions,
        isLeadCapture: data.should_capture_lead
      }

      setMessages(prev => [...prev, assistantMessage])

      // Track analytics
      console.log('Chat message sent:', { message, intent: data.intent })

      if (data.should_capture_lead && data.lead_capture_prompt) {
        // Add lead capture message
        const leadMessage: ChatMessage = {
          id: 'lead_' + Date.now(),
          role: 'system',
          content: data.lead_capture_prompt,
          timestamp: new Date(),
          isLeadCapture: true
        }
        setMessages(prev => [...prev, leadMessage])
      }

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: 'error_' + Date.now(),
        role: 'assistant',
        content: "Oops! I'm having trouble connecting. Try WhatsApp instead 📱\n\n[WhatsApp us](https://wa.me/919129939972)",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [messages, isTyping, visitorInfo, getPageContext])

  // Handle lead capture
  const handleLeadCapture = useCallback(async (name: string, email: string) => {
    try {
      // Save visitor info
      const newVisitorInfo: VisitorInfo = {
        name,
        email,
        capturedAt: new Date()
      }
      setVisitorInfo(newVisitorInfo)
      setLeadCaptured(true)
      localStorage.setItem('tfxai_chat_visitor', JSON.stringify(newVisitorInfo))

      // Send to backend (you can integrate with existing contact API)
      // await contactApi.submitLead({ name, email, source: 'chatbot' })

      // Show success message
      const successMessage: ChatMessage = {
        id: 'success_' + Date.now(),
        role: 'system',
        content: `Thanks ${name}! I've received your details. Arun will get back to you soon with a detailed proposal. 😊`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, successMessage])

      console.log('Lead captured:', { name, email })

    } catch (error) {
      console.error('Lead capture error:', error)
    }
  }, [])

  // Handle suggested action click
  const handleSuggestedAction = useCallback((action: string) => {
    sendMessage(action)
  }, [sendMessage])

  // Handle form submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }, [inputValue, sendMessage])

  // Handle input key down
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  // Parse links in messages
  const parseMessageContent = useCallback((content: string) => {
    const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = content.split(urlRegex)
    return parts.map((part, index) => {
      if (index % 3 === 1) {
        return (
          <a 
            key={index}
            href={parts[index + 1]} 
            className="text-brand-purple hover:text-brand-pink underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        )
      }
      if (index % 3 === 2) return null
      return part
    })
  }, [])

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.div
          className="fixed z-[9999] chatbot-fixed-bottom"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={handleOpenChat}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <MessageCircle size={24} />
            
            {/* Notification dot */}
            {!hasGreeted && (
              <motion.div
                className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Unread count badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </div>
            )}

            {/* Tooltip */}
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap glass-card"
              >
                Chat with ARIA 🤖
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </motion.div>
            )}
          </button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bg-gray-900 rounded-2xl shadow-2xl border border-brand-purple/20 overflow-hidden flex flex-col md:w-96 md:h-[600px] w-[calc(100vw-24px)] h-[80vh] chatbot-window-fixed"
          >
            {/* Header */}
            <div className="glass-card border-b border-brand-purple/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ARIAAvatar size="medium" />
                <div>
                  <div className="font-semibold text-white">ARIA</div>
                  <div className="text-xs text-gray-400">TFX AI Assistant</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={handleCloseChat}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <ARIAAvatar size="small" className="mr-2 mt-1" />
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-tr-sm'
                            : message.role === 'system'
                            ? 'bg-gray-800 text-gray-300 text-center text-sm'
                            : 'glass-card border border-brand-purple/20 text-white rounded-tl-sm'
                        }`}
                      >
                        <div className="whitespace-pre-line">
                          {parseMessageContent(message.content)}
                        </div>
                        
                        {/* Lead Capture Form */}
                        {message.isLeadCapture && !leadCaptured && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(e.currentTarget)
                              handleLeadCapture(
                                formData.get('name') as string,
                                formData.get('email') as string
                              )
                            }}
                            className="mt-3 space-y-2"
                          >
                            <input
                              name="name"
                              type="text"
                              placeholder="Your name"
                              required
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
                            />
                            <input
                              name="email"
                              type="email"
                              placeholder="Your email"
                              required
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple"
                            />
                            <button
                              type="submit"
                              className="w-full px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                              Send →
                            </button>
                          </form>
                        )}

                        {/* Suggested Actions */}
                        {message.suggestedActions && message.suggestedActions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestedActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestedAction(action)}
                                className="px-3 py-1 text-sm border border-brand-purple/40 text-brand-purple hover:bg-brand-purple/10 rounded-full transition-colors"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <ARIAAvatar size="small" className="mr-2 mt-1" />
                      <div className="glass-card border border-brand-purple/20 text-white rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="glass-card border-t border-brand-purple/20 p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      rows={1}
                      className="flex-1 resize-none bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple max-h-20"
                      disabled={isTyping}
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Powered by Google Gemini AI
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
