'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  if (isInstalled || !installPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm z-40">
      <h4 className="font-medium text-gray-900 mb-2">Install Blog Platform</h4>
      <p className="text-sm text-gray-600 mb-3">
        Install our app for faster access and offline reading
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleInstallClick}>
          Install
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => setInstallPrompt(null)}
        >
          Not now
        </Button>
      </div>
    </div>
  )
}