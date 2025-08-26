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
      throw new ApiError(
        `HTTP ${response.status}`,
        response.status,
        await response.json().catch(() => ({}))
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network connection failed', 0)
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0
    )
  }
}