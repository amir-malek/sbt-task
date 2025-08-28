import { API_BASE_URL } from '../utils/constants'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Global toast handler - will be set by the app
let globalToastHandler: ((toast: { title: string; description?: string; type: 'success' | 'error' | 'info' }) => void) | null = null

export function setGlobalToastHandler(handler: typeof globalToastHandler) {
  globalToastHandler = handler
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error = new ApiError(
        `HTTP ${response.status}`,
        response.status,
        errorData
      )

      // Show error toast for client-side requests
      if (typeof window !== 'undefined' && globalToastHandler) {
        globalToastHandler({
          title: 'Something went wrong',
          description: `Failed to ${options.method || 'GET'} ${endpoint}`,
          type: 'error'
        })
      }

      throw error
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const networkError = new ApiError('Network connection failed', 0)
      
      // Show network error toast for client-side requests
      if (typeof window !== 'undefined' && globalToastHandler) {
        globalToastHandler({
          title: 'Network Error',
          description: 'Please check your connection and try again',
          type: 'error'
        })
      }
      
      throw networkError
    }
    
    const unknownError = new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0
    )

    // Show error toast for client-side requests
    if (typeof window !== 'undefined' && globalToastHandler) {
      globalToastHandler({
        title: 'Unexpected Error',
        description: 'Something went wrong',
        type: 'error'
      })
    }
    
    throw unknownError
  }
}