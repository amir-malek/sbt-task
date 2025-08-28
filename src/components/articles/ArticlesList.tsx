'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { ArticleCard } from './ArticleCard'
import { LoadingSpinner, ArticleListSkeleton } from '@/components/common/LoadingSpinner'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useArticles } from '@/hooks/useArticles'
import type { GetArticlesParams } from '@/lib/api/articles'

interface ArticlesListProps {
  filters?: Omit<GetArticlesParams, 'limit' | 'offset'>
}

function ArticlesListContent({ filters }: ArticlesListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useArticles(filters)

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  })

  // Auto-load next page when intersection observer triggers
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return <ArticleListSkeleton />
  }

  if (error) {
    throw error
  }

  const articles = data?.pages.flatMap(page => page.articles) ?? []
  const totalCount = data?.pages[0]?.articlesCount ?? 0

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-600">Check back later for new content.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-6">
        Showing {articles.length} of {totalCount} articles
      </div>
      
      <div className="grid gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="flex justify-center py-6">
        {isFetchingNextPage && <LoadingSpinner />}
        {hasNextPage && !isFetchingNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            variant="outline"
            className="w-full max-w-xs"
          >
            Load More Articles
          </Button>
        )}
        {!hasNextPage && articles.length > 0 && (
          <p className="text-gray-500">You've reached the end of the articles</p>
        )}
      </div>
    </div>
  )
}

export function ArticlesList(props: ArticlesListProps) {
  return (
    <ErrorBoundary>
      <ArticlesListContent {...props} />
    </ErrorBoundary>
  )
}