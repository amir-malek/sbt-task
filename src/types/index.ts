export * from './api'

export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface ArticleFilters {
  tag?: string
  author?: string
  favorited?: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'