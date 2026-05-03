'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, User, Sun, Moon, Menu } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname()
  const user = useAuthStore(state => state.user)

  const getBreadcrumb = () => {
    const parts = pathname.split('/').filter(Boolean)
    return parts.map((part, i) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      href: '/' + parts.slice(0, i + 1).join('/')
    }))
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
      {/* Mobile Menu Toggle */}
      <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={onMenuClick}>
        <Menu className="w-6 h-6" />
      </button>


      {/* Breadcrumbs */}

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Admin</span>
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-2">
            <span className="text-gray-700">/</span>
            <span className={i === breadcrumbs.length - 1 ? "text-white font-bold" : "text-gray-400"}>
              {crumb.label}
            </span>
          </div>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden md:block relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-pink transition-colors" />
          <input 
            placeholder="Quick search..." 
            className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white outline-none focus:border-brand-pink transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <Sun className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-pink rounded-full border-2 border-[#0a0a0f]" />
          </button>

          
          <div className="h-8 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user?.name || 'Admin'}</p>
              <p className="text-[10px] font-medium text-gray-500 uppercase">{user?.role || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold border-2 border-white/10">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
