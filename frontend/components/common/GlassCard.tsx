import { cn } from '@/lib/utils/cn'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card p-6 md:p-8',
        hover && 'transition-colors duration-300 hover:border-brand-pink/40',
        className
      )}
    >
      {children}
    </div>
  )
}
