export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realworld.io/api'

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