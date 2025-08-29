'use client'

import { useEffect, useState } from 'react'

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastOnline, setLastOnline] = useState<Date | null>(null)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      setLastOnline(null)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setLastOnline(new Date())
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-orange-500">!</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-orange-700">
            You're currently offline
            {lastOnline && (
              <span className="block text-xs text-orange-600">
                Last online: {lastOnline.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}