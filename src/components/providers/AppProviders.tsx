'use client'

import { useEffect } from 'react'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import { ToastProvider, useToast } from '@/lib/providers/ToastProvider'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/common/Header'
import { PWAInstallPrompt } from '@/components/common/PWAInstallPrompt'
import { setGlobalToastHandler } from '@/lib/api/client'

function ToastSetup() {
  const { addToast } = useToast()

  // Set global toast handler for API client
  useEffect(() => {
    setGlobalToastHandler(addToast)
  }, [addToast])

  return null
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <QueryProvider>
        <ToastSetup />
        {children}
        <Toaster />
        <PWAInstallPrompt />
      </QueryProvider>
    </ToastProvider>
  )
}