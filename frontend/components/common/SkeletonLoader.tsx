import { cn } from '@/lib/utils/cn'

export function SkeletonLoader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5",
        className
      )}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-dark-card/50 p-6 space-y-4">
      <SkeletonLoader className="h-6 w-3/4" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <SkeletonLoader className="h-8 w-20 rounded-full" />
        <SkeletonLoader className="h-8 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-dark-card/50 overflow-hidden">
      <SkeletonLoader className="h-48 w-full" />
      <div className="p-6 space-y-4">
        <SkeletonLoader className="h-6 w-3/4" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-2/3" />
        <div className="flex gap-2">
          <SkeletonLoader className="h-6 w-16 rounded-full" />
          <SkeletonLoader className="h-6 w-16 rounded-full" />
          <SkeletonLoader className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-dark-card/50 p-8 space-y-6">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
        <SkeletonLoader className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-3">
        <SkeletonLoader className="h-6 w-3/4" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-5/6" />
      </div>
      <div className="space-y-2">
        <SkeletonLoader className="h-3 w-full" />
        <SkeletonLoader className="h-3 w-4/5" />
        <SkeletonLoader className="h-3 w-3/5" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-4 text-center space-y-8">
        <SkeletonLoader className="h-8 w-48 mx-auto rounded-full" />
        <div className="space-y-4">
          <SkeletonLoader className="h-20 w-3/4 mx-auto" />
          <SkeletonLoader className="h-20 w-1/2 mx-auto" />
        </div>
        <SkeletonLoader className="h-6 w-2/3 mx-auto" />
        <div className="flex gap-4 justify-center">
          <SkeletonLoader className="h-12 w-40 rounded-lg" />
          <SkeletonLoader className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </section>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-dark-card/50 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonLoader className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonLoader className="h-4 w-1/3" />
          <SkeletonLoader className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-4/5" />
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <SkeletonLoader key={i} className="h-4 w-4 rounded" />
        ))}
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-dark-card/50 overflow-hidden">
      <SkeletonLoader className="h-48 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <SkeletonLoader className="h-6 w-16 rounded-full" />
          <SkeletonLoader className="h-6 w-20 rounded-full" />
        </div>
        <SkeletonLoader className="h-6 w-full" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-4/5" />
        <SkeletonLoader className="h-4 w-12" />
      </div>
    </div>
  )
}
