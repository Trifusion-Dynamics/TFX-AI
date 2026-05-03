import { cn } from '@/lib/utils/cn'
import { GradientText } from './GradientText'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  badge?: string
  center?: boolean
  gradient?: boolean
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  center = false,
  gradient = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4', center && 'items-center text-center', className)}>
      {badge && (
        <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-brand-purple/20 text-brand-pink border border-brand-purple/30 w-fit">
          {badge}
        </span>
      )}
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
        {gradient ? <GradientText>{title}</GradientText> : title}
      </h2>
      
      {subtitle && (
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
