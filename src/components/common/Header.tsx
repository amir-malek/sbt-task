import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link href="/articles" className="text-2xl font-bold hover:text-primary transition-colors">
            Blog Platform
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/articles" 
              className="text-sm font-medium hover:text-primary transition-colors"
              aria-label="View all articles"
            >
              Articles
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}