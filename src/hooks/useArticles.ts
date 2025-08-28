'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { getArticles, type GetArticlesParams } from '@/lib/api/articles'
import { ApiError } from '@/lib/api/client'
import { QUERY_KEYS, DEFAULT_PAGINATION, QUERY_CONFIG } from '@/lib/utils/constants'

export function useArticles(filters: Omit<GetArticlesParams, 'limit' | 'offset'> = {}) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.articles, filters],
    queryFn: ({ pageParam = 0 }) =>
      getArticles({
        ...filters,
        limit: DEFAULT_PAGINATION.limit,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = (allPages.length - 1) * DEFAULT_PAGINATION.limit
      const hasMore = currentOffset + lastPage.articles.length < lastPage.articlesCount
      return hasMore ? currentOffset + DEFAULT_PAGINATION.limit : undefined
    },
    initialPageParam: 0,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false
      }
      return failureCount < QUERY_CONFIG.RETRY_ATTEMPTS
    },
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
  })
}