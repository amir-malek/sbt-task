'use client'

import { useArticles } from '@/hooks/useArticles'
import ArticleCard from './ArticleCard'

export default function ArticlesList() {
  const { data, isLoading, error } = useArticles()

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load articles</p>
      </div>
    )
  }

  if (!data?.articles?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  )
}