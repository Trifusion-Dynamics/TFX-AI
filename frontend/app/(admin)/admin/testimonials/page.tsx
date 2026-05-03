'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { Plus, Edit, Trash2, MessageSquare, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function AdminTestimonialsPage() {
  const [loading, setLoading] = useState(true)
  const [testimonials, setTestimonials] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setTestimonials([
        { id: '1', name: 'Alex Johnson', role: 'CEO', company: 'TechFlow', rating: 5, published: true, date: '2024-05-01' },
        { id: '2', name: 'Maria Garcia', role: 'Founder', company: 'EcoStyle', rating: 4, published: true, date: '2024-04-28' },
        { id: '3', name: 'Kevin Lee', role: 'CTO', company: 'FastScale', rating: 5, published: false, date: '2024-04-25' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const COLUMNS = [
    { 
      key: 'name', 
      label: 'Client',
      render: (val: any, row: any) => (
        <div>
          <p className="text-white font-bold">{val}</p>
          <p className="text-[10px] text-gray-500">{row.role} at {row.company}</p>
        </div>
      )
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (val: any) => (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-3 h-3", i < val ? "text-brand-yellow fill-brand-yellow" : "text-gray-700")} />
          ))}
        </div>
      )
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
          <h1 className="text-3xl font-display font-bold text-white mb-1">Testimonials</h1>
          <p className="text-gray-400">Manage client feedback and ratings.</p>
        </div>
        <button className="px-6 py-3 bg-gradient-brand text-white text-sm font-bold rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <DataTable columns={COLUMNS} data={testimonials} loading={loading} />
      </GlassCard>
    </div>
  )
}
