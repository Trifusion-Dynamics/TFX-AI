"use client"

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, FileText, Calendar, ExternalLink, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface Application {
  id: string
  job_id: string
  full_name: string
  email: string
  phone: string
  resume_url: string
  cover_letter: string
  status: string
  created_at: string
  job_title?: string
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/admin/applications`)
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
      }
    } catch (error) {
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/admin/applications/${id}?status=${newStatus}`, {
        method: 'PATCH'
      })
      if (res.ok) {
        toast.success('Application status updated')
        setApplications(applications.map(a => 
          a.id === id ? { ...a, status: newStatus } : a
        ))
      }
    } catch (error) {
      toast.error('Status update failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/admin/applications/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Application deleted')
        setApplications(applications.filter(a => a.id !== id))
      }
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Job Applications</h1>
        <p className="text-gray-400 text-sm">Review and manage candidates who applied for your job openings.</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-gray-400">No applications received yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center gap-6 hover:bg-white/[0.08] transition-all group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{app.full_name}</h3>
                  <span className="text-[10px] bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {app.job_title || 'General'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    app.status === 'reviewed' ? 'bg-blue-500/20 text-blue-500' :
                    app.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-pink" />
                    {app.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-pink" />
                    {app.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-pink" />
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                {app.cover_letter && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Cover Letter:</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{app.cover_letter}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href={app.resume_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-xl text-sm transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Resume
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                {/* Status Change Buttons */}
                {app.status !== 'reviewed' && (
                  <button 
                    onClick={() => handleStatusChange(app.id, 'reviewed')}
                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Mark as Reviewed"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                
                {app.status !== 'accepted' && (
                  <button 
                    onClick={() => handleStatusChange(app.id, 'accepted')}
                    className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                    title="Accept Application"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                
                {app.status !== 'rejected' && (
                  <button 
                    onClick={() => handleStatusChange(app.id, 'rejected')}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Reject Application"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
                
                <div className="h-8 w-px bg-white/10 hidden lg:block" />
                <button 
                  onClick={() => handleDelete(app.id)}
                  className="p-2 text-gray-500 hover:text-brand-red transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
