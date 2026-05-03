import api from './axios'
import { ApiResponse, PricingPlan } from '@/types'

export const pricingApi = {
  getAll: () => api.get<ApiResponse<PricingPlan[]>>('/pricing'),
  getBySlug: (slug: string) => api.get<ApiResponse<PricingPlan>>(`/pricing/${slug}`)
}
