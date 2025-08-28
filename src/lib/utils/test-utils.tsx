import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/lib/providers/ToastProvider'

// Create a test query client with no retries and no cache time
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  })

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  // Allow additional provider props if needed in the future
  providerProps?: Record<string, unknown>
}

function AllTheProviders({ children, queryClient }: { children: React.ReactNode; queryClient?: QueryClient }) {
  const client = queryClient || createTestQueryClient()
  
  return (
    <ToastProvider>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </ToastProvider>
  )
}

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { queryClient, ...renderOptions } = options
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>,
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }