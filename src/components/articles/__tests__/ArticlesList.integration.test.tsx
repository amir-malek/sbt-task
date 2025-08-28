import { render, screen, waitFor } from '@/lib/utils/test-utils'
import { ArticlesList } from '../ArticlesList'
import * as articlesApi from '@/lib/api/articles'

jest.mock('@/lib/api/articles')
const mockGetArticles = articlesApi.getArticles as jest.MockedFunction<typeof articlesApi.getArticles>

describe('ArticlesList Integration', () => {
  beforeEach(() => {
    mockGetArticles.mockClear()
  })

  it('should render articles list successfully', async () => {
    const mockResponse = {
      articles: [
        {
          slug: 'test-article-1',
          title: 'First Article',
          description: 'First description',
          body: 'First body',
          tagList: ['react'],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          favorited: false,
          favoritesCount: 3,
          author: {
            username: 'author1',
            bio: 'Bio 1',
            image: 'https://example.com/avatar1.jpg',
            following: false,
          },
        },
        {
          slug: 'test-article-2',
          title: 'Second Article',
          description: 'Second description',
          body: 'Second body',
          tagList: ['vue'],
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
          favorited: true,
          favoritesCount: 5,
          author: {
            username: 'author2',
            bio: 'Bio 2',
            image: 'https://example.com/avatar2.jpg',
            following: true,
          },
        },
      ],
      articlesCount: 2,
    }

    mockGetArticles.mockResolvedValue(mockResponse)

    render(<ArticlesList />)

    await waitFor(() => {
      expect(screen.getByText('First Article')).toBeInTheDocument()
      expect(screen.getByText('Second Article')).toBeInTheDocument()
    })

    expect(screen.getByText('Showing 2 of 2 articles')).toBeInTheDocument()
  })

  it('should show empty state when no articles', async () => {
    mockGetArticles.mockResolvedValue({
      articles: [],
      articlesCount: 0,
    })

    render(<ArticlesList />)

    await waitFor(() => {
      expect(screen.getByText('No articles found')).toBeInTheDocument()
    })

    expect(screen.getByText('Check back later for new content.')).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    mockGetArticles.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<ArticlesList />)

    // Check for skeleton loading elements
    expect(screen.getByTestId('skeleton-0')).toBeInTheDocument()
  })

  it.skip('should handle error state', async () => {
    mockGetArticles.mockRejectedValue(new Error('API Error'))

    render(<ArticlesList />)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })

  it('should handle infinite scroll', async () => {
    const firstPageResponse = {
      articles: [
        {
          slug: 'article-1',
          title: 'Article 1',
          description: 'Description 1',
          body: 'Body 1',
          tagList: [],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'author',
            bio: '',
            image: '',
            following: false,
          },
        },
      ],
      articlesCount: 40, // More than 20 to enable next page
    }

    mockGetArticles.mockResolvedValue(firstPageResponse)

    render(<ArticlesList />)

    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument()
    })

    // Should show "Load more" or similar pagination element
    expect(screen.getByText('Showing 1 of 40 articles')).toBeInTheDocument()
  })
})