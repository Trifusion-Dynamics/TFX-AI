import api from './axios'
import { ApiResponse, BlogPost, PaginatedResponse } from '@/types'

export const blogApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; tag?: string; search?: string }) =>
    api.get<PaginatedResponse<BlogPost>>('/blogs', { params }),
  getFeatured: () => api.get<ApiResponse<BlogPost[]>>('/blogs/featured'),
  getBySlug: (slug: string) => api.get<ApiResponse<BlogPost>>(`/blogs/${slug}`),
  getCategories: () => api.get<ApiResponse<string[]>>('/blogs/categories'),
  getTags: () => api.get<ApiResponse<string[]>>('/blogs/tags')
}
