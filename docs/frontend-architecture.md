# ⚛️ Frontend Architecture Documentation

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [📁 Project Structure](#-project-structure)
- [🔄 Component Architecture](#-component-architecture)
- [🎨 UI/UX Design System](#-ux-design-system)
- [🗃️ State Management](#️-state-management)
- [🛣️ Routing & Navigation](#️-routing--navigation)
- [🔗 API Integration](#-api-integration)
- [📝 Forms & Validation](#-forms--validation)
- [🎭 Performance Optimization](#-performance-optimization)
- [🔍 Error Handling](#-error-handling)
- [🧪 Testing Strategy](#-testing-strategy)

## 🏗️ Architecture Overview

### Frontend Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Pages     │  │ Components  │  │      Layouts        │   │
│  │             │  │             │  │                     │   │
│  │ - App Router│  │ - UI Components│ │ - Page Layouts     │   │
│  │ - Route     │  │ - Forms     │  │ - Auth Layout      │   │
│  │ - Handlers  │  │ - Features  │  │ - Dashboard Layout │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   State     │  │   Hooks     │  │      Utils          │   │
│  │ Management  │  │             │  │                     │   │
│  │             │  │ - Custom    │  │ - API Client       │   │
│  │ - Zustand   │  │ - React     │  │ - Helpers          │   │
│  │ - Context   │  │ - Effects   │  │ - Validators       │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Styles    │  │   Types     │  │      Assets         │   │
│  │             │  │             │  │                     │   │
│  │ - Tailwind  │  │ - TypeScript│  │ - Images           │   │
│  │ - shadcn/ui │  │ - Interfaces│  │ - Icons            │   │
│  │ - CSS       │  │ - Enums     │  │ - Fonts            │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Component-First Architecture**: Reusable, composable components
2. **Type Safety**: Full TypeScript coverage
3. **Performance**: Optimized rendering and loading
4. **Accessibility**: WCAG compliant components
5. **Responsive Design**: Mobile-first approach
6. **Developer Experience**: Excellent DX with modern tools

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Context
- **Forms**: React Hook Form + Zod
- **Data Fetching**: Axios + SWR
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tools**: Next.js built-in optimizations

## 📁 Project Structure Deep Dive

### App Router Structure

```
app/
├── (auth)/                    # Route group for auth pages
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Registration page
│   ├── forgot-password/
│   │   └── page.tsx         # Forgot password page
│   └── layout.tsx           # Auth layout wrapper
├── (dashboard)/              # Route group for dashboard
│   ├── dashboard/
│   │   └── page.tsx         # Main dashboard
│   ├── projects/
│   │   ├── page.tsx         # Projects list
│   │   ├── [slug]/
│   │   │   └── page.tsx     # Project details
│   │   └── create/
│   │       └── page.tsx     # Create project
│   ├── ai-tools/
│   │   ├── page.tsx         # AI tools overview
│   │   ├── resume-analyzer/
│   │   │   └── page.tsx     # Resume analyzer
│   │   ├── text-generator/
│   │   │   └── page.tsx     # Text generator
│   │   └── qa-bot/
│   │       └── page.tsx     # QA bot
│   ├── profile/
│   │   └── page.tsx         # User profile
│   └── layout.tsx           # Dashboard layout
├── api/                      # API routes
│   ├── auth/
│   │   └── route.ts         # Auth API
│   └── users/
│       └── route.ts         # Users API
├── globals.css              # Global styles
├── layout.tsx               # Root layout
├── page.tsx                 # Homepage
├── loading.tsx              # Loading UI
├── error.tsx                # Error UI
└── not-found.tsx            # 404 page
```

### Component Organization

```
components/
├── ui/                      # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   └── index.ts             # Barrel exports
├── forms/                   # Form components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ProjectForm.tsx
│   ├── ProfileForm.tsx
│   └── AIForm.tsx
├── layout/                  # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── MobileMenu.tsx
├── features/                # Feature-specific components
│   ├── ProjectCard.tsx
│   ├── ServiceCard.tsx
│   ├── TestimonialCard.tsx
│   ├── PricingCard.tsx
│   └── AIInterface.tsx
├── common/                  # Common components
│   ├── Loading.tsx
│   ├── ErrorBoundary.tsx
│   ├── SEO.tsx
│   ├── Image.tsx
│   └── Link.tsx
└── providers/               # Context providers
    ├── AuthProvider.tsx
    ├── ThemeProvider.tsx
    └── QueryProvider.tsx
```

### Utility Organization

```
lib/
├── api.ts                   # API client configuration
├── auth.ts                  # Authentication utilities
├── utils.ts                 # General utilities
├── validations.ts           # Form validations
├── constants.ts             # App constants
├── helpers.ts               # Helper functions
├── hooks/                   # Custom hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useInfiniteScroll.ts
└── providers/               # React providers
    ├── query-client.ts
    └── theme-provider.ts
```

## 🔄 Component Architecture

### Atomic Design Pattern

```typescript
// Atomic Design Hierarchy
atoms → molecules → organisms → templates → pages

// Example Implementation:

// 1. Atoms - Basic UI elements
export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

// 2. Molecules - Simple combinations
export const SearchBox = () => {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search..." />
      <Button>Search</Button>
    </div>
  )
}

// 3. Organisms - Complex components
export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <Navigation />
          <SearchBox />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

// 4. Templates - Page layouts
export const DashboardTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
}

// 5. Pages - Complete views
export default function DashboardPage() {
  return (
    <DashboardTemplate>
      <h1>Dashboard</h1>
      <DashboardContent />
    </DashboardTemplate>
  )
}
```

### Component Patterns

#### 1. Compound Components Pattern

```typescript
// components/ui/card.tsx
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
)

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
)

// Usage
<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Project description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Project content</p>
  </CardContent>
</Card>
```

#### 2. Render Props Pattern

```typescript
// components/common/DataFetcher.tsx
interface DataFetcherProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchData()
  }, [url])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await api.get(url)
      setData(response.data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return <>{children(data, loading, error)}</>
}

// Usage
<DataFetcher url="/api/projects">
  {(projects, loading, error) => {
    if (loading) return <Loading />
    if (error) return <ErrorMessage error={error} />
    return <ProjectList projects={projects} />
  }}
</DataFetcher>
```

#### 3. Higher-Order Components

```typescript
// components/common/withAuth.tsx
interface WithAuthProps {
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  { requireAuth = true, requireAdmin = false }: WithAuthProps = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isAuthenticated } = useAuth()

    if (requireAuth && !isAuthenticated) {
      return <Redirect to="/login" />
    }

    if (requireAdmin && user?.role !== 'ADMIN') {
      return <AccessDenied />
    }

    return <Component {...props} />
  }
}

// Usage
const AdminDashboard = withAuth(DashboardPage, { requireAdmin: true })
```

## 🎨 UI/UX Design System

### Design Tokens

```typescript
// lib/design-tokens.ts
export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  
  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },
  
  // Neutral colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  }
}

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
}

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
  }
}
```

### Component Variants

```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Theme System

```typescript
// lib/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
```

## 🗃️ State Management

### Zustand Store Architecture

```typescript
// store/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  avatar?: string
  isVerified: boolean
}

interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
  
  // Computed
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      clearError: () => set({ error: null }),
      
      // Computed
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
```

### Complex State Management

```typescript
// store/project-store.ts
interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  techStack: string[]
  isFeatured: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectState {
  // State
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
  filters: {
    category: string | null
    search: string
    isFeatured: boolean | null
  }
  pagination: {
    page: number
    limit: number
    total: number
  }
  
  // Actions
  fetchProjects: () => Promise<void>
  fetchProject: (slug: string) => Promise<void>
  createProject: (projectData: Partial<Project>) => Promise<void>
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setFilters: (filters: Partial<ProjectState['filters']>) => void
  setPage: (page: number) => void
  
  // Computed
  filteredProjects: Project[]
  totalPages: number
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    search: '',
    isFeatured: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  
  // Actions
  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const { filters, pagination } = get()
      const response = await api.get('/projects', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          category: filters.category,
          search: filters.search,
          featured: filters.isFeatured,
        }
      })
      
      set({
        projects: response.data.data,
        pagination: {
          ...pagination,
          total: response.data.pagination.total,
        },
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        isLoading: false,
      })
    }
  },
  
  fetchProject: async (slug: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await api.get(`/projects/${slug}`)
      set({
        currentProject: response.data.data,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch project',
        isLoading: false,
      })
    }
  },
  
  createProject: async (projectData) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await api.post('/projects', projectData)
      const newProject = response.data.data
      
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false,
      }))
      
      return newProject
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create project',
        isLoading: false,
      })
      throw error
    }
  },
  
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page
    }))
    
    // Auto-fetch with new filters
    get().fetchProjects()
  },
  
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }))
    
    // Auto-fetch new page
    get().fetchProjects()
  },
  
  // Computed
  get filteredProjects() {
    const { projects, filters } = get()
    
    return projects.filter((project) => {
      if (filters.category && project.category !== filters.category) {
        return false
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
        )
      }
      
      if (filters.isFeatured !== null && project.isFeatured !== filters.isFeatured) {
        return false
      }
      
      return true
    })
  },
  
  get totalPages() {
    const { pagination } = get()
    return Math.ceil(pagination.total / pagination.limit)
  },
}))
```

### React Context for Global State

```typescript
// providers/query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 3,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## 🛣️ Routing & Navigation

### App Router Structure

```typescript
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

### Dynamic Routes

```typescript
// app/(dashboard)/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/features/ProjectDetail'
import { getProjectBySlug } from '@/lib/api/projects'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)
  
  if (!project) {
    notFound()
  }
  
  return <ProjectDetail project={project} />
}

// Generate static params for static generation
export async function generateStaticParams() {
  const projects = await getAllProjects()
  
  return projects.map((project) => ({
    slug: project.slug,
  }))
}
```

### Route Handlers

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(50),
  category: z.enum(['AI', 'WEB', 'SAAS', 'OTHER']),
  techStack: z.array(z.string()).min(1),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    const projects = await getProjects({
      page,
      limit,
      category,
      search,
    })
    
    return NextResponse.json({
      success: true,
      data: projects.data,
      pagination: projects.pagination,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)
    
    const project = await createProject({
      ...validatedData,
      authorId: session.user.id,
    })
    
    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
      },
      { status: 500 }
    )
  }
}
```

## 🔗 API Integration

### API Client Configuration

```typescript
// lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/auth-store'

class ApiClient {
  private client: AxiosInstance
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = useAuthStore.getState().token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add request timestamp
        config.metadata = { startTime: new Date() }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response time
        const endTime = new Date()
        const duration = endTime.getTime() - response.config.metadata.startTime.getTime()
        
        console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
        
        return response
      },
      (error) => {
        // Handle auth errors
        if (error.response?.status === 401) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
        
        // Handle network errors
        if (!error.response) {
          console.error('Network error:', error.message)
        }
        
        return Promise.reject(error)
      }
    )
  }
  
  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config)
    return response.data
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config)
    return response.data
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config)
    return response.data
  }
  
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config)
    return response.data
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config)
    return response.data
  }
}

export const api = new ApiClient()
```

### Data Fetching Hooks

```typescript
// hooks/useApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'

// Generic query hook
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchOnWindowFocus?: boolean
  }
) {
  return useQuery({
    queryKey: key,
    queryFn: () => api.get<T>(url),
    enabled: options?.enabled !== false,
    staleTime: options?.staleTime || 60 * 1000, // 1 minute
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false,
  })
}

// Generic mutation hook
export function useApiMutation<T, V>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    invalidateQueries?: string[][]
  }
) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (variables: V) => {
      switch (method) {
        case 'POST':
          return api.post<T>(url, variables)
        case 'PUT':
          return api.put<T>(url, variables)
        case 'PATCH':
          return api.patch<T>(url, variables)
        case 'DELETE':
          return api.delete<T>(url)
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    },
    onSuccess: (data) => {
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error as Error)
    },
  })
}

// Specific hooks
export function useProjects() {
  return useApiQuery<Project[]>('projects', '/projects')
}

export function useProject(slug: string) {
  return useApiQuery<Project>(['projects', slug], `/projects/${slug}`)
}

export function useCreateProject() {
  return useApiMutation<Project, Partial<Project>>('/projects', 'POST', {
    onSuccess: () => {
      useAuthStore.getState().setLoading(false)
    },
    invalidateQueries: [['projects']],
  })
}

export function useUpdateProject() {
  return useApiMutation<Project, { id: string; data: Partial<Project> }>(
    (variables) => `/projects/${variables.id}`,
    'PATCH',
    {
      invalidateQueries: [['projects']],
    }
  )
}
```

## 📝 Forms & Validation

### Form Components with React Hook Form

```typescript
// components/forms/ProjectForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useCreateProject } from '@/hooks/useApi'
import { toast } from 'sonner'

const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.enum(['AI', 'WEB', 'SAAS', 'OTHER']),
  techStack: z.array(z.string()).min(1, 'Select at least one technology'),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>
  onSuccess?: (project: Project) => void
}

export function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const createProject = useCreateProject()
  
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'WEB',
      techStack: [],
      isFeatured: false,
      isPublished: true,
      ...initialData,
    },
  })
  
  const onSubmit = async (data: ProjectFormData) => {
    try {
      const project = await createProject.mutateAsync(data)
      toast.success('Project created successfully!')
      onSuccess?.(project)
      form.reset()
    } catch (error) {
      toast.error('Failed to create project')
    }
  }
  
  const techOptions = [
    'React', 'Next.js', 'TypeScript', 'Python', 'FastAPI',
    'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS', 'Vercel'
  ]
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project in detail"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="WEB">Web</SelectItem>
                  <SelectItem value="SAAS">SaaS</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {techOptions.map((tech) => (
                  <FormField
                    key={tech}
                    control={form.control}
                    name="techStack"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(tech)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, tech])
                                : field.onChange(
                                    field.value?.filter((value) => value !== tech)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {tech}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Featured project
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Published
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createProject.isPending}
        >
          {createProject.isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </Form>
  )
}
```

### Validation Schemas

```typescript
// lib/validations.ts
import { z } from 'zod'

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one digit'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Project validation schemas
export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.enum(['AI', 'WEB', 'SAAS', 'OTHER']),
  techStack: z.array(z.string()).min(1, 'Select at least one technology'),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
})

// AI Tools validation schemas
export const resumeAnalysisSchema = z.object({
  resumeText: z.string().min(100, 'Resume text must be at least 100 characters'),
})

export const qaBotSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  context: z.string().optional(),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type ResumeAnalysisData = z.infer<typeof resumeAnalysisSchema>
export type QABotData = z.infer<typeof qaBotSchema>
```

## 🎭 Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic'
import { Loading } from '@/components/common/Loading'

// Admin dashboard - heavy component
const AdminDashboard = dynamic(
  () => import('@/components/dashboard/AdminDashboard'),
  {
    loading: () => <Loading />,
    ssr: false, // Client-side only for admin features
  }
)

// AI tools - might not be used by all users
const AIResumeAnalyzer = dynamic(
  () => import('@/components/ai-tools/ResumeAnalyzer'),
  {
    loading: () => <Loading />,
  }
)

// Chart components - heavy libraries
const ProjectChart = dynamic(
  () => import('@/components/charts/ProjectChart'),
  {
    loading: () => <Loading />,
    ssr: false,
  }
)

// Usage in components
export default function DashboardPage() {
  const { user } = useAuthStore()
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Regular content */}
      <ProjectStats />
      
      {/* Conditionally load heavy components */}
      {user?.role === 'ADMIN' && <AdminDashboard />}
      
      {/* Lazy loaded components */}
      <Suspense fallback={<Loading />}>
        <ProjectChart />
      </Suspense>
    </div>
  )
}
```

### Image Optimization

```typescript
// components/common/OptimizedImage.tsx
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
}

export function OptimimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  )
}
```

### Memoization Strategies

```typescript
// hooks/useMemoizedData.ts
import { useMemo, useCallback } from 'react'
import { useProjects } from '@/hooks/useApi'

export function useMemoizedProjects() {
  const { data: projects, isLoading } = useProjects()
  
  // Memoize filtered projects
  const filteredProjects = useMemo(() => {
    if (!projects) return []
    
    return projects.filter((project) => project.isPublished)
  }, [projects])
  
  // Memoize project categories
  const categories = useMemo(() => {
    if (!projects) return []
    
    const uniqueCategories = [...new Set(projects.map(p => p.category))]
    return uniqueCategories.sort()
  }, [projects])
  
  // Memoize stats
  const stats = useMemo(() => {
    if (!projects) return { total: 0, published: 0, featured: 0 }
    
    return {
      total: projects.length,
      published: projects.filter(p => p.isPublished).length,
      featured: projects.filter(p => p.isFeatured).length,
    }
  }, [projects])
  
  // Memoize event handlers
  const handleProjectClick = useCallback((projectId: string) => {
    console.log('Project clicked:', projectId)
  }, [])
  
  return {
    projects: filteredProjects,
    categories,
    stats,
    isLoading,
    handleProjectClick,
  }
}
```

## 🔍 Error Handling

### Error Boundaries

```typescript
// components/common/ErrorBoundary.tsx
'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Send error to logging service
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'exception', {
        description: error.message,
        fatal: false,
      })
    }
  }
  
  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }
  
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }
    
    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-2">Something went wrong</h2>
        
        <p className="text-gray-600 text-center mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}
```

### API Error Handling

```typescript
// lib/error-handling.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: any): APIError {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    return new APIError(
      data.message || 'Server error',
      status,
      data.code,
      data.details
    )
  } else if (error.request) {
    // Network error
    return new APIError(
      'Network error. Please check your connection.',
      0,
      'NETWORK_ERROR'
    )
  } else {
    // Other error
    return new APIError(
      error.message || 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    )
  }
}

// Usage in API calls
export async function safeAPICall<T>(
  apiCall: () => Promise<T>
): Promise<{ data: T | null; error: APIError | null }> {
  try {
    const data = await apiCall()
    return { data, error: null }
  } catch (error) {
    const apiError = handleAPIError(error)
    return { data: null, error: apiError }
  }
}
```

## 🧪 Testing Strategy

### Component Testing

```typescript
// __tests__/components/ProjectCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProjectCard } from '@/components/features/ProjectCard'
import { mockProject } from '@/__mocks__/project'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

describe('ProjectCard', () => {
  const defaultProps = {
    project: mockProject,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('renders project information correctly', () => {
    render(<ProjectCard {...defaultProps} />)
    
    expect(screen.getByText(mockProject.title)).toBeInTheDocument()
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    expect(screen.getByText(mockProject.category)).toBeInTheDocument()
  })
  
  it('displays tech stack tags', () => {
    render(<ProjectCard {...defaultProps} />)
    
    mockProject.techStack.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument()
    })
  })
  
  it('calls onEdit when edit button is clicked', async () => {
    render(<ProjectCard {...defaultProps} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    await waitFor(() => {
      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockProject)
    })
  })
  
  it('shows confirmation dialog before deletion', async () => {
    render(<ProjectCard {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })
  })
  
  it('applies featured styling for featured projects', () => {
    const featuredProject = { ...mockProject, isFeatured: true }
    render(<ProjectCard {...defaultProps} project={featuredProject} />)
    
    const card = screen.getByTestId('project-card')
    expect(card).toHaveClass('border-yellow-400')
  })
})
```

### Hook Testing

```typescript
// __tests__/hooks/useApi.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useApiQuery } from '@/hooks/useApi'

// Mock API client
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useApiQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test Project' }
    ;(api.get as jest.Mock).mockResolvedValue(mockData)
    
    const { result } = renderHook(
      () => useApiQuery('projects', '/projects'),
      { wrapper: createWrapper() }
    )
    
    expect(result.current.isLoading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockData)
    expect(api.get).toHaveBeenCalledWith('/projects')
  })
  
  it('handles API errors', async () => {
    const errorMessage = 'API Error'
    ;(api.get as jest.Mock).mockRejectedValue(new Error(errorMessage))
    
    const { result } = renderHook(
      () => useApiQuery('projects', '/projects'),
      { wrapper: createWrapper() }
    )
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.error).toBeTruthy()
  })
  
  it('does not fetch when disabled', () => {
    renderHook(
      () => useApiQuery('projects', '/projects', { enabled: false }),
      { wrapper: createWrapper() }
    )
    
    expect(api.get).not.toHaveBeenCalled()
  })
})
```

---

## 📚 Summary

This frontend architecture documentation provides:

1. **🏗️ Complete Architecture Overview** - System design and patterns
2. **📁 Detailed Project Structure** - File organization and conventions
3. **🔄 Component Architecture** - Design patterns and best practices
4. **🎨 Design System** - UI components and theming
5. **🗃️ State Management** - Zustand and React Context patterns
6. **🛣️ Routing System** - Next.js App Router implementation
7. **🔗 API Integration** - Data fetching and error handling
8. **📝 Form Handling** - React Hook Form with Zod validation
9. **🎭 Performance** - Optimization techniques
10. **🔍 Error Handling** - Error boundaries and API errors
11. **🧪 Testing** - Component and hook testing strategies

This documentation enables developers to:
- Understand the complete frontend architecture
- Build new components following established patterns
- Debug issues effectively
- Optimize performance
- Maintain code quality and consistency

---

<div align="center">
  <p>⚛️ Frontend architecture designed for scalability and maintainability</p>
  <p>📖 Comprehensive documentation for developer productivity</p>
</div>
