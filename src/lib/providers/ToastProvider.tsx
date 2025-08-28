'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { toast } from 'sonner'

interface Toast {
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  addToast: (toast: Toast) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const addToast = ({ title, description, type }: Toast) => {
    const message = description ? `${title}: ${description}` : title
    
    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'info':
        toast.info(message)
        break
      default:
        toast(message)
    }
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      console.error('useToast must be used within a ToastProvider')
    }
    // Provide fallback for production to prevent crashes
    return { addToast: () => {} }
  }
  return context
}