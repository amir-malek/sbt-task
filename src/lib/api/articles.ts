import { apiRequest } from './client'
import { DEFAULT_PAGINATION } from '../utils/constants'
import type { ArticlesResponse, ArticleResponse, PaginationParams, ArticleFilters } from '@/types'

export async function getArticles(
  params: PaginationParams & ArticleFilters = {}
): Promise<ArticlesResponse> {
  const searchParams = new URLSearchParams()
  
  searchParams.set('limit', String(params.limit ?? DEFAULT_PAGINATION.limit))
  searchParams.set('offset', String(params.offset ?? DEFAULT_PAGINATION.offset))
  
  if (params.tag) searchParams.set('tag', params.tag)
  if (params.author) searchParams.set('author', params.author)
  if (params.favorited) searchParams.set('favorited', params.favorited)

  return apiRequest<ArticlesResponse>(`/articles?${searchParams.toString()}`)
}

export async function getArticle(slug: string): Promise<ArticleResponse> {
  return apiRequest<ArticleResponse>(`/articles/${slug}`)
}