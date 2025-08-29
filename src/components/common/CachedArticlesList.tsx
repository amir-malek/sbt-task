'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Article } from '@/types'

export function CachedArticlesList() {
  const [cachedArticles, setCachedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCachedArticles()
  }, [])

  const loadCachedArticles = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        const apiCaches = cacheNames.filter(name => name.includes('api'))
        
        const articles: Article[] = []
        
        for (const cacheName of apiCaches) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          
          for (const request of requests) {
            if (request.url.includes('/api/articles')) {
              try {
                const response = await cache.match(request)
                if (response) {
                  const data = await response.json()
                  if (data.articles && Array.isArray(data.articles)) {
                    articles.push(...data.articles)
                  } else if (data.article) {
                    articles.push(data.article)
                  }
                }
              } catch (error) {
                console.warn('Failed to parse cached response:', error)
              }
            }
          }
        }
        
        // Remove duplicates and sort by creation date
        const uniqueArticles = articles.filter((article, index, self) => 
          index === self.findIndex(a => a.slug === article.slug)
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        
        setCachedArticles(uniqueArticles)
      }
    } catch (error) {
      console.error('Failed to load cached articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Cached Articles</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (cachedArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cached Articles</h3>
        <p className="text-gray-600">
          Visit articles while online to cache them for offline reading.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Cached Articles ({cachedArticles.length})</h3>
        <Button 
          onClick={loadCachedArticles}
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </div>
      
      <div className="space-y-3">
        {cachedArticles.map((article) => (
          <div 
            key={article.slug}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <Link 
              href={`/articles/${article.slug}`}
              className="block group"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {article.description}
              </p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>By {article.author.username}</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          These articles are available offline. More content will appear here as you browse online.
        </p>
      </div>
    </div>
  )
}