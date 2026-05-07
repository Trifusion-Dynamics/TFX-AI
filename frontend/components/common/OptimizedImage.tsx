'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  lazy?: boolean
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = 'https://picsum.photos/seed/fallback/800/600.jpg',
  lazy = true,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    console.log(`Image failed to load: ${imgSrc}, trying fallback`)
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(true)
      setTimeout(() => setHasError(false), 1000) // Clear error state after showing fallback
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading skeleton - simpler */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
      
      {/* Error state - simpler */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-gray-400 text-sm">Loading image...</div>
          </div>
        </div>
      )}
      
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        priority={priority}
        quality={85}
        unoptimized={false}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'duration-300 ease-in-out',
          isLoading ? 'opacity-50' : 'opacity-100',
          className
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
