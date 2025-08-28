import { apiRequest } from './client'
import { DEFAULT_PAGINATION } from '../utils/constants'
import type { ArticlesResponse, ArticleResponse, PaginationParams, ArticleFilters } from '@/types'

export interface GetArticlesParams extends PaginationParams, ArticleFilters {}

export async function getArticles(params: GetArticlesParams = {}): Promise<ArticlesResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.offset) searchParams.set('offset', params.offset.toString())
  if (params.tag) searchParams.set('tag', params.tag)
  if (params.author) searchParams.set('author', params.author)
  if (params.favorited) searchParams.set('favorited', params.favorited)

  const query = searchParams.toString()
  const endpoint = query ? `/articles?${query}` : '/articles'
  
  return apiRequest<ArticlesResponse>(endpoint)
}

export async function getArticle(slug: string): Promise<ArticleResponse> {
  return apiRequest<ArticleResponse>(`/articles/${slug}`)
}

// Server-side functions for SSG/ISR
export async function getArticlesSsr(params: GetArticlesParams = {}): Promise<ArticlesResponse> {
  try {
    return await getArticles(params)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    // Return empty response for SSG fallback
    return { articles: [], articlesCount: 0 }
  }
}

export async function getArticleSsr(slug: string): Promise<ArticleResponse | null> {
  try {
    return await getArticle(slug)
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return null
  }
}