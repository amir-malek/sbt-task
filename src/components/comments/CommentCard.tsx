import { useState } from 'react'
import Image from 'next/image'
import { formatDateRelative } from '@/lib/utils/formatDate'
import type { Comment } from '@/types/api'

interface CommentCardProps {
  comment: Comment
  level?: number
}

export function CommentCard({ comment, level = 0 }: CommentCardProps) {
  const [imageError, setImageError] = useState(false)
  const maxNestingLevel = 3
  const isNested = level > 0
  const canNest = level < maxNestingLevel

  return (
    <div className={`${isNested ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        {/* Comment Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200">
            {comment.author.image && !imageError ? (
              <Image
                src={comment.author.image}
                alt={comment.author.username}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                {comment.author.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
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
            ❤️ Like
          </button>
        </div>
      </div>
    </div>
  )
}