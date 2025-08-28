import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers/AppProviders'
import { Header } from '@/components/common/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog Platform',
  description: 'A simple blog platform showcasing clean architecture',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AppProviders>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
