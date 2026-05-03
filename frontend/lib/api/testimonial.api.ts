import api from './axios'
import { ApiResponse, Testimonial } from './../../types'

export const testimonialApi = {
  getAll: () => api.get<ApiResponse<Testimonial[]>>('/testimonials')
}