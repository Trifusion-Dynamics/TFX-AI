import { cn } from '@/lib/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white/5 rounded-xl", className)} />
  )
}

export function ServiceCardSkeleton() {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-20" />
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/5 overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="w-1/4 h-4" />
        <Skeleton className="w-3/4 h-6" />
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/5 overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  )
}
