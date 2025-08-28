import { apiRequest, ApiError } from '../client'

// Mock fetch globally
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('apiRequest', () => {
    it('should make successful GET request', async () => {
      const mockData = { message: 'success' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await apiRequest('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.realworld.show/api/test',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      expect(result).toEqual(mockData)
    })

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      } as Response)

      await expect(apiRequest('/test')).rejects.toThrow(ApiError)
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiRequest('/test')).rejects.toThrow(ApiError)
    })

    it('should include custom headers', async () => {
      const mockData = { message: 'success' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      await apiRequest('/test', {
        headers: {
          Authorization: 'Bearer token',
        },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.realworld.show/api/test',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
        })
      )
    })

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      } as Response)

      await expect(apiRequest('/test')).rejects.toThrow(ApiError)
    })

    it('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      } as Response)

      const result = await apiRequest('/test')
      expect(result).toBeNull()
    })

    it('should handle timeout scenarios', async () => {
      mockFetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )

      await expect(apiRequest('/test')).rejects.toThrow(ApiError)
    })
  })
})