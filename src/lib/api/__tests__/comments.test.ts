import { getComments } from '../comments'
import { apiRequest } from '../client'

jest.mock('../client')
const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>

describe('Comments API', () => {
  beforeEach(() => {
    mockApiRequest.mockClear()
  })

  describe('getComments', () => {
    it('should fetch comments for an article', async () => {
      const mockResponse = {
        comments: [
          {
            id: 1,
            body: 'Great article!',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            author: {
              username: 'testuser',
              bio: 'Test user',
              image: 'https://example.com/avatar.jpg',
              following: false,
            },
          },
        ],
      }
      mockApiRequest.mockResolvedValue(mockResponse)

      const result = await getComments('test-article')

      expect(mockApiRequest).toHaveBeenCalledWith('/articles/test-article/comments')
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty comments response', async () => {
      const mockResponse = {
        comments: [],
      }
      mockApiRequest.mockResolvedValue(mockResponse)

      const result = await getComments('test-article')

      expect(result.comments).toHaveLength(0)
    })
  })
})