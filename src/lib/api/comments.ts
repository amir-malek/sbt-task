import { apiRequest } from './client'
import type { CommentsResponse } from '@/types'

export async function getComments(slug: string): Promise<CommentsResponse> {
  return apiRequest<CommentsResponse>(`/articles/${slug}/comments`)
}