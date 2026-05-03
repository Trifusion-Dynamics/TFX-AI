'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { Users, Search, UserPlus, Shield, CheckCircle, Trash2, Edit } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: '1', name: 'Arun Kumar Bind', email: 'arun@example.com', role: 'admin', verified: true, date: '2024-01-15' },
        { id: '2', name: 'Amit Singh', email: 'amit@web.in', role: 'user', verified: true, date: '2024-02-10' },
        { id: '3', name: 'Priya Raj', email: 'priya@gmail.com', role: 'user', verified: false, date: '2024-03-05' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const toggleRole = (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    toast.success(`Role updated to ${newRole}`)
  }

  const COLUMNS = [
    { 
      key: 'name', 
      label: 'User',
      render: (val: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold border-2 border-white/5">
            {val.charAt(0)}
          </div>
          <div>
            <p className="text-white font-bold">{val}</p>
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
          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
          val === 'admin' ? 'bg-brand-purple/20 text-brand-purple' : 'bg-white/5 text-gray-400'
        )}>
          {val}
        </span>
      )
    },
    { 
      key: 'verified', 
      label: 'Verified',
      render: (val: any) => val ? (
        <div className="flex items-center gap-1.5 text-green-500 font-bold text-[10px]">
          <CheckCircle className="w-3 h-3" /> VERIFIED
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px]">
          <CheckCircle className="w-3 h-3" /> PENDING
        </div>
      )
    },
    { key: 'date', label: 'Joined' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => toggleRole(row.id, row.role)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand-pink transition-all" title="Toggle Role">
            <Shield className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">User Management</h1>
          <p className="text-gray-400">Manage accounts and platform permissions.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input placeholder="Search users..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-brand-pink transition-all" />
          </div>
          <button className="px-4 py-2 bg-gradient-brand text-white text-xs font-bold rounded-xl flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <DataTable columns={COLUMNS} data={users} loading={loading} />
      </GlassCard>
    </div>
  )
}
