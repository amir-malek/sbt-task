import { Heart } from 'lucide-react'
import { AuthorAvatar } from '@/components/common/AuthorAvatar'
import { formatDateRelative } from '@/lib/utils/formatDate'
import type { Comment } from '@/types/api'

interface CommentCardProps {
  comment: Comment
  level?: number
}

export function CommentCard({ comment, level = 0 }: CommentCardProps) {
  const maxNestingLevel = 3
  const isNested = level > 0
  const canNest = level < maxNestingLevel

  return (
    <div className={`${isNested ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        {/* Comment Header */}
        <div className="flex items-center gap-3 mb-3">
          <AuthorAvatar author={comment.author} showGradient={false} />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {comment.author.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatDateRelative(comment.createdAt)}
            </span>
          </div>
        </div>

        {/* Comment Body */}
        <div className="text-gray-700 leading-relaxed">
          {comment.body.split('\n').map((paragraph, index) => (
            <p key={`${comment.id}-paragraph-${index}`} className={index > 0 ? 'mt-2' : ''}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Comment Actions - Disabled for now */}
        <div className="flex items-center gap-4 mt-4 pt-2 border-t border-gray-100">
          <button 
            disabled 
            className="text-sm text-gray-400 cursor-not-allowed"
            aria-label="Reply functionality coming soon"
          >
            Reply
          </button>
          <button 
            disabled 
            className="text-sm text-gray-400 cursor-not-allowed"
            aria-label="Like functionality coming soon"
          >
            <Heart className="h-3 w-3 mr-1" />
            Like
          </button>
        </div>
      </div>
    </div>
  )
}