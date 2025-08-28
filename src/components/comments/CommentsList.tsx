'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { CommentCard } from './CommentCard'
import { useComments } from '@/hooks/useComments'
import type { Comment } from '@/types/api'

interface CommentsListProps {
  articleSlug: string
}

// Skeleton for comments loading state
function CommentsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CommentsListContent({ articleSlug }: CommentsListProps) {
  const { data, isLoading, error, refetch } = useComments(articleSlug)
  const [showAll, setShowAll] = useState(false)

  if (isLoading) {
    return <CommentsListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Failed to load comments.</p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    )
  }

  const comments = data?.comments ?? []

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
      </div>
    )
  }

  // Show first 5 comments by default
  const displayComments = showAll ? comments : comments.slice(0, 5)
  const hasMoreComments = comments.length > 5

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
        <Button
          onClick={() => refetch()}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {displayComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      {hasMoreComments && !showAll && (
        <div className="text-center pt-4">
          <Button
            onClick={() => setShowAll(true)}
            variant="outline"
            className="w-full max-w-xs"
          >
            Show {comments.length - 5} More Comments
          </Button>
        </div>
      )}

      {showAll && hasMoreComments && (
        <div className="text-center pt-4">
          <Button
            onClick={() => setShowAll(false)}
            variant="ghost"
            size="sm"
          >
            Show Less
          </Button>
        </div>
      )}
    </div>
  )
}

export function CommentsList(props: CommentsListProps) {
  return (
    <div className="mt-12">
      <CommentsListContent {...props} />
    </div>
  )
}