import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { ServicesOverview } from '@/components/home/ServicesOverview'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { AIToolsPreview } from '@/components/home/AIToolsPreview'
import { Testimonials } from '@/components/home/Testimonials'
import { CTASection } from '@/components/home/CTASection'

import { serviceApi } from '@/lib/api/service.api'
import { projectApi } from '@/lib/api/project.api'
import { testimonialApi } from '@/lib/api/testimonial.api'
import { Service, Project, Testimonial } from '@/types'

// Mock data as fallback for "WOW" effect if backend is not ready
const MOCK_SERVICES: Service[] = [
  { id: '1', title: 'AI Automation', slug: 'ai-automation', description: 'Detailed desc', short_desc: 'Streamline your workflows with intelligent agents and automated decision-making processes.', icon: 'brain', features: ['Custom LLM Integration', 'Process Automation', 'Intelligent Chatbots'], is_active: true, order: 1 },
  { id: '2', title: 'Web Applications', slug: 'web-apps', description: 'Detailed desc', short_desc: 'High-performance, scalable web platforms built with Next.js and modern tech stacks.', icon: 'code', features: ['SEO Optimized', 'Responsive Design', 'State-of-the-art UI'], is_active: true, order: 2 },
  { id: '3', title: 'Generative AI', slug: 'gen-ai', description: 'Detailed desc', short_desc: 'Harness the power of Image and Text generation models to create unique content at scale.', icon: 'sparkles', features: ['Stable Diffusion', 'GPT-4 Integration', 'Content Strategy'], is_active: true, order: 3 },
]

const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'AgroBrain AI', slug: 'agrobrain', description: 'Desc', short_desc: 'Revolutionizing agriculture with AI-powered crop analysis and yield prediction.', thumbnail: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80', images: [], tech_stack: ['Next.js', 'FastAPI', 'PyTorch'], category: 'AI', is_featured: true, is_published: true },
  { id: '2', title: 'Meetoid', slug: 'meetoid', description: 'Desc', short_desc: 'Intelligent video conferencing with real-time translation and automated summaries.', thumbnail: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80', images: [], tech_stack: ['WebRTC', 'OpenAI', 'TypeScript'], category: 'SAAS', is_featured: true, is_published: true },
  { id: '3', title: 'BillEasy', slug: 'billeasy', description: 'Desc', short_desc: 'Modern invoicing and financial management platform for digital agencies.', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', images: [], tech_stack: ['React', 'PostgreSQL', 'Node.js'], category: 'WEB', is_featured: true, is_published: true },
]

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'John Doe', role: 'CEO', company: 'TechScale', content: 'TFX AI transformed our product with their AI expertise. The results were immediate and impressive.', rating: 5 },
  { id: '2', name: 'Jane Smith', role: 'CTO', company: 'FutureMind', content: 'Their team is exceptional. They delivered a complex web app with perfect AI integration in record time.', rating: 5 },
  { id: '3', name: 'Alex Rivera', role: 'Product Manager', company: 'Nexus', content: 'The best agency we have ever worked with. Clean code, great design, and intelligent solutions.', rating: 5 },
]

async function getHomeData() {
  try {
    const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
      serviceApi.getAll(),
      projectApi.getFeatured(),
      testimonialApi.getAll(),
    ])

    return {
      services: (servicesRes.data.data as any).length > 0 ? servicesRes.data.data : MOCK_SERVICES,
      projects: (projectsRes.data.data as any).length > 0 ? projectsRes.data.data : MOCK_PROJECTS,
      testimonials: (testimonialsRes.data.data as any).length > 0 ? testimonialsRes.data.data : MOCK_TESTIMONIALS,
    }
  } catch (error) {
    console.warn("Failed to fetch home data from API, using mock data as fallback.")
    return {
      services: MOCK_SERVICES,
      projects: MOCK_PROJECTS,
      testimonials: MOCK_TESTIMONIALS,
    }
  }
}


export default async function HomePage() {
  const { services, projects, testimonials } = await getHomeData()

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Services...</div>}>
          <ServicesOverview services={services} />
        </Suspense>

        <WhyChooseUs />

        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Projects...</div>}>
          <FeaturedProjects projects={projects} />
        </Suspense>

        <AIToolsPreview />

        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Testimonials...</div>}>
          <Testimonials testimonials={testimonials} />
        </Suspense>

        <CTASection />
      </main>
      <Footer />
    </>
  )
}
