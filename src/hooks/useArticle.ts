'use client'

import { useQuery } from '@tanstack/react-query'
import { getArticle } from '@/lib/api/articles'
import { ApiError } from '@/lib/api/client'
import { QUERY_KEYS, QUERY_CONFIG } from '@/lib/utils/constants'

export function useArticle(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.article, slug],
    queryFn: () => getArticle(slug),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false
      }
      return failureCount < QUERY_CONFIG.RETRY_ATTEMPTS
    },
    staleTime: QUERY_CONFIG.ARTICLE_STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
  })
}