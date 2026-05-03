import api from './axios'
import { ApiResponse, LoginResponse, User } from '@/types'

export const authApi = {
  login: (data: any) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),
  register: (data: any) => api.post<ApiResponse<User>>('/auth/register', data),
  verifyEmail: (token: string) => api.get<ApiResponse<any>>(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string) => api.post<ApiResponse<any>>('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post<ApiResponse<any>>('/auth/reset-password', data),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),
  updateProfile: (data: any) => api.patch<ApiResponse<User>>('/auth/profile', data),
}
