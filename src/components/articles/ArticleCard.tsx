import { memo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateRelative } from '@/lib/utils/formatDate'
import { MAX_VISIBLE_TAGS } from '@/lib/utils/constants'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
}

// Avatar component with error handling
function AuthorAvatar({ author }: { author: Article['author'] }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200">
      {author.image && !imageError ? (
        <Image
          src={author.image}
          alt={author.username}
          fill
          className={`object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-semibold">
          {author.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

function ArticleCardComponent({ article }: ArticleCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={`/articles/${article.slug}`}>
        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <AuthorAvatar author={article.author} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{article.author.username}</span>
              <span className="text-xs text-gray-500">
                {formatDateRelative(article.createdAt)}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
            {article.title}
          </h2>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {article.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {article.tagList.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {article.tagList.length > MAX_VISIBLE_TAGS && (
                <Badge variant="outline" className="text-xs">
                  +{article.tagList.length - MAX_VISIBLE_TAGS}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>❤️ {article.favoritesCount}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

// Memoized component to prevent unnecessary re-renders
export const ArticleCard = memo(ArticleCardComponent)