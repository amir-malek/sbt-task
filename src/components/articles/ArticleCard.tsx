import { memo } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthorAvatar } from '@/components/common/AuthorAvatar'
import { formatDateRelative } from '@/lib/utils/formatDate'
import { MAX_VISIBLE_TAGS } from '@/lib/utils/constants'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
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
              <Heart className="h-4 w-4" />
              <span>{article.favoritesCount}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export const ArticleCard = memo(ArticleCardComponent)