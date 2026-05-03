'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface AnimatedButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className,
  type = 'button',
  disabled = false,
}: AnimatedButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-colors rounded-full',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  )

  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary: 'bg-gradient-brand text-white shadow-lg shadow-brand-pink/25 hover:shadow-brand-pink/40 border-none',
    outline: 'border-2 border-transparent bg-clip-padding relative before:absolute before:inset-0 before:rounded-full before:-z-10 before:p-[2px] before:bg-gradient-brand bg-dark-bg text-white hover:bg-transparent transition-all',
    ghost: 'bg-transparent hover:bg-white/5 text-white',
  }

  const classes = cn(baseClasses, sizeClasses[size], variantClasses[variant], className)

  const inner = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {inner}
    </button>
  )

}
