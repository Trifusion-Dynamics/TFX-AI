'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useEffect, useState } from 'react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: any
  change?: number
  color?: 'pink' | 'purple' | 'blue' | 'orange' | 'yellow'
}

const COLORS = {
  pink: 'bg-brand-pink/10 text-brand-pink border-brand-pink/20',
  purple: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  yellow: 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20',
}

export function StatsCard({ title, value, icon, change, color = 'pink' }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0
      const end = value
      const duration = 1500
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayValue(end)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [value])

  return (
    <GlassCard className="p-6 border-white/5 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", COLORS[color])}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
            change >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-display font-black text-white">
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
        </h3>
      </div>

      {/* Decorative background circle */}
      <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-10", COLORS[color].split(' ')[0])} />
    </GlassCard>
  )
}
