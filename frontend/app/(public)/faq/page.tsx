'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { ChevronDown, HelpCircle, Search, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { cn } from '@/lib/utils/cn'

const FAQ_DATA = [
  {
    category: 'General',
    questions: [
      { q: 'What is TFX AI?', a: 'TFX AI is a premium digital agency specializing in AI integration, web applications, and SaaS development.' },
      { q: 'How do I start a project with you?', a: 'You can start by filling out our contact form or scheduling a free discovery call through our website.' },
      { q: 'Do you work with international clients?', a: 'Yes, we have worked with clients across North America, Europe, and Asia, managing projects across different time zones efficiently.' },
    ]
  },
  {
    category: 'Development',
    questions: [
      { q: 'What technologies do you use?', a: 'Our core stack includes Next.js, React, TypeScript, Tailwind for frontend, and FastAPI, Node.js, and PostgreSQL for backend/AI integrations.' },
      { q: 'How long does a project typically take?', a: 'Small projects take 2-4 weeks, while complex AI or enterprise platforms can take 3-6 months.' },
      { q: 'Do you offer post-launch support?', a: 'Yes, every major project comes with 6 months of free maintenance and support.' },
    ]
  },
  {
    category: 'AI Tools',
    questions: [
      { q: 'Can you integrate AI into my existing app?', a: 'Absolutely. We specialize in retrofitting legacy applications with modern AI features like chatbots, RAG, and automation agents.' },
      { q: 'Which AI models do you work with?', a: 'We work with a wide range of models including GPT-4, Gemini, Claude, and various open-source LLMs like Llama.' },
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('General')

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <SectionHeading
            badge="Help Center"
            title="Frequently Asked Questions"
            center
            className="mb-8"
          />
          
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-pink transition-colors" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/5 border border-white/10 focus:border-brand-pink outline-none transition-all text-white"
            />
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Categories Sidebar */}
            <aside className="lg:w-1/4 flex flex-col gap-3">
              {FAQ_DATA.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className={cn(
                    "px-6 py-4 rounded-xl text-left font-semibold transition-all border",
                    activeCategory === cat.category 
                      ? "bg-brand-pink text-white border-brand-pink shadow-lg shadow-brand-pink/20" 
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  )}
                >
                  {cat.category}
                </button>
              ))}
            </aside>

            {/* Accordion Content */}
            <div className="lg:w-3/4">
              <Accordion.Root type="single" collapsible className="flex flex-col gap-4">
                {FAQ_DATA.find(c => c.category === activeCategory)?.questions.map((item, idx) => (
                  <Accordion.Item key={idx} value={`item-${idx}`} asChild>
                    <GlassCard className="p-0 border-white/10 overflow-hidden">
                      <Accordion.Trigger className="w-full px-8 py-6 flex items-center justify-between text-left group">
                        <span className="text-lg font-display font-bold text-white group-hover:text-brand-pink transition-colors">
                          {item.q}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
                      </Accordion.Trigger>
                      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up border-t border-white/5">
                        <div className="px-8 py-6 text-gray-400 leading-relaxed text-sm">
                          {item.a}
                        </div>
                      </Accordion.Content>
                    </GlassCard>
                  </Accordion.Item>
                ))}
              </Accordion.Root>

              {/* No Results */}
              {FAQ_DATA.find(c => c.category === activeCategory)?.questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No questions found in this category.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Support CTA */}
        <section className="container mx-auto px-4 mt-24">
          <GlassCard className="p-12 text-center bg-gradient-brand/5 border-brand-pink/20 flex flex-col items-center gap-6">
            <MessageCircle className="w-12 h-12 text-brand-pink" />
            <h3 className="text-3xl font-display font-bold text-white">Still have questions?</h3>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our team is here to help you. Reach out to us directly and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="flex gap-4">
              <AnimatedButton href="/contact">Contact Support</AnimatedButton>
              <AnimatedButton href="https://wa.me" variant="outline">WhatsApp Us</AnimatedButton>
            </div>
          </GlassCard>
        </section>
      </main>
      <Footer />
    </>
  )
}
