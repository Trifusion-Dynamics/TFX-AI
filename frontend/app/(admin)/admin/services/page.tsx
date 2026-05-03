'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { GlassCard } from '@/components/common/GlassCard'
import { Plus, Edit, Trash2, CheckCircle, XCircle, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function AdminServicesPage() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setServices([
        { id: '1', order: 1, title: 'Web Development', short_desc: 'High-performance web apps with Next.js.', active: true },
        { id: '2', order: 2, title: 'AI Solutions', short_desc: 'Custom AI chatbots and LLM integration.', active: true },
        { id: '3', order: 3, title: 'UI/UX Design', short_desc: 'Modern and intuitive user experiences.', active: false },
      ])
      setLoading(false)
    }, 800)
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)

  const openModal = (service: any = null) => {
    setEditingService(service || { title: '', short_desc: '', active: true, order: services.length + 1, features: [] })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService.id) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s))
      toast.success('Service updated')
    } else {
      setServices([...services, { ...editingService, id: Date.now().toString() }])
      toast.success('Service created')
    }
    setIsModalOpen(false)
  }

  const COLUMNS = [
    { 
      key: 'order', 
      label: 'Order',
      render: (val: any) => (
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-600" />
          <span className="font-mono text-gray-400">{val}</span>
        </div>
      )
    },
    { key: 'title', label: 'Service Title' },
    { key: 'short_desc', label: 'Short Description' },
    { 
      key: 'active', 
      label: 'Status',
      render: (val: any) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold",
          val ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {val ? 'ACTIVE' : 'INACTIVE'}
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
          <h1 className="text-3xl font-display font-bold text-white mb-1">Our Services</h1>
          <p className="text-gray-400">Manage the core offerings displayed on the website.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-brand text-white text-sm font-bold rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Service
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <DataTable columns={COLUMNS} data={services} loading={loading} />
      </GlassCard>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <GlassCard className="relative w-full max-w-2xl p-8 border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingService?.id ? 'Edit Service' : 'Create New Service'}
            </h2>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Service Title</label>
                <input 
                  required
                  value={editingService.title}
                  onChange={e => setEditingService({...editingService, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Display Order</label>
                <input 
                  type="number"
                  value={editingService.order}
                  onChange={e => setEditingService({...editingService, order: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-brand-pink"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Features</label>
                <div className="space-y-2">
                  {(editingService.features || []).map((feature: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        value={feature}
                        onChange={e => {
                          const newFeatures = [...editingService.features]
                          newFeatures[idx] = e.target.value
                          setEditingService({...editingService, features: newFeatures})
                        }}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-pink"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const newFeatures = editingService.features.filter((_: any, i: number) => i !== idx)
                          setEditingService({...editingService, features: newFeatures})
                        }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setEditingService({...editingService, features: [...(editingService.features || []), '']})}
                    className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 hover:text-white hover:border-white/20 transition-all"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <input 
                   type="checkbox"
                   checked={editingService.active}
                   onChange={e => setEditingService({...editingService, active: e.target.checked})}
                   className="w-4 h-4 accent-brand-pink"
                 />
                 <label className="text-sm text-white font-medium">Service is Active</label>
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
                  Save Service
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

