'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { aiToolsApi } from '@/lib/api/ai-tools.api'
import { Brain, FileText, Sparkles, MessageSquare, Loader2, CheckCircle, AlertTriangle, Copy, RotateCcw, Send, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

type TabType = 'resume' | 'text' | 'bot'

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('resume')

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Innovation"
            title="AI Tools Demo"
            subtitle="Explore our custom-built AI solutions. No signup required for the demo."
            center
            className="mb-16"
          />

          {/* Tabs Control */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-2xl">
              <TabButton 
                active={activeTab === 'resume'} 
                onClick={() => setActiveTab('resume')}
                icon={<FileText className="w-4 h-4" />}
                label="Resume Analyzer"
              />
              <TabButton 
                active={activeTab === 'text'} 
                onClick={() => setActiveTab('text')}
                icon={<Sparkles className="w-4 h-4" />}
                label="Text Generator"
              />
              <TabButton 
                active={activeTab === 'bot'} 
                onClick={() => setActiveTab('bot')}
                icon={<MessageSquare className="w-4 h-4" />}
                label="Q&A Bot"
              />
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'resume' && <ResumeAnalyzer key="resume" />}
              {activeTab === 'text' && <TextGenerator key="text" />}
              {activeTab === 'bot' && <QABot key="bot" />}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
        active ? "text-white" : "text-gray-400 hover:text-white"
      )}
    >
      {active && (
        <motion.div
          layoutId="tool-tab"
          className="absolute inset-0 bg-brand-pink rounded-xl z-0 shadow-lg shadow-brand-pink/20"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon} {label}
      </span>
    </button>
  )
}

// --- Resume Analyzer ---
function ResumeAnalyzer() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return toast.error('Please paste your resume text')
    setLoading(true)
    try {
      const res = await aiToolsApi.analyzeResume({ text })
      setResult(res.data)
      toast.success('Analysis complete!')
    } catch (error) {
      // Mock result for demo
      setResult({
        overall_score: 82,
        ats_score: 75,
        section_scores: { contact: 100, summary: 85, experience: 70, skills: 90, education: 95 },
        strengths: ['Clear contact information', 'Strong technical skills section', 'Consistent formatting'],
        improvements: ['Quantify accomplishments in experience', 'Add a more compelling summary', 'Include LinkedIn profile link'],
        keywords: { found: ['React', 'TypeScript', 'Node.js', 'API'], missing: ['Kubernetes', 'CI/CD', 'Unit Testing'] },
        verdict: 'Your resume is strong in technical skills but needs more data-driven achievement metrics to stand out to top recruiters.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard className="p-8">
        <h3 className="text-xl font-display font-bold text-white mb-6">Input Resume Content</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your resume text here (Contact info, Summary, Work History...)"
          className="w-full h-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-300 outline-none focus:border-brand-pink transition-all resize-none"
        />
        <AnimatedButton onClick={handleAnalyze} disabled={loading} className="w-full mt-6 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </AnimatedButton>
      </GlassCard>

      <GlassCard className="p-8 border-brand-purple/20">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex justify-around items-center py-4">
                <CircularProgress score={result.overall_score} label="Overall Score" />
                <CircularProgress score={result.ats_score} label="ATS Score" color="#8a508f" />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Section Health</h4>
                {Object.entries(result.section_scores).map(([name, score]: [any, any]) => (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="capitalize text-gray-300">{name}</span>
                      <span className="text-white">{score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all", score > 80 ? 'bg-green-500' : score > 60 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-green-500 uppercase mb-3">Strengths</h4>
                  <ul className="space-y-2">
                    {result.strengths.map((s: string) => (
                      <li key={s} className="flex items-start gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-orange-500 uppercase mb-3">Improvements</h4>
                  <ul className="space-y-2">
                    {result.improvements.map((i: string) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <AlertTriangle className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-2xl p-4 italic text-sm text-gray-300">
                &ldquo;{result.verdict}&rdquo;
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
              <FileText className="w-20 h-20 mb-4" />
              <p className="text-gray-400 max-w-xs">Analysis results will appear here after you paste your resume.</p>
            </div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  )
}

function CircularProgress({ score, label, color = '#bc5090' }: any) {
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle 
            cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="6" 
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{score}%</span>
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
    </div>
  )
}

// --- Text Generator ---
function TextGenerator() {
  const [form, setForm] = useState({ topic: '', type: 'Social Post', tone: 'Professional', length: 'Medium' })
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState('')

  const handleGenerate = async () => {
    if (!form.topic) return toast.error('Please enter a topic')
    setLoading(true)
    try {
      const res = await aiToolsApi.generateText(form)
      setGenerated(res.data)
    } catch {
      setGenerated("TFX AI is revolutionizing the intersection of artificial intelligence and high-performance web development. Our team of expert engineers builds custom solutions that don't just look amazing—they think, adapt, and scale. From intelligent chatbots to sophisticated SaaS architectures, we bring the future to your browser today.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard className="p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400">What are we writing about?</label>
            <input 
              value={form.topic}
              onChange={e => setForm({...form, topic: e.target.value})}
              placeholder="e.g. Next-gen AI agency services"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">Content Type</label>
              <select 
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
              >
                <option className="bg-dark-bg">Blog Intro</option>
                <option className="bg-dark-bg">Social Post</option>
                <option className="bg-dark-bg">Email</option>
                <option className="bg-dark-bg">Tagline</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">Tone</label>
              <select 
                value={form.tone}
                onChange={e => setForm({...form, tone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
              >
                <option className="bg-dark-bg">Professional</option>
                <option className="bg-dark-bg">Casual</option>
                <option className="bg-dark-bg">Creative</option>
                <option className="bg-dark-bg">Persuasive</option>
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
                  className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all", form.length === l ? "bg-brand-pink text-white" : "text-gray-500 hover:text-white")}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <AnimatedButton onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {loading ? 'Generating...' : 'Generate Content'}
          </AnimatedButton>
        </div>
      </GlassCard>

      <GlassCard className="p-8 border-brand-pink/20 relative">
        <AnimatePresence mode="wait">
          {generated ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
              <div className="flex-grow bg-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed text-lg italic overflow-y-auto max-h-[400px]">
                {generated}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-bold uppercase">{generated.split(' ').length} Words</span>
                <div className="flex gap-3">
                  <button onClick={() => { navigator.clipboard.writeText(generated); toast.success('Copied!'); }} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button onClick={handleGenerate} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
              <Sparkles className="w-20 h-20 mb-4" />
              <p className="text-gray-400 max-w-xs">Fill the form and hit generate to see the magic happen.</p>
            </div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  )
}

// --- Q&A Bot ---
function QABot() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: 'Hi! I am the TFX AI Assistant. How can I help you today?' }
  ])
  const [loading, setLoading] = useState(false)

  const handleAsk = async (q?: string) => {
    const finalQ = q || question
    if (!finalQ.trim()) return
    setLoading(true)
    setQuestion('')
    try {
      // Simulate API
      await new Promise(r => setTimeout(r, 1500))
      const response = "TFX AI offers comprehensive services including custom AI development, high-performance web applications, and digital transformation consulting. Our primary focus is on building intelligent systems that drive business growth."
      setMessages(prev => [...prev, { role: 'bot', text: response, confidence: 'High' }])
    } catch {
      toast.error('Bot is currently unavailable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="max-w-4xl mx-auto p-8 border-brand-blue/20">
      <div className="h-[400px] overflow-y-auto mb-8 pr-4 space-y-6 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-brand shrink-0 flex items-center justify-center text-white text-[10px] font-bold">TFX</div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
              <p className="text-gray-300 text-sm leading-relaxed">{msg.text}</p>
              {msg.confidence && (
                <div className="mt-3 flex items-center gap-1.5">
                   <div className={cn("w-2 h-2 rounded-full", msg.confidence === 'High' ? 'bg-green-500' : 'bg-yellow-500')} />
                   <span className="text-[10px] font-bold text-gray-500 uppercase">Confidence: {msg.confidence}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 w-24 flex gap-1 justify-center">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {['Our Services?', 'Pricing Model?', 'Contact Info?'].map(q => (
            <button key={q} onClick={() => handleAsk(q)} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 hover:text-white hover:border-brand-pink transition-all">
              {q}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Ask me anything about TFX AI..."
            className="w-full pl-6 pr-16 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all"
          />
          <button 
            onClick={() => handleAsk()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-brand-pink rounded-xl text-white hover:bg-brand-pink/90 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
