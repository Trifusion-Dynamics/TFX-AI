'use client'

import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { registerSchema, RegisterFormData } from '@/lib/validations/auth.schema'
import { authApi } from '@/lib/api/auth.api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeTerms: false }
  })

  const password = useWatch({ control, name: 'password' }) || ''
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-500' })

  useEffect(() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-red-400' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ]
    setPasswordStrength({ score, ...levels[score] })
  }, [password])

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await authApi.register(data)
      setRegisteredEmail(data.email)
      setIsSuccess(true)
      toast.success('Registration successful!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-pink/10 rounded-full blur-[120px] -z-10" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="form" exit={{ scale: 0.9, opacity: 0 }}>
              <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-xl">T</div>
                <span className="text-2xl font-display font-black text-white group-hover:text-brand-pink transition-colors">TFX AI</span>
              </Link>

              <GlassCard className="p-8 md:p-10 border-brand-pink/20">
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
                  <p className="text-gray-400">Join our community of innovators</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        {...register('name')}
                        autoFocus
                        placeholder="John Doe"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                          errors.name && "border-red-500"
                        )}
                      />
                    </div>
                    {errors.name && <span className="text-[10px] text-red-500 ml-1">{errors.name.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        {...register('email')}
                        placeholder="name@example.com"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                          errors.email && "border-red-500"
                        )}
                      />
                    </div>
                    {errors.email && <span className="text-[10px] text-red-500 ml-1">{errors.email.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={cn(
                          "w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                          errors.password && "border-red-500"
                        )}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength Indicator */}
                    {password && (
                      <div className="px-1 pt-2 space-y-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className={cn("h-1 flex-1 rounded-full transition-all", step <= passwordStrength.score ? passwordStrength.color : "bg-white/10")} />
                          ))}
                        </div>
                        <p className={cn("text-[10px] font-bold uppercase", passwordStrength.color.replace('bg-', 'text-'))}>{passwordStrength.label}</p>
                      </div>
                    )}
                    {errors.password && <span className="text-[10px] text-red-500 ml-1">{errors.password.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Confirm Password</label>
                    <input 
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink transition-all",
                        errors.confirmPassword && "border-red-500"
                      )}
                    />
                    {errors.confirmPassword && <span className="text-[10px] text-red-500 ml-1">{errors.confirmPassword.message}</span>}
                  </div>

                  <div className="flex items-start gap-3 px-1 pt-2">
                    <input 
                      {...register('agreeTerms')}
                      type="checkbox" 
                      id="terms"
                      className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-brand-pink focus:ring-brand-pink"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed">
                      I agree to the <Link href="/terms" className="text-brand-pink font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-brand-pink font-bold">Privacy Policy</Link>
                    </label>
                  </div>
                  {errors.agreeTerms && <p className="text-[10px] text-red-500 ml-1">{errors.agreeTerms.message}</p>}

                  <AnimatedButton 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-brand text-white py-4 font-bold flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                  </AnimatedButton>
                </form>

                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand-pink font-bold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <GlassCard className="p-10 border-green-500/20 text-center flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-green-500 animate-bounce" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white">Check Your Email</h2>
                <p className="text-gray-400">
                  We&apos;ve sent a verification link to <span className="text-white font-bold">{registeredEmail}</span>. Please click the link to activate your account.
                </p>
                <div className="pt-4 flex flex-col gap-4 w-full">
                  <AnimatedButton onClick={() => router.push('/login')} variant="outline" className="w-full">
                    Go to Login
                  </AnimatedButton>
                  <button className="text-xs text-gray-500 hover:text-white transition-colors">
                    Didn&apos;t receive the email? <span className="text-brand-pink font-bold">Resend Email (60s)</span>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
