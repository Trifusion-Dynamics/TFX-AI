'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { Sparkles, Copy, RotateCcw, ArrowLeft, FileText, Zap, Target } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function TextGeneratorPage() {
  const [form, setForm] = useState({ 
    topic: '', 
    type: 'Social Post', 
    tone: 'Professional', 
    length: 'Medium' 
  })
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState('')

  const handleGenerate = async () => {
    if (!form.topic) return toast.error('Please enter a topic')
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 2000))
      const content = generateContent(form)
      setGenerated(content)
      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateContent = (params: any) => {
    const samples = {
      'Social Post': {
        'Professional': `🚀 Exciting news! ${params.topic} is transforming the way we work. Our latest innovation delivers unprecedented results and sets new industry standards. Join us on this journey of digital transformation. #Innovation #Tech #Future`,
        'Casual': `Just shipped something amazing! ${params.topic} is now live and it's a game-changer. Been working on this for months and can't wait for you to try it. Let me know what you think! 🎉`,
        'Creative': `✨ Imagine a world where ${params.topic} isn't just possible—it's effortless. That future is now here. We've reimagined everything from the ground up. Ready to be amazed? 🌟`,
        'Persuasive': `Stop settling for less. With ${params.topic}, you get 10x better results in half the time. Don't believe us? Try it risk-free for 30 days. Your competitors are already using it. Are you?`
      },
      'Blog Intro': {
        'Professional': `In today's rapidly evolving digital landscape, ${params.topic} has emerged as a critical factor for business success. Organizations that leverage this technology report significant improvements in efficiency and ROI. This comprehensive guide explores everything you need to know.`,
        'Casual': `Let's talk about ${params.topic}. It's everywhere these days, but what's the big deal? I've spent weeks researching this topic, and I'm sharing everything I've learned—no fluff, just real insights that actually work.`,
        'Creative': `Picture this: ${params.topic} as your secret weapon. That's exactly what it's become for thousands of businesses. In this post, I'm pulling back the curtain on how the pros are using it to dominate their markets.`,
        'Persuasive': `What if I told you that ${params.topic} could double your productivity without any additional effort? Sound too good to be true? It's not. And I'm about to show you exactly how it works.`
      },
      'Email': {
        'Professional': `Subject: Transform Your Business with ${params.topic}

Dear Valued Customer,

We're excited to introduce our latest innovation in ${params.topic}. This cutting-edge solution has been designed to address your most pressing challenges and deliver measurable results.

Key benefits include:
• 50% faster processing times
• 99.9% uptime guarantee
• Seamless integration with existing systems

We'd love to schedule a personalized demo for you.

Best regards,
The Team`,
        'Casual': `Hey there!

Just wanted to share something cool I found - ${params.topic}. It's been a total game-changer for me, and I thought you might find it useful too.

Basically, it helps you [main benefit] without all the usual headaches.

Wanna hop on a quick call to see it in action?

Cheers!`,
        'Creative': `Subject: ✨ Your ${params.topic} Revolution Starts Here

Ready to level up?

${params.topic} isn't just another tool—it's your ticket to the big leagues. We're talking transformation that makes your competitors wonder what hit you.

Curious? You should be.

Click below to start the magic 🪄`,
        'Persuasive': `Subject: Last Chance: ${params.topic} Special Offer Ends Tonight

This is it.

The opportunity you've been waiting for. ${params.topic} at a price that will never be repeated.

But you need to act NOW.

In 24 hours, this deal disappears forever. Don't let this be another "what if" moment.

[CLAIM YOUR DISCOUNT]`
      },
      'Tagline': {
        'Professional': `${params.topic}: Excellence in Every Interaction.`,
        'Casual': `${params.topic}: Making Life Easier, One Click at a Time.`,
        'Creative': `${params.topic}: Where Innovation Meets Imagination.`,
        'Persuasive': `${params.topic}: The Only Tool You'll Ever Need.`
      }
    }

    return samples[form.type as keyof typeof samples]?.[form.tone as keyof typeof samples[keyof typeof samples]] || `${params.topic} - Transform your business with cutting-edge solutions and unmatched performance.`
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
              title="Text Generator"
              subtitle="Create compelling content in seconds with AI. Generate social posts, blog intros, emails, and more with customizable tone and style."
              center
              className="mb-8"
            />
            
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-white font-semibold mb-2">Multiple Formats</h3>
                <p className="text-gray-400 text-sm">Social posts, blogs, emails, taglines</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-pink/20 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-brand-pink" />
                </div>
                <h3 className="text-white font-semibold mb-2">Custom Tone</h3>
                <p className="text-gray-400 text-sm">Professional, casual, creative, persuasive</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-orange/20 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-white font-semibold mb-2">Instant Results</h3>
                <p className="text-gray-400 text-sm">High-quality content in seconds</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Input Section */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-display font-bold text-white mb-6">Content Settings</h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-400">What are we writing about?</label>
                  <input 
                    value={form.topic}
                    onChange={e => setForm({...form, topic: e.target.value})}
                    placeholder="e.g. Next-gen AI agency services"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-purple transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-400">Content Type</label>
                    <select 
                      value={form.type}
                      onChange={e => setForm({...form, type: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-purple"
                    >
                      <option value="Blog Intro">Blog Intro</option>
                      <option value="Social Post">Social Post</option>
                      <option value="Email">Email</option>
                      <option value="Tagline">Tagline</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-400">Tone</label>
                    <select 
                      value={form.tone}
                      onChange={e => setForm({...form, tone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-purple"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Casual">Casual</option>
                      <option value="Creative">Creative</option>
                      <option value="Persuasive">Persuasive</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-400">Length</label>
                  <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                    {['Short', 'Medium', 'Long'].map(l => (
                      <button 
                        key={l} 
                        onClick={() => setForm({...form, length: l})}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                          form.length === l ? "bg-brand-purple text-white" : "text-gray-500 hover:text-white"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-lg p-4">
                  <p className="text-sm text-brand-purple mb-2">💡 Pro Tip:</p>
                  <p className="text-xs text-gray-300">
                    Be specific about your topic for better results. Include key details you want to highlight.
                  </p>
                </div>

                <AnimatedButton 
                  onClick={handleGenerate} 
                  disabled={loading || !form.topic.trim()} 
                  className="w-full flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {loading ? 'Generating...' : 'Generate Content'}
                </AnimatedButton>
              </div>
            </GlassCard>

            {/* Output Section */}
            <GlassCard className="p-8 border-brand-purple/20">
              <h3 className="text-xl font-display font-bold text-white mb-6">Generated Content</h3>
              
              {generated ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-grow bg-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed overflow-y-auto max-h-[400px]">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{generated}</pre>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 font-bold uppercase">
                          {generated.split(' ').length} Words
                        </span>
                        <span className="text-xs text-gray-500 font-bold uppercase">
                          {generated.split('\n').length} Lines
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { 
                            navigator.clipboard.writeText(generated); 
                            toast.success('Content copied to clipboard!'); 
                          }} 
                          className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:border-brand-purple transition-all border border-white/10"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleGenerate} 
                          className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:border-brand-purple transition-all border border-white/10"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setGenerated('')
                          toast.success('Ready for new content!')
                        }}
                        className="flex-1 py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-brand-purple transition-all text-sm"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          // In a real app, this would save to a database
                          toast.success('Content saved to library!')
                        }}
                        className="flex-1 py-2 px-4 bg-brand-purple/20 border border-brand-purple/30 rounded-xl text-brand-purple hover:bg-brand-purple/30 transition-all text-sm"
                      >
                        Save to Library
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
                  <FileText className="w-20 h-20 mb-4" />
                  <p className="text-gray-400 max-w-sm">Fill in the settings and hit generate to create amazing content instantly.</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Templates Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Quick Start Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { topic: 'AI-powered customer support', type: 'Blog Intro', tone: 'Professional', length: 'Medium' },
                { topic: 'New product launch celebration', type: 'Social Post', tone: 'Casual', length: 'Short' },
                { topic: 'Limited time discount offer', type: 'Email', tone: 'Persuasive', length: 'Long' },
                { topic: 'Innovative tech startup', type: 'Tagline', tone: 'Creative', length: 'Short' }
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => setForm(template)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-brand-purple transition-all text-left"
                >
                  <div className="text-xs text-gray-500 mb-1">{template.type}</div>
                  <div className="text-sm text-white font-medium">{template.topic}</div>
                  <div className="text-xs text-brand-purple mt-1">{template.tone}</div>
                </button>
              ))}
            </div>
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
                <Link href="/ai-tools/qa-bot">
                  <AnimatedButton variant="outline" className="w-full sm:w-auto">
                    Q&A Bot
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
