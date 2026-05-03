'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { StatsCard } from '@/components/admin/StatsCard'
import { GlassCard } from '@/components/common/GlassCard'
import { Mail, Search, Filter, Eye, Trash2, MoreVertical, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function LeadsPage() {
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    // Mock data fetching
    setTimeout(() => {
      setLeads([
        { id: '1', name: 'Arun Kumar', email: 'arun@example.com', subject: 'AI Project', status: 'NEW', date: '2024-05-03' },
        { id: '2', name: 'John Smith', email: 'john@tech.com', subject: 'SaaS Dev', status: 'IN_PROGRESS', date: '2024-05-02' },
        { id: '3', name: 'Priya Raj', email: 'priya@web.in', subject: 'UI UX', status: 'RESOLVED', date: '2024-05-01' },
        { id: '4', name: 'Mike Ross', email: 'mike@legals.com', subject: 'API Dev', status: 'CLOSED', date: '2024-04-30' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(l => l.id !== id))
      toast.success('Lead deleted')
    }
  }

  const COLUMNS = [
    { 
      key: 'name', 
      label: 'Contact',
      render: (val: any, row: any) => (
        <div>
          <p className="text-white font-bold">{val}</p>
          <p className="text-[10px] text-gray-500">{row.email}</p>
        </div>
      )
    },
    { key: 'subject', label: 'Subject' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: any) => (
        <span className={cn(
          "px-2 py-1 rounded text-[10px] font-bold",
          val === 'NEW' ? 'bg-blue-500/10 text-blue-500' : 
          val === 'IN_PROGRESS' ? 'bg-yellow-500/10 text-yellow-500' : 
          val === 'RESOLVED' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'
        )}>
          {val}
        </span>
      )
    },
    { key: 'date', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Project Leads</h1>
          <p className="text-gray-400">Manage and respond to project inquiries.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input placeholder="Search leads..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-brand-pink transition-all" />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Leads" value={458} icon={<Mail className="w-5 h-5" />} color="pink" />
        <StatsCard title="New" value={24} icon={<AlertCircle className="w-5 h-5" />} color="blue" />
        <StatsCard title="In Progress" value={124} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatsCard title="Resolved" value={310} icon={<CheckCircle className="w-5 h-5" />} color="purple" />
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <DataTable columns={COLUMNS} data={leads} loading={loading} />
      </GlassCard>
    </div>
  )
}
