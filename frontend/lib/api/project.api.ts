import api from './axios'
import { ApiResponse, Project } from '@/types'

export const projectApi = {
  getAll: (params?: any) => api.get<ApiResponse<Project[]>>('/projects', { params }),
  getFeatured: () => api.get<ApiResponse<Project[]>>('/projects/featured'),
  getBySlug: (slug: string) => api.get<ApiResponse<Project>>(`/projects/${slug}`)
}
