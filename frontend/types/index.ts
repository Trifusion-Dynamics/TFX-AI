export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  avatar?: string
  is_verified: boolean
  created_at: string
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  short_desc: string
  icon: string
  features: string[]
  is_active: boolean
  order: number
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  short_desc: string
  thumbnail: string
  images: string[]
  tech_stack: string[]
  category: string
  live_url?: string
  github_url?: string
  is_featured: boolean
  is_published: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  tags: string[]
  category: string
  is_published: boolean
  is_featured: boolean
  views: number
  read_time: number
  created_at: string
}

export interface BlogPostDetail extends BlogPost {
  content: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar?: string
  content: string
  rating: number
}

export interface PricingPlan {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: string
  billing_cycle: 'monthly' | 'yearly' | 'once'
  features: string[]
  is_popular: boolean
  is_active: boolean
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  client_name: string
  industry: string
  thumbnail: string
  problem: string
  solution: string
  result: string
  tech_stack: string[]
  metrics: { label: string; value: string }[]
  images?: string[]
}


export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'contacted' | 'resolved'
  created_at: string
}

export interface Newsletter {
  id: string
  email: string
  is_active: boolean
  subscribed_at: string
}

export interface LoginResponse {
  user: User
  access_token: string
}

