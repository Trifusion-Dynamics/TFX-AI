'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, RefreshCcw, AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-black text-white">Something went wrong!</h1>
          <p className="text-gray-400">
            An unexpected error occurred. Don&apos;t worry, we&apos;ve been notified and are looking into it.
          </p>
          {error.digest && (
            <code className="block p-3 bg-white/5 rounded text-[10px] text-gray-500 font-mono">
              Error ID: {error.digest}
            </code>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button
            onClick={reset}
            className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCcw className="w-5 h-5" /> Try Again
          </button>
          <Link
            href="/"
            className="flex-1 px-8 py-4 bg-gradient-brand text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-5 h-5" /> Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}
