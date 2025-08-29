'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Article } from '@/types/api'

interface AuthorAvatarProps {
  author: Article['author']
  size?: 'small' | 'medium' | 'large'
  showGradient?: boolean
}

const sizeClasses = {
  small: 'h-8 w-8',
  medium: 'h-10 w-10',
  large: 'h-12 w-12'
}

const textSizeClasses = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base'
}

export function AuthorAvatar({ 
  author, 
  size = 'small', 
  showGradient = true 
}: AuthorAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const fallbackClasses = showGradient
    ? 'bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold'
    : 'bg-gray-300 text-gray-600 font-medium'

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200`}>
      {author.image && !imageError ? (
        <Image
          src={author.image}
          alt={author.username}
          fill
          className={`object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${textSizeClasses[size]} ${fallbackClasses}`}>
          {author.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}