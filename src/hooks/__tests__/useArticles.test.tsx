import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useArticles } from '../useArticles'
import * as articlesApi from '@/lib/api/articles'

jest.mock('@/lib/api/articles')
const mockGetArticles = articlesApi.getArticles as jest.MockedFunction<typeof articlesApi.getArticles>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  })
  
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useArticles', () => {
  beforeEach(() => {
    mockGetArticles.mockClear()
  })

  it('should fetch articles successfully', async () => {
    const mockResponse = {
      articles: [
        {
          slug: 'test-article',
          title: 'Test Article',
          description: 'Test description',
          body: 'Test body',
          tagList: [],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'test',
            bio: '',
            image: '',
            following: false,
          },
        },
      ],
      articlesCount: 1,
    }

    mockGetArticles.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.pages[0]).toEqual(mockResponse)
  })

  it.skip('should handle errors', async () => {
    mockGetArticles.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should apply filters correctly', async () => {
    const mockResponse = { articles: [], articlesCount: 0 }
    mockGetArticles.mockResolvedValue(mockResponse)

    const filters = { tag: 'react', author: 'john' }
    renderHook(() => useArticles(filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(mockGetArticles).toHaveBeenCalledWith({
        ...filters,
        limit: 20,
        offset: 0,
      })
    })
  })

  it('should handle infinite scroll pagination', async () => {
    const mockFirstPage = {
      articles: [{ slug: 'article-1' }],
      articlesCount: 40,
    }

    const mockSecondPage = {
      articles: [{ slug: 'article-2' }],
      articlesCount: 40,
    }

    mockGetArticles
      .mockResolvedValueOnce(mockFirstPage)
      .mockResolvedValueOnce(mockSecondPage)

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Fetch next page
    if (result.current.hasNextPage) {
      result.current.fetchNextPage()
    }

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2)
    })

    expect(mockGetArticles).toHaveBeenCalledTimes(2)
    expect(mockGetArticles).toHaveBeenNthCalledWith(2, {
      limit: 20,
      offset: 20,
    })
  })
})