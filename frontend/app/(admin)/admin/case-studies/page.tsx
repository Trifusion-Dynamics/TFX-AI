'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { Plus, Edit, Trash2, CheckCircle, BookOpen, Building2, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function AdminCaseStudiesPage() {
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setCases([
        { id: '1', title: 'Revolutionizing Retail with AI', client: 'ShopSmart', industry: 'E-commerce', published: true, featured: true, date: '2024-05-01' },
        { id: '2', title: 'SaaS Platform Scaling', client: 'CloudDev', industry: 'Software', published: true, featured: false, date: '2024-04-28' },
        { id: '3', title: 'Healthcare Data Analysis', client: 'MediCore', industry: 'Health', published: false, featured: false, date: '2024-04-25' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const COLUMNS = [
    { 
      key: 'title', 
      label: 'Case Study',
      render: (val: any, row: any) => (
        <div>
          <p className="text-white font-bold">{val}</p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
             <Building2 className="w-3 h-3" /> {row.client}
          </div>
        </div>
      )
    },
    { key: 'industry', label: 'Industry' },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (val: any) => val ? <CheckCircle className="w-4 h-4 text-brand-pink" /> : <div className="w-4 h-4 rounded-full border border-white/10" />
    },
    { 
      key: 'published', 
      label: 'Status',
      render: (val: any) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold",
          val ? "bg-green-500/10 text-green-500" : "bg-white/10 text-gray-500"
        )}>
          {val ? 'PUBLISHED' : 'DRAFT'}
        </span>
      )
    },
    { key: 'date', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Case Studies</h1>
          <p className="text-gray-400">Detailed narratives of your project successes.</p>
        </div>
        <button className="px-6 py-3 bg-gradient-brand text-white text-sm font-bold rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> Write Case Study
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <DataTable columns={COLUMNS} data={cases} loading={loading} />
      </GlassCard>
    </div>
  )
}
