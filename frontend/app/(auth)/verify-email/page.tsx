'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { authApi } from '@/lib/api/auth.api'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

function VerifyEmailContent() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token)
        setStatus('success')
      } catch (error) {
        setStatus('error')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-10 text-center flex flex-col items-center gap-8">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-16 h-16 text-brand-pink animate-spin" />
              <h1 className="text-2xl font-display font-bold text-white">Verifying Your Email</h1>
              <p className="text-gray-400">Please wait while we confirm your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h1 className="text-2xl font-display font-bold text-white">Email Verified!</h1>
              <p className="text-gray-400">Your account is now active. You can now sign in to access your dashboard.</p>
              <AnimatedButton onClick={() => router.push('/login')} className="w-full">
                Go to Login
              </AnimatedButton>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500" />
              <h1 className="text-2xl font-display font-bold text-white">Verification Failed</h1>
              <p className="text-gray-400">The verification link is invalid or has expired. Please try registering again or contact support.</p>
              <div className="flex flex-col gap-4 w-full">
                <AnimatedButton onClick={() => router.push('/register')} variant="outline" className="w-full">
                  Back to Register
                </AnimatedButton>
                <button className="text-sm text-brand-pink font-bold hover:underline">
                  Resend Verification Email
                </button>
              </div>
            </>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
