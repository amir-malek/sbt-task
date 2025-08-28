export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realworld.show/api'

export const DEFAULT_PAGINATION = {
  limit: 20,
  offset: 0,
} as const

export const QUERY_KEYS = {
  articles: 'articles',
  article: 'article',
  comments: 'comments',
  tags: 'tags',
} as const

// UI Constants
export const MAX_VISIBLE_TAGS = 3
export const AVATAR_FALLBACK = '/default-avatar.svg'

// Query Configuration
export const QUERY_CONFIG = {
  RETRY_ATTEMPTS: 3,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
  ARTICLE_STALE_TIME: 10 * 60 * 1000, // 10 minutes for individual articles
} as const