import Image from 'next/image'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import type { Comment } from '@/types/api'

interface CommentCardProps {
  comment: Comment
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="mb-4">{comment.body}</p>
        <div className="flex items-center gap-2">
          <Image
            src={comment.author.image}
            alt={`${comment.author.username}'s avatar`}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.svg'
            }}
          />
          <span className="text-sm font-medium">{comment.author.username}</span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}