'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/formatDate'
import type { Article } from '@/types'

interface ArticleDetailProps {
  article: Article
}

// Avatar component with error handling
function AuthorAvatar({ author }: { author: Article['author'] }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
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
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm font-semibold">
          {author.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

// Memoized component for article body to prevent unnecessary re-renders
function ArticleBody({ body, articleSlug }: { body: string; articleSlug: string }) {
  const paragraphs = useMemo(() => {
    return body.split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
  }, [body])

  // Simple sanitization function for now (in production, use a proper sanitizer)
  const sanitizeText = (text: string) => {
    // Basic escaping to prevent XSS
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => (
        <p key={`${articleSlug}-${index}`} className="mb-4">
          {sanitizeText(paragraph)}
        </p>
      ))}
    </div>
  )
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {article.description}
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <AuthorAvatar author={article.author} />
            <div>
              <div className="font-medium text-gray-900">
                {article.author.username}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(article.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">❤️ {article.favoritesCount}</span>
          </div>
        </div>

        {/* Tags */}
        {article.tagList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tagList.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Article Body */}
      <ArticleBody body={article.body} articleSlug={article.slug} />
    </article>
  )
}