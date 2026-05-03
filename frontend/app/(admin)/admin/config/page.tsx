'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { Settings, Save, Trash2, Plus, Key, Type, Database, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function AdminConfigPage() {
  const [configs, setConfigs] = useState([
    { id: '1', key: 'SITE_NAME', value: 'TFX AI', type: 'STRING' },
    { id: '2', key: 'CONTACT_EMAIL', value: 'hello@tfxai.com', type: 'STRING' },
    { id: '3', key: 'ENABLE_REGISTRATION', value: 'true', type: 'BOOLEAN' },
    { id: '4', key: 'MAX_RESUME_SIZE_MB', value: '5', type: 'NUMBER' },
  ])

  const [newConfig, setNewConfig] = useState({ key: '', value: '', type: 'STRING' })

  const handleUpdate = (id: string, newValue: string) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, value: newValue } : c))
    toast.success('Config updated')
  }

  const handleAdd = () => {
    if (!newConfig.key || !newConfig.value) return
    setConfigs([...configs, { ...newConfig, id: Date.now().toString() }])
    setNewConfig({ key: '', value: '', type: 'STRING' })
    toast.success('New config added')
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Site Configuration</h1>
        <p className="text-gray-400">Manage global variables and feature flags.</p>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-wider font-bold text-gray-500">
            <tr>
              <th className="px-6 py-4">Key</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {configs.map((config) => (
              <tr key={config.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-brand-pink font-bold">
                  {config.key}
                </td>
                <td className="px-6 py-4">
                  <input 
                    defaultValue={config.value}
                    onBlur={(e) => handleUpdate(config.id, e.target.value)}
                    className="bg-transparent border-b border-transparent focus:border-brand-purple outline-none text-sm text-white w-full py-1"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-2 py-1 rounded">
                    {config.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <GlassCard className="p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-pink" /> Add New Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Key</label>
              <input 
                value={newConfig.key}
                onChange={e => setNewConfig({...newConfig, key: e.target.value})}
                placeholder="e.g. MAINTENANCE_MODE" 
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-pink" 
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Value</label>
              <input 
                value={newConfig.value}
                onChange={e => setNewConfig({...newConfig, value: e.target.value})}
                placeholder="e.g. false" 
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-pink" 
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
              <select 
                value={newConfig.type}
                onChange={e => setNewConfig({...newConfig, type: e.target.value})}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-pink"
              >
                <option value="STRING">STRING</option>
                <option value="NUMBER">NUMBER</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="JSON">JSON</option>
              </select>
           </div>
           <div className="flex items-end">
              <button 
                onClick={handleAdd}
                className="w-full py-2 bg-gradient-brand text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Key
              </button>
           </div>
        </div>
      </GlassCard>
    </div>
  )
}
