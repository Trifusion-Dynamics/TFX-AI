import api from './axios'
import { ApiResponse, Service } from '@/types'

export const serviceApi = {
  getAll: () => api.get<ApiResponse<Service[]>>('/services'),
  getBySlug: (slug: string) => api.get<ApiResponse<Service>>(`/services/${slug}`)
}
