import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Article } from '@/types/api'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={article.author.image}
            alt={`${article.author.username}'s avatar`}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.svg'
            }}
          />
          <div>
            <p className="text-sm font-medium">{article.author.username}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(article.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <CardTitle>
          <Link href={`/articles/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {article.tagList.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}