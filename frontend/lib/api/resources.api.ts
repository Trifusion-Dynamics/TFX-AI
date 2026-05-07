import api from './axios'
import { Resource, ResourceDownloadRequest } from '@/types'

export const resourcesApi = {
  getList: () => 
    api.get('/resources/list'),
  
  requestDownload: (data: ResourceDownloadRequest) =>
    api.post('/resources/download-request', data),
  
  getDownloadUrl: (resourceId: string, token: string) =>
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/resources/download/${resourceId}?token=${token}`,
  
  checkTokenStatus: (token: string) =>
    api.get(`/resources/token-status/${token}`)
}
