'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations/auth.schema'
import { authApi } from '@/lib/api/auth.api'
import Link from 'next/link'
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword(data.email)
      setIsSuccess(true)
      toast.success('Reset link sent!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 md:p-10 border-brand-purple/20">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div key="form" exit={{ opacity: 0 }}>
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-display font-bold text-white mb-2">Forgot Password?</h1>
                  <p className="text-gray-400">Enter your email and we&apos;ll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                    <input 
                      {...register('email')}
                      placeholder="name@example.com"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                        errors.email && "border-red-500"
                      )}
                    />
                    {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
                  </div>

                  <AnimatedButton 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-brand text-white py-4 font-bold flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </AnimatedButton>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="w-20 h-20 rounded-full bg-brand-pink/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-brand-pink" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-4">Check Your Inbox</h2>
                <p className="text-gray-400 mb-8">
                  We&apos;ve sent a password reset link to your email. Please follow the instructions to reset your password.
                </p>
                <AnimatedButton href="/login" variant="outline" className="w-full">
                  Back to Login
                </AnimatedButton>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
