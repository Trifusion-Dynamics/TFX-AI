'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { useAuthStore } from '@/lib/store/authStore'
import { authApi } from '@/lib/api/auth.api'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Mail, Shield, LogOut, Settings, ExternalLink, Zap, Brain, BookOpen, Trash2, Edit3, CheckCircle, MessageCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function UserDashboard() {
  const { user, logout, setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(user?.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      const res = await authApi.updateProfile({ name: newName })
      setUser(res.data.data)
      setIsEditing(false)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              Welcome back, <span className="text-brand-pink">{user.name}</span>! 👋
            </h1>
            <p className="text-gray-400">Manage your account and explore our AI solutions.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-8 border-brand-pink/20">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-brand-pink/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {isEditing ? (
                  <div className="w-full space-y-4">
                    <input 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-brand-pink"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleUpdateProfile} disabled={isLoading} className="flex-1 py-2 bg-brand-pink text-white rounded-lg text-sm font-bold">
                        Save
                      </button>
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-white/5 text-gray-400 rounded-lg text-sm font-bold">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-display font-bold text-white mb-1 flex items-center gap-2">
                      {user.name} <CheckCircle className="w-5 h-5 text-blue-400" />
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-brand-pink font-bold flex items-center gap-1 hover:underline"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Profile
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <ProfileItem icon={<Mail className="w-4 h-4" />} label="Email Status" value="Verified" valueClass="text-green-500" />
                <ProfileItem icon={<Shield className="w-4 h-4" />} label="Account Role" value={user.role} valueClass="text-brand-purple" />
                <ProfileItem icon={<Zap className="w-4 h-4" />} label="Plan" value="Basic Free" />
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-red-500/20 bg-red-500/5">
               <h4 className="text-red-500 font-bold text-sm mb-4 flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" /> Danger Zone
               </h4>
               <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                 Deleting your account will permanently remove all your data. This action cannot be undone.
               </p>
               <button className="w-full py-3 rounded-xl border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                 <Trash2 className="w-4 h-4" /> Delete Account
               </button>
            </GlassCard>
          </div>

          {/* Quick Actions & Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <QuickActionCard 
                title="AI Tools" 
                desc="Try our text generators and resume analyzers."
                icon={<Brain className="w-8 h-8 text-brand-pink" />}
                href="/ai-tools"
              />
              <QuickActionCard 
                title="Project Inquiry" 
                desc="Need a custom solution? Talk to our experts."
                icon={<MessageCircle className="w-8 h-8 text-brand-purple" />}
                href="/contact"
              />
              <QuickActionCard 
                title="Latest Articles" 
                desc="Read our latest insights on AI and Web."
                icon={<BookOpen className="w-8 h-8 text-brand-blue" />}
                href="/blog"
              />
              <QuickActionCard 
                title="Account Settings" 
                desc="Update your security and notifications."
                icon={<Settings className="w-8 h-8 text-brand-yellow" />}
                href="/settings"
              />
            </div>

            <GlassCard className="p-8">
              <h3 className="text-xl font-display font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <ActivityItem label="Logged in" time="Just now" />
                <ActivityItem label="Profile updated" time="2 hours ago" />
                <ActivityItem label="AI Tool used: Text Generator" time="Yesterday" />
              </div>
              <button className="mt-6 text-sm text-gray-500 hover:text-white transition-colors w-full text-center">
                View All Activity
              </button>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  )
}

function ProfileItem({ icon, label, value, valueClass }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3 text-gray-400">
        {icon} <span>{label}</span>
      </div>
      <span className={cn("font-bold", valueClass || "text-white")}>{value}</span>
    </div>
  )
}

function QuickActionCard({ title, desc, icon, href }: any) {
  return (
    <a href={href}>
      <GlassCard hover className="p-8 border-white/5 h-full group">
        <div className="mb-6 group-hover:scale-110 transition-transform">{icon}</div>
        <h4 className="text-lg font-display font-bold text-white mb-2 group-hover:text-brand-pink transition-colors">{title}</h4>
        <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-brand-pink uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
          Explore Now <ExternalLink className="w-3 h-3" />
        </div>
      </GlassCard>
    </a>
  )
}

function ActivityItem({ label, time }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <span className="text-sm text-gray-300">{label}</span>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  )
}


