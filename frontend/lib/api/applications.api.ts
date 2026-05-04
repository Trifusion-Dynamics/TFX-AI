/**
 * API functions for job applications
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Application {
  id: string
  job_id: string
  full_name: string
  email: string
  phone: string
  resume_url: string
  cover_letter: string
  status: string
  created_at: string
  job?: {
    id: string
    title: string
  }
}

export const applicationsApi = {
  // Get all applications (admin only)
  async getApplications(): Promise<Application[]> {
    const response = await fetch(`${API_URL}/api/v1/jobs/admin/applications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications')
    }
    
    const data = await response.json()
    return data.data || data
  },

  // Get single application (admin only)
  async getApplication(id: string): Promise<Application> {
    const response = await fetch(`${API_URL}/api/v1/jobs/admin/applications/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch application')
    }
    
    const data = await response.json()
    return data.data
  },

  // Update application status (admin only)
  async updateApplicationStatus(id: string, status: string): Promise<Application> {
    const response = await fetch(`${API_URL}/api/v1/jobs/admin/applications/${id}?status=${status}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to update application status')
    }
    
    const data = await response.json()
    return data.data
  },

  // Delete application (admin only)
  async deleteApplication(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/jobs/admin/applications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete application')
    }
  },

  // Submit job application (public)
  async submitApplication(jobId: string, applicationData: {
    full_name: string
    email: string
    phone: string
    resume_url: string
    cover_letter: string
  }): Promise<Application> {
    const response = await fetch(`${API_URL}/api/v1/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit application')
    }
    
    const data = await response.json()
    return data.data
  }
}
