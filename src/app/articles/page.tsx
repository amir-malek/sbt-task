import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ArticlesList from '@/components/articles/ArticlesList'

export default function ArticlesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Articles</h1>
        <ArticlesList />
      </main>
      <Footer />
    </div>
  )
}