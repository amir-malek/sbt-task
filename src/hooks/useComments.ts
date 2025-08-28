'use client'

import { useQuery } from '@tanstack/react-query'
import { getComments } from '@/lib/api/comments'
import { QUERY_KEYS } from '@/lib/utils/constants'

export function useComments(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.comments, slug],
    queryFn: () => getComments(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refresh comments when user returns to tab
  })
}