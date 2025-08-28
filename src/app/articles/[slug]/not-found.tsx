import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Article Not Found
      </h1>
      <p className="text-gray-600 mb-8">
        Sorry, we couldn't find the article you're looking for.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/articles">Browse Articles</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
