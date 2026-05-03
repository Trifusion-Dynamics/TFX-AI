'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { Plus, Edit, Trash2, CheckCircle, FileText, BarChart3, Eye } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminBlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)

  const openModal = (post: any = null) => {
    setEditingPost(post || { title: '', category: 'AI', status: 'PUBLISHED', views: 0, date: new Date().toISOString().split('T')[0], content: '' })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPost.id) {
      setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p))
      toast.success('Post updated')
    } else {
      setPosts([...posts, { ...editingPost, id: Date.now().toString(), thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&q=80' }])
      toast.success('Post created')
    }
    setIsModalOpen(false)
  }

  useEffect(() => {
    setTimeout(() => {
      setPosts([
        { id: '1', title: 'The Future of Generative AI', category: 'AI', views: 1250, status: 'PUBLISHED', date: '2024-05-01', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&q=80' },
        { id: '2', title: 'Mastering Next.js 15', category: 'Web', views: 850, status: 'PUBLISHED', date: '2024-04-28', thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=100&q=80' },
        { id: '3', title: 'UI Design Patterns for SaaS', category: 'Design', views: 420, status: 'DRAFT', date: '2024-04-25', thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=100&q=80' },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const COLUMNS = [
    { 
      key: 'thumbnail', 
      label: 'Post',

      render: (val: any, row: any) => (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-10 rounded overflow-hidden border border-white/10 shrink-0">
            <Image src={val || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&q=80'} alt="thumb" fill className="object-cover" />
          </div>
          <p className="text-white font-bold text-xs line-clamp-1">{row.title}</p>
        </div>
      )
    },

    { 
      key: 'category', 
      label: 'Category',
      render: (val: any) => <span className="text-xs text-brand-pink font-bold">{val}</span>
    },
    { 
      key: 'views', 
      label: 'Views',
      render: (val: any) => (
        <div className="flex items-center gap-1 text-gray-400">
          <Eye className="w-3 h-3" /> {val}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: any) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold",
          val === 'PUBLISHED' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
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
          <h1 className="text-3xl font-display font-bold text-white mb-1">Blog Management</h1>
          <p className="text-gray-400">Write and publish articles for the TFX AI blog.</p>
        </div>
        <button onClick={() => openModal()} className="px-6 py-3 bg-gradient-brand text-white text-sm font-bold rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <DataTable columns={COLUMNS} data={posts} loading={loading} />
      </GlassCard>

      {/* Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <GlassCard className="relative w-full max-w-4xl p-8 border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPost?.id ? 'Edit Blog Post' : 'Create New Post'}
            </h2>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Post Title</label>
                <input 
                  required
                  value={editingPost.title}
                  onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
                <select 
                  value={editingPost.category}
                  onChange={e => setEditingPost({...editingPost, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                >
                  <option value="AI">AI</option>
                  <option value="Web">Web</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
                <select 
                  value={editingPost.status}
                  onChange={e => setEditingPost({...editingPost, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Content (Markdown/HTML Support)</label>
                <textarea 
                  required
                  value={editingPost.content}
                  onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                  className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink font-mono text-sm"
                  placeholder="Write your content here..."
                />
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
                  {editingPost?.id ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
