import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Blog Platform
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/articles" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Articles
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}