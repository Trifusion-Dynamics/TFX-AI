"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Search, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface Job {
  id: string
  title: string
  location: string
  type: string
  salary_range: string
  status: string
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`)
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
      }
    } catch (error) {
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Job deleted')
        setJobs(jobs.filter(j => j.id !== id))
      }
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Job Management</h1>
          <p className="text-gray-400 text-sm">Create and manage job postings for your website.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/80 text-white px-6 py-3 rounded-xl font-bold transition-all">
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-gray-400">No jobs posted yet.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-pink opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-pink/10 rounded-xl text-brand-pink">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">{job.title}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  {job.salary_range}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {job.type}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  job.status === 'open' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {job.status}
                </span>
                <span className="text-xs text-gray-500">
                  ID: {job.id.slice(0, 8)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
