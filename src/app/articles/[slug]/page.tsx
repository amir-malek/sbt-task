import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleDetail } from "@/components/articles/ArticleDetail";
import { CommentsList } from "@/components/comments/CommentsList";
import { getArticleSsr } from "@/lib/api/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await getArticleSsr(slug);

    if (!response) {
      return {
        title: "Article Not Found",
      };
    }

    const { article } = response;

    return {
      title: `${article.title} - Blog Platform`,
      description: article.description,
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        authors: [article.author.username],
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt,
      },
    };
  } catch (error) {
    return {
      title: "Article Not Found",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const response = await getArticleSsr(slug);

  if (!response) {
    notFound();
  }

  const { article } = response;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/articles">Back to Articles</Link>
        </Button>
      </div>

      <ArticleDetail article={article} />

      <div className="border-t border-gray-200 mt-12">
        <CommentsList articleSlug={slug} />
      </div>
    </div>
  );
}

// Enable ISR for article pages
export const revalidate = 3600;
