"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";
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
}: {
  body: string;
}) {
  // Sanitize the markdown content for security
  const sanitizedBody = useMemo(() => {
    if (typeof window === 'undefined') {
      // Server-side: return as-is for initial render
      return body;
    }
    // Client-side: sanitize HTML that might be in the markdown
    return DOMPurify.sanitize(body);
  }, [body]);

  return (
    <div className="prose prose-lg prose-gray max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom component overrides can go here if needed
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-8">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-5">{children}</h3>
          ),
          code: ({ children, className, ...props }) => {
            const inline = !className;
            return inline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 italic text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
        }}
      >
        {sanitizedBody}
      </ReactMarkdown>
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

      <ArticleBody body={article.body} />
    </article>
  );
}
