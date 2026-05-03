import api from './axios'
import { ApiResponse, CaseStudy } from '@/types'

export const caseStudyApi = {
  getAll: (params?: any) => api.get<ApiResponse<CaseStudy[]>>('/case-studies', { params }),
  getFeatured: () => api.get<ApiResponse<CaseStudy[]>>('/case-studies/featured'),
  getBySlug: (slug: string) => api.get<ApiResponse<CaseStudy>>(`/case-studies/${slug}`),
  getIndustries: () => api.get<ApiResponse<string[]>>('/case-studies/industries')
}
