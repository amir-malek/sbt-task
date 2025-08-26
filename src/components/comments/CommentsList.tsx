'use client'

import { useComments } from '@/hooks/useComments'
import CommentCard from './CommentCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface CommentsListProps {
  articleSlug: string
}

export default function CommentsList({ articleSlug }: CommentsListProps) {
  const { data, isLoading, error } = useComments(articleSlug)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Failed to load comments</p>
      </div>
    )
  }

  if (!data?.comments?.length) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No comments yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({data.comments.length})
      </h3>
      {data.comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}