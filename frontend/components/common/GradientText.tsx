import { cn } from '@/lib/utils/cn'
import { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span className={cn('gradient-text font-display font-bold', className)}>
      {children}
    </span>
  )
}
