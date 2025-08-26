'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import DOMPurify from 'dompurify'
import { Badge } from '@/components/ui/badge'
import type { Article } from '@/types/api'

interface ArticleDetailProps {
  article: Article
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <div className="not-prose mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{article.description}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={article.author.image}
            alt={`${article.author.username}'s avatar`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.svg'
            }}
          />
          <div>
            <p className="font-semibold">{article.author.username}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(article.createdAt), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {article.tagList.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(article.body, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
            ALLOWED_ATTR: []
          })
        }}
      />
    </article>
  )
}