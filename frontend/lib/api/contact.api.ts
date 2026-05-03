import api from './axios'

export const contactApi = {
  submit: (data: any) => api.post('/contact', data)
}
