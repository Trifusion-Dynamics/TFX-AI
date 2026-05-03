'use client'

import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/admin/StatsCard'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { 
  Users, 
  Mail, 
  MousePointer2, 
  FileText, 
  FolderKanban, 
  Brain,
  ArrowUpRight,
  UserPlus,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const RECENT_LEADS = [
    { name: 'Arun Kumar', email: 'arun@example.com', subject: 'AI Chatbot Inquiry', status: 'NEW', date: '2024-05-03' },
    { name: 'John Doe', email: 'john@gmail.com', subject: 'Web App Dev', status: 'IN_PROGRESS', date: '2024-05-02' },
    { name: 'Sarah Wilson', email: 'sarah@tfx.ai', subject: 'UI/UX Design', status: 'RESOLVED', date: '2024-05-01' },
    { name: 'Mike Ross', email: 'mike@legals.com', subject: 'SaaS Platform', status: 'NEW', date: '2024-04-30' },
  ]

  const RECENT_USERS = [
    { name: 'Amit Singh', email: 'amit@test.com', role: 'user', verified: true, date: '2 hours ago' },
    { name: 'Priya Raj', email: 'priya@web.in', role: 'user', verified: false, date: '5 hours ago' },
    { name: 'Admin TFX', email: 'admin@tfxai.com', role: 'admin', verified: true, date: '1 day ago' },
  ]

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard title="Total Users" value={1250} icon={<Users className="w-6 h-6" />} change={12} color="blue" />
        <StatsCard title="Total Leads" value={458} icon={<Mail className="w-6 h-6" />} change={8} color="pink" />
        <StatsCard title="New Leads" value={24} icon={<UserPlus className="w-6 h-6" />} change={15} color="orange" />
        <StatsCard title="Blog Posts" value={156} icon={<FileText className="w-6 h-6" />} change={5} color="purple" />
        <StatsCard title="Projects" value={42} icon={<FolderKanban className="w-6 h-6" />} change={2} color="yellow" />
        <StatsCard title="AI Usages" value={8540} icon={<Brain className="w-6 h-6" />} change={24} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Mock */}
        <GlassCard className="lg:col-span-2 p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
              Leads Overview <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded">Last 30 Days</span>
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs text-gray-400">
                 <div className="w-3 h-3 rounded-full bg-brand-pink" /> Web Leads
               </div>
               <div className="flex items-center gap-2 text-xs text-gray-400">
                 <div className="w-3 h-3 rounded-full bg-brand-purple" /> AI Leads
               </div>
            </div>
          </div>
          
          <div className="h-[300px] flex items-end gap-2 px-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                <div 
                  className="w-full bg-brand-pink/20 group-hover:bg-brand-pink transition-all rounded-t-sm"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
                <div 
                  className="w-full bg-brand-purple/20 group-hover:bg-brand-purple transition-all rounded-b-sm"
                  style={{ height: `${Math.random() * 40}%` }}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-xl font-display font-bold text-white mb-8">Leads by Status</h3>
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray="502" strokeDashoffset="100" />
                <circle cx="96" cy="96" r="80" fill="none" stroke="#eab308" strokeWidth="12" strokeDasharray="502" strokeDashoffset="350" />
                <circle cx="96" cy="96" r="80" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="502" strokeDashoffset="450" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">458</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Total</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
             <StatusLegend label="New" color="bg-blue-500" value="45" />
             <StatusLegend label="In Progress" color="bg-yellow-500" value="124" />
             <StatusLegend label="Resolved" color="bg-green-500" value="289" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold text-white">Recent Leads</h3>
            <button className="text-brand-pink text-xs font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <DataTable 
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'subject', label: 'Subject' },
              { 
                key: 'status', 
                label: 'Status',
                render: (val: any) => (
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold",
                    val === 'NEW' ? 'bg-blue-500/10 text-blue-500' : 
                    val === 'IN_PROGRESS' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                  )}>
                    {val}
                  </span>
                )
              },
              { key: 'date', label: 'Date' }
            ]}
            data={RECENT_LEADS}
            loading={loading}
          />
        </GlassCard>

        {/* Recent Users */}
        <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold text-white">New Users</h3>
            <button className="text-brand-pink text-xs font-bold hover:underline flex items-center gap-1">
              Manage Users <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <DataTable 
            columns={[
              { 
                key: 'name', 
                label: 'User',
                render: (val: any, row: any) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                      {val.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{val}</p>
                      <p className="text-[10px] text-gray-500">{row.email}</p>
                    </div>
                  </div>
                )
              },
              { 
                key: 'role', 
                label: 'Role',
                render: (val: any) => (
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold",
                    val === 'admin' ? 'bg-brand-purple/20 text-brand-purple' : 'bg-white/10 text-gray-400'
                  )}>
                    {val}
                  </span>
                )
              },
              { 
                key: 'verified', 
                label: 'Verified',
                render: (val: any) => val ? <Clock className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-600" />
              },
              { key: 'date', label: 'Joined' }
            ]}
            data={RECENT_USERS}
            loading={loading}
          />
        </GlassCard>
      </div>

      {/* Top Blogs Row */}
      <GlassCard className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold text-white">Top Blog Posts by Views</h3>
          <button className="text-brand-pink text-xs font-bold hover:underline">View Analytics</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'The Future of AI in SaaS', views: 4250, category: 'AI', trend: '+12%' },
            { title: 'Next.js 15 Masterclass', views: 3820, category: 'Web', trend: '+18%' },
            { title: 'Designing for the Dark Mode', views: 2100, category: 'UI/UX', trend: '+5%' },
          ].map((blog, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-pink/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                 <span className="text-[10px] font-black text-brand-pink bg-brand-pink/10 px-2 py-1 rounded">{blog.category}</span>
                 <span className="text-green-500 text-[10px] font-bold">{blog.trend}</span>
              </div>
              <h4 className="text-white font-bold mb-4 line-clamp-1 group-hover:text-brand-pink transition-colors">{blog.title}</h4>
              <div className="flex items-center gap-2 text-gray-500">
                <FileText className="w-3 h-3" />
                <span className="text-xs">{blog.views.toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function StatusLegend({ label, color, value }: any) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-gray-400">
        <div className={cn("w-2 h-2 rounded-full", color)} /> {label}
      </div>
      <span className="text-white font-bold">{value}</span>
    </div>
  )
}

