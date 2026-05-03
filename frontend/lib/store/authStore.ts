import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) => {
        // Set cookies for middleware
        document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`
        document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`
        set({ user, accessToken: token, isAuthenticated: true, isLoading: false })
      },
      logout: () => {
        // Clear cookies
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false })
      },
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

