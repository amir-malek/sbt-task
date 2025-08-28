import { memo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

function LoadingSpinnerComponent({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={cn('flex items-center justify-center', className)} role="progressbar" aria-label="Loading content">
      <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-gray-900', sizeClasses[size])} />
    </div>
  )
}

function ArticleListSkeletonComponent() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3" data-testid={`skeleton-${i}`}>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)
export const ArticleListSkeleton = memo(ArticleListSkeletonComponent)