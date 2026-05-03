'use client'

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/common/GlassCard'
import { Plus, Edit, Trash2, CheckCircle, Star, DollarSign, Package } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export default function AdminPricingPage() {
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    setTimeout(() => {
      setPlans([
        { id: '1', name: 'Starter', price: 99, period: 'month', active: true, featured: false },
        { id: '2', name: 'Professional', price: 299, period: 'month', active: true, featured: true },
        { id: '3', name: 'Enterprise', price: 999, period: 'month', active: false, featured: false },
      ])
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Pricing Plans</h1>
          <p className="text-gray-400">Manage your subscription models and service fees.</p>
        </div>
        <button className="px-6 py-3 bg-gradient-brand text-white text-sm font-bold rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl" />
           ))
        ) : (
          plans.map((plan) => (
            <GlassCard key={plan.id} className={cn("p-8 flex flex-col border-white/5", plan.featured && "border-brand-pink/50 bg-brand-pink/5")}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-xl text-brand-pink">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-white">${plan.price}</span>
                <span className="text-gray-500 text-sm">/{plan.period}</span>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-xs text-gray-400 font-bold uppercase">Status</span>
                   <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", plan.active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                     {plan.active ? 'ACTIVE' : 'HIDDEN'}
                   </span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs text-gray-400 font-bold uppercase">Featured</span>
                   <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", plan.featured ? "bg-brand-pink/20 text-brand-pink" : "bg-white/5 text-gray-600")}>
                     {plan.featured ? 'YES' : 'NO'}
                   </span>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
