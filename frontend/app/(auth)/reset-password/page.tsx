'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations/auth.schema'
import { authApi } from '@/lib/api/auth.api'
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

function ResetPasswordContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return toast.error('Invalid reset link')
    setIsLoading(true)
    try {
      await authApi.resetPassword({ token, password: data.password })
      toast.success('Password reset successfully!')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 md:p-10 border-brand-yellow/20">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">Create a new strong password for your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 ml-1">New Password</label>
              <div className="relative">
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                    errors.password && "border-red-500"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 ml-1">Confirm New Password</label>
              <input 
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                  errors.confirmPassword && "border-red-500"
                )}
              />
              {errors.confirmPassword && <span className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</span>}
            </div>

            <AnimatedButton 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-brand text-white py-4 font-bold flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {isLoading ? 'Resetting...' : 'Update Password'}
            </AnimatedButton>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
