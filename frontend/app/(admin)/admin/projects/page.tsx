'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { Plus, Edit, Trash2, CheckCircle, XCircle, FolderKanban, Tag, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setProjects([
        { id: '1', title: 'AgroBrain AI', category: 'AI', featured: true, published: true, thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80' },
        { id: '2', title: 'Fintech Dashboard', category: 'SaaS', featured: false, published: true, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&q=80' },
        { id: '3', title: 'Crypto Wallet', category: 'Web', featured: true, published: false, thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&q=80' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)

  const openModal = (project: any = null) => {
    setEditingProject(project || { title: '', category: 'AI', tech_stack: [], featured: false, published: true, thumbnail: '' })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProject.id) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p))
      toast.success('Project updated')
    } else {
      setProjects([...projects, { ...editingProject, id: Date.now().toString() }])
      toast.success('Project created')
    }
    setIsModalOpen(false)
  }

  const COLUMNS = [
    { 
      key: 'thumbnail', 
      label: 'Preview',
      render: (val: any) => (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5">
          <Image src={val || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80'} alt="thumb" fill className="object-cover" />
        </div>
      )
    },
    { key: 'title', label: 'Project Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (val: any) => (
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <Tag className="w-3 h-3 text-brand-pink" /> {val}
        </span>
      )
    },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (val: any) => val ? <CheckCircle className="w-4 h-4 text-brand-pink" /> : <XCircle className="w-4 h-4 text-gray-700" />
    },
    { 
      key: 'published', 
      label: 'Status',
      render: (val: any) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold",
          val ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
        )}>
          {val ? 'PUBLISHED' : 'DRAFT'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openModal(row)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Projects Library</h1>
          <p className="text-gray-400">Manage your portfolio and case study showcases.</p>
        </div>
        <button onClick={() => openModal()} className="px-6 py-3 bg-gradient-brand text-white text-sm font-bold rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <DataTable columns={COLUMNS} data={projects} loading={loading} />
      </GlassCard>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <GlassCard className="relative w-full max-w-3xl p-8 border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProject?.id ? 'Edit Project' : 'Create New Project'}
            </h2>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Project Title</label>
                <input 
                  required
                  value={editingProject.title}
                  onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
                <select 
                  value={editingProject.category}
                  onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                >
                  <option value="AI">AI Solutions</option>
                  <option value="WEB">Web Development</option>
                  <option value="SAAS">SaaS Platform</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Thumbnail URL</label>
                <input 
                  value={editingProject.thumbnail}
                  onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Tech Stack (Comma separated)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(editingProject.tech_stack || []).map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-brand-pink/10 text-brand-pink text-xs font-bold rounded-full flex items-center gap-2">
                      {tech}
                      <XCircle className="w-3 h-3 cursor-pointer" onClick={() => {
                        const newStack = editingProject.tech_stack.filter((_: any, idx: number) => idx !== i)
                        setEditingProject({...editingProject, tech_stack: newStack})
                      }} />
                    </span>
                  ))}
                </div>
                <input 
                  placeholder="Type tech and press Enter"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const val = (e.target as HTMLInputElement).value.trim()
                      if (val) {
                        setEditingProject({...editingProject, tech_stack: [...(editingProject.tech_stack || []), val]})
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <input 
                     type="checkbox"
                     checked={editingProject.featured}
                     onChange={e => setEditingProject({...editingProject, featured: e.target.checked})}
                     className="w-4 h-4 accent-brand-pink"
                   />
                   <label className="text-sm text-white font-medium">Featured</label>
                </div>
                <div className="flex items-center gap-2">
                   <input 
                     type="checkbox"
                     checked={editingProject.published}
                     onChange={e => setEditingProject({...editingProject, published: e.target.checked})}
                     className="w-4 h-4 accent-brand-pink"
                   />
                   <label className="text-sm text-white font-medium">Published</label>
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-brand text-white rounded-xl font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

