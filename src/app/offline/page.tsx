import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'You are offline - Blog Platform',
  description: 'No internet connection detected',
}

export default function OfflinePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're offline
        </h1>
        <p className="text-gray-600 mb-8">
          Check your internet connection and try again. Some previously visited pages may still be available.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/articles">
              Browse Cached Articles
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}