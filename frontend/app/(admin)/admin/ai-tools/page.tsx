'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { StatsCard } from '@/components/admin/StatsCard'
import { Bot, FileSearch, Type, MessageSquare, BarChart3, Globe, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function AdminAIToolsStatsPage() {
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setHistory([
        { id: '1', tool: 'Resume Analyzer', ip: '192.168.1.1', date: '2024-05-03 14:20', confidence: '95%' },
        { id: '2', tool: 'Text Generator', ip: '103.45.21.9', date: '2024-05-03 13:45', confidence: 'N/A' },
        { id: '3', tool: 'Q&A Bot', ip: '202.12.33.1', date: '2024-05-03 12:10', confidence: '88%' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const COLUMNS = [
    { 
      key: 'tool', 
      label: 'Tool Name',
      render: (val: any) => (
        <div className="flex items-center gap-2">
          {val.includes('Resume') ? <FileSearch className="w-4 h-4 text-blue-400" /> : 
           val.includes('Text') ? <Type className="w-4 h-4 text-purple-400" /> : 
           <MessageSquare className="w-4 h-4 text-pink-400" />}
          <span className="text-white font-bold">{val}</span>
        </div>
      )
    },
    { key: 'ip', label: 'User IP' },
    { key: 'date', label: 'Usage Time' },
    { 
      key: 'confidence', 
      label: 'Confidence',
      render: (val: any) => val !== 'N/A' ? (
        <span className="text-brand-yellow font-mono text-xs">{val}</span>
      ) : <span className="text-gray-600">-</span>
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">AI Tools Analytics</h1>
        <p className="text-gray-400">Track usage and performance of your AI utilities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Usages" value={8421} icon={<Zap className="w-5 h-5" />} color="pink" />
        <StatsCard title="Resume Analyzer" value={3120} icon={<FileSearch className="w-5 h-5" />} color="blue" />
        <StatsCard title="Text Generator" value={2840} icon={<Type className="w-5 h-5" />} color="purple" />
        <StatsCard title="Q&A Bot" value={2461} icon={<Bot className="w-5 h-5" />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <GlassCard className="lg:col-span-2 p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent Usage Log</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <DataTable columns={COLUMNS} data={history} loading={loading} />
         </GlassCard>

         <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-white mb-6">Top Regions</h3>
            <div className="space-y-6">
               {[
                 { country: 'India', usage: 4500, percent: 54 },
                 { country: 'USA', usage: 2100, percent: 25 },
                 { country: 'UK', usage: 840, percent: 10 },
                 { country: 'Others', usage: 981, percent: 11 },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-white font-bold">{item.country}</span>
                       <span className="text-gray-500">{item.usage} uses</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-brand transition-all duration-1000" 
                         style={{ width: `${item.percent}%` }}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </GlassCard>
      </div>
    </div>
  )
}
