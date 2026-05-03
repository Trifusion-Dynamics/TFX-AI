import api from './axios'
import { ApiResponse } from '@/types'

export const adminApi = {
  getStats: () => api.get<ApiResponse<any>>('/admin/stats'),
  
  // Leads
  getLeads: (params?: any) => api.get<ApiResponse<any>>('/admin/leads', { params }),
  updateLeadStatus: (id: string, status: string) => api.patch(`/admin/leads/${id}/status`, { status }),
  deleteLead: (id: string) => api.delete(`/admin/leads/${id}`),

  // Users
  getUsers: (params?: any) => api.get<ApiResponse<any>>('/admin/users', { params }),
  updateUserRole: (id: string, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Generic Content (simplified for now)
  getItems: (type: string, params?: any) => api.get<ApiResponse<any>>(`/admin/${type}`, { params }),
  createItem: (type: string, data: any) => api.post<ApiResponse<any>>(`/admin/${type}`, data),
  updateItem: (type: string, id: string, data: any) => api.patch<ApiResponse<any>>(`/admin/${type}/${id}`, data),
  deleteItem: (type: string, id: string) => api.delete(`/admin/${type}/${id}`),
}
