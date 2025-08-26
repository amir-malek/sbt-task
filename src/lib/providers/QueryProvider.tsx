'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (error instanceof Error && 'status' in error) {
                const status = error.status as number
                // Don't retry client errors except for specific cases
                if (status === 401 || status === 403 || status === 404) {
                  return false
                }
                // Retry only for server errors and specific client errors
                if (status >= 500 || status === 408 || status === 429) {
                  return failureCount < 3
                }
              }
              // Retry network errors
              if (error instanceof TypeError) {
                return failureCount < 3
              }
              return false
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}