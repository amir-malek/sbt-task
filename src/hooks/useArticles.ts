import { useQuery } from '@tanstack/react-query'
import { getArticles } from '@/lib/api/articles'
import { QUERY_KEYS } from '@/lib/utils/constants'
import type { PaginationParams, ArticleFilters } from '@/types'

export function useArticles(params: PaginationParams & ArticleFilters = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.articles, params],
    queryFn: () => getArticles(params),
  })
}