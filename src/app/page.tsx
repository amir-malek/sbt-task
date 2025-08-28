import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArticlesList } from '@/components/articles/ArticlesList'

export const metadata: Metadata = {
  title: 'Blog Platform - Latest Articles',
  description: 'Discover the latest articles and insights',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Blog Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover insightful articles and join our community of writers and readers
          </p>
          <Button asChild size="lg">
            <Link href="/articles">
              Browse Articles
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Latest Articles
          </h2>
          <p className="text-gray-600">
            Check out our most recent posts
          </p>
        </div>
        
        <ArticlesList />
      </div>
    </div>
  )
}