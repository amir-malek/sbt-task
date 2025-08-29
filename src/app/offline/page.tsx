import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ConnectionStatus } from '@/components/common/ConnectionStatus'
import { CachedArticlesList } from '@/components/common/CachedArticlesList'
import { ReloadButton } from '@/components/common/ReloadButton'

export const metadata: Metadata = {
  title: 'You are offline - Blog Platform',
  description: 'No internet connection detected. View cached content below.',
}

export default function OfflinePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ConnectionStatus />
      
      <div className="text-center mb-8">
        <div className="text-6xl mb-6">!</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're offline
        </h1>
        <p className="text-gray-600 mb-6">
          Your internet connection is unavailable, but you can still access cached content below.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center mb-8">
          <Button asChild>
            <Link href="/">
              Try Homepage
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/articles">
              All Articles
            </Link>
          </Button>
          <ReloadButton />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <CachedArticlesList />
      </div>
    </div>
  )
}