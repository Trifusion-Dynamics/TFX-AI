'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(data)
      login(res.data.data.user, res.data.data.access_token)
      toast.success('Welcome back!')
      
      if (res.data.data.user.role === 'admin') {
        router.push('/admin')


      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-pink/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-xl">T</div>
          <span className="text-2xl font-display font-black text-white group-hover:text-brand-pink transition-colors">TFX AI</span>
        </Link>

        <GlassCard className="p-8 md:p-10 border-brand-pink/20">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your TFX AI account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input 
                {...register('email')}
                autoFocus
                placeholder="name@example.com"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                  errors.email && "border-red-500"
                )}
              />
              {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Password
                </label>
                <Link href="/forgot-password" className="text-xs text-brand-pink hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all pr-12",
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

            <AnimatedButton 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-brand text-white py-4 font-bold flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </AnimatedButton>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-brand-pink font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
