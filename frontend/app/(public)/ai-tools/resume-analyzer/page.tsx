'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { Brain, FileText, Loader2, CheckCircle, AlertTriangle, Copy, RotateCcw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function ResumeAnalyzerPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return toast.error('Please paste your resume text')
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 2000))
      setResult({
        overall_score: 82,
        ats_score: 75,
        section_scores: { contact: 100, summary: 85, experience: 70, skills: 90, education: 95 },
        strengths: ['Clear contact information', 'Strong technical skills section', 'Consistent formatting'],
        improvements: ['Quantify accomplishments in experience', 'Add a more compelling summary', 'Include LinkedIn profile link'],
        keywords: { found: ['React', 'TypeScript', 'Node.js', 'API'], missing: ['Kubernetes', 'CI/CD', 'Unit Testing'] },
        verdict: 'Your resume is strong in technical skills but needs more data-driven achievement metrics to stand out to top recruiters.'
      })
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
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
              title="Resume Analyzer"
              subtitle="Get instant AI-powered analysis of your resume. Check ATS compatibility, section scores, and improvement suggestions."
              center
              className="mb-8"
            />
            
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-white font-semibold mb-2">ATS Compatibility</h3>
                <p className="text-gray-400 text-sm">Check if your resume passes automated screening</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-pink/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-brand-pink" />
                </div>
                <h3 className="text-white font-semibold mb-2">Section Analysis</h3>
                <p className="text-gray-400 text-sm">Detailed breakdown of each resume section</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-brand-orange/20 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-white font-semibold mb-2">Improvement Tips</h3>
                <p className="text-gray-400 text-sm">Actionable suggestions to make your resume stand out</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Input Section */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-display font-bold text-white mb-6">Input Resume Content</h3>
              <div className="space-y-4">
                <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-lg p-4">
                  <p className="text-sm text-brand-purple mb-2">💡 Tip:</p>
                  <p className="text-xs text-gray-300">Include your contact info, summary, work experience, skills, and education for best results.</p>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your resume text here...

Example:
John Doe
john.doe@email.com | (555) 123-4567 | LinkedIn

Professional Summary
Experienced software developer with 5+ years in web development...

Experience
Senior Developer at Tech Corp (2020-Present)
- Led development of React applications
- Improved performance by 40%

Skills
JavaScript, React, Node.js, Python, AWS

Education
BS Computer Science, State University"
                  className="w-full h-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-300 outline-none focus:border-brand-purple transition-all resize-none text-sm"
                />
                <AnimatedButton 
                  onClick={handleAnalyze} 
                  disabled={loading || !text.trim()} 
                  className="w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                  {loading ? 'Analyzing...' : 'Analyze Resume'}
                </AnimatedButton>
              </div>
            </GlassCard>

            {/* Results Section */}
            <GlassCard className="p-8 border-brand-purple/20">
              <h3 className="text-xl font-display font-bold text-white mb-6">Analysis Results</h3>
              
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Score Circles */}
                  <div className="flex justify-around items-center py-6">
                    <CircularProgress score={result.overall_score} label="Overall Score" />
                    <CircularProgress score={result.ats_score} label="ATS Score" color="#8a508f" />
                  </div>

                  {/* Section Scores */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Section Health</h4>
                    {Object.entries(result.section_scores).map(([name, score]: [any, any]) => (
                      <div key={name} className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="capitalize text-gray-300">{name}</span>
                          <span className="text-white">{score}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              score > 80 ? 'bg-green-500' : 
                              score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            )} 
                            style={{ width: `${score}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths and Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div>
                      <h4 className="text-sm font-bold text-green-500 uppercase mb-4">Strengths ✅</h4>
                      <ul className="space-y-3">
                        {result.strengths.map((s: string) => (
                          <li key={s} className="flex items-start gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-orange-500 uppercase mb-4">Improvements ⚠️</h4>
                      <ul className="space-y-3">
                        {result.improvements.map((i: string) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> 
                            <span>{i}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Keyword Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-green-500 font-semibold mb-2">Found Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.found.map((keyword: string) => (
                            <span key={keyword} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-orange-500 font-semibold mb-2">Missing Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.missing.map((keyword: string) => (
                            <span key={keyword} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className="bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 border border-brand-purple/20 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-brand-purple uppercase mb-3">AI Verdict</h4>
                    <p className="text-gray-300 italic leading-relaxed">
                      "{result.verdict}"
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                        toast.success('Analysis copied to clipboard!')
                      }}
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-brand-purple transition-all flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      Copy Analysis
                    </button>
                    <button
                      onClick={() => {
                        setText('')
                        setResult(null)
                        toast.success('Ready for new analysis!')
                      }}
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-brand-purple transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={16} />
                      Analyze Another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
                  <FileText className="w-20 h-20 mb-4" />
                  <p className="text-gray-400 max-w-sm">Analysis results will appear here after you paste your resume and click analyze.</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Try Other Tools CTA */}
          <div className="text-center mt-16">
            <GlassCard className="p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Try Our Other AI Tools</h3>
              <p className="text-gray-400 mb-6">Explore more AI-powered tools to boost your productivity.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ai-tools/text-generator">
                  <AnimatedButton className="w-full sm:w-auto">
                    Text Generator
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
