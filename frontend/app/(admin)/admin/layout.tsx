'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const [collapsed, setCollapsed] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {

      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, user, router])

  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="w-12 h-12 text-brand-pink animate-spin" />
      </div>
    )
  }

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      
      <main className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        collapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <AdminHeader onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />
        
        <div className="p-4 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key="admin-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

