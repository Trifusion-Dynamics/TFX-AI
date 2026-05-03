'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { StatsCard } from '@/components/admin/StatsCard'
import { Mail, Newspaper, Send, Trash2, Eye, UserCheck, UserMinus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function AdminNewsletterPage() {
  const [loading, setLoading] = useState(true)
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [isSending, setIsSending] = useState(false)
  const [broadcast, setBroadcast] = useState({ subject: '', content: '' })

  useEffect(() => {
    setTimeout(() => {
      setSubscribers([
        { id: '1', email: 'user1@example.com', status: 'ACTIVE', date: '2024-05-01' },
        { id: '2', email: 'user2@gmail.com', status: 'ACTIVE', date: '2024-04-28' },
        { id: '3', email: 'user3@web.in', status: 'INACTIVE', date: '2024-04-25' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const handleBroadcast = async () => {
    if (!broadcast.subject || !broadcast.content) return toast.error('Fill all fields')
    setIsSending(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsSending(false)
    toast.success(`Broadcast sent to ${subscribers.filter(s => s.status === 'ACTIVE').length} users`)
    setBroadcast({ subject: '', content: '' })
  }

  const COLUMNS = [
    { key: 'email', label: 'Email Address' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: any) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold",
          val === 'ACTIVE' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {val}
        </span>
      )
    },
    { key: 'date', label: 'Joined' },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Newsletter</h1>
        <p className="text-gray-400">Manage subscribers and send broadcast emails.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Subscribers" value={1580} icon={<Mail className="w-5 h-5" />} color="pink" />
        <StatsCard title="Active" value={1420} icon={<UserCheck className="w-5 h-5" />} color="blue" />
        <StatsCard title="Unsubscribed" value={160} icon={<UserMinus className="w-5 h-5" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-brand-pink" /> Broadcast Email
          </h3>
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                <input 
                  value={broadcast.subject}
                  onChange={e => setBroadcast({...broadcast, subject: e.target.value})}
                  placeholder="e.g. Monthly AI Newsletter" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">HTML Content</label>
                <textarea 
                  value={broadcast.content}
                  onChange={e => setBroadcast({...broadcast, content: e.target.value})}
                  placeholder="<h1>Hello!</h1>..." 
                  className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink resize-none" 
                />
             </div>
             <div className="flex gap-4">
                <button className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button 
                  onClick={handleBroadcast}
                  disabled={isSending}
                  className="flex-1 px-6 py-3 bg-gradient-brand text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSending ? 'Sending...' : 'Send to All'}
                </button>
             </div>
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
           <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Recent Subscribers</h3>
           </div>
           <DataTable columns={COLUMNS} data={subscribers} loading={loading} />
        </GlassCard>
      </div>
    </div>
  )
}
