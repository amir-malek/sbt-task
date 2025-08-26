import { notFound } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ArticleDetail from '@/components/articles/ArticleDetail'
import CommentsList from '@/components/comments/CommentsList'
import { getArticle } from '@/lib/api/articles'

interface ArticlePageProps {
  params: { slug: string }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const { article } = await getArticle(params.slug)
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ArticleDetail article={article} />
            <div className="mt-12 pt-8 border-t">
              <CommentsList articleSlug={article.slug} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  } catch {
    notFound()
  }
}