import { getArticles, getArticle } from '../articles'
import { apiRequest } from '../client'

jest.mock('../client')
const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>

describe('Articles API', () => {
  beforeEach(() => {
    mockApiRequest.mockClear()
  })

  describe('getArticles', () => {
    it('should fetch articles with default parameters', async () => {
      const mockResponse = {
        articles: [],
        articlesCount: 0,
      }
      mockApiRequest.mockResolvedValue(mockResponse)

      const result = await getArticles()

      expect(mockApiRequest).toHaveBeenCalledWith('/articles')
      expect(result).toEqual(mockResponse)
    })

    it('should include query parameters', async () => {
      const mockResponse = {
        articles: [],
        articlesCount: 0,
      }
      mockApiRequest.mockResolvedValue(mockResponse)

      await getArticles({
        limit: 10,
        offset: 20,
        tag: 'react',
        author: 'john',
      })

      expect(mockApiRequest).toHaveBeenCalledWith(
        '/articles?limit=10&offset=20&tag=react&author=john'
      )
    })
  })

  describe('getArticle', () => {
    it('should fetch single article by slug', async () => {
      const mockResponse = {
        article: {
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
      }
      mockApiRequest.mockResolvedValue(mockResponse)

      const result = await getArticle('test-article')

      expect(mockApiRequest).toHaveBeenCalledWith('/articles/test-article')
      expect(result).toEqual(mockResponse)
    })
  })
})