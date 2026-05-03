import { cn } from '@/lib/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-white/5", className)} />
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="p-6 border border-white/5 rounded-3xl bg-white/5 flex flex-col gap-4">
      <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}
