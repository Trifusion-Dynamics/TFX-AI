import api from './axios'

export const aiToolsApi = {
  analyzeResume: (data: { text: string }) => api.post('/ai-tools/resume-analyzer', data),
  generateText: (data: { topic: string; type: string; tone: string; length: string }) => api.post('/ai-tools/text-generator', data),
  askBot: (data: { question: string; context?: string }) => api.post('/ai-tools/qa-bot', data)
}
