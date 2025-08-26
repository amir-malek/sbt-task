import { useQuery } from '@tanstack/react-query'
import { getArticle } from '@/lib/api/articles'
import { QUERY_KEYS } from '@/lib/utils/constants'

export function useArticle(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.article, slug],
    queryFn: () => getArticle(slug),
  })
}