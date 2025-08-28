import { Metadata } from 'next'
import { ArticlesList } from '@/components/articles/ArticlesList'

export const metadata: Metadata = {
  title: 'All Articles - Blog Platform',
  description: 'Browse all articles on our blog platform',
}

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          All Articles
        </h1>
        <p className="text-gray-600">
          Explore our complete collection of articles
        </p>
      </div>
      
      <ArticlesList />
    </div>
  )
}