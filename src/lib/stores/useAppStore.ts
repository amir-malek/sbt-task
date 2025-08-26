import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  // UI State
  isLoading: boolean
  error: string | null
  
  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      isLoading: false,
      error: null,
      
      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-store',
    }
  )
)