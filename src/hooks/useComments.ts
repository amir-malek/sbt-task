import { useQuery } from '@tanstack/react-query'
import { getComments } from '@/lib/api/comments'
import { QUERY_KEYS } from '@/lib/utils/constants'

export function useComments(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.comments, slug],
    queryFn: () => getComments(slug),
  })
}