"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AuthorAvatar } from "@/components/common/AuthorAvatar";
import { formatDate } from "@/lib/utils/formatDate";
import type { Article } from "@/types";

interface ArticleDetailProps {
  article: Article;
}


function ArticleBody({
  body,
  articleSlug,
}: {
  body: string;
  articleSlug: string;
}) {
  const paragraphs = useMemo(() => {
    return body
      .split(/\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [body]);

  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => (
        <p key={`${articleSlug}-${index}`} className="mb-4">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600 mb-6">{article.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <AuthorAvatar author={article.author} size="large" />
            <div>
              <div className="font-medium text-gray-900">
                {article.author.username}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(article.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Heart className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {article.favoritesCount}
            </span>
          </div>
        </div>

        {article.tagList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tagList.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <ArticleBody body={article.body} articleSlug={article.slug} />
    </article>
  );
}
