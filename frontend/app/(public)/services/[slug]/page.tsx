import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { serviceApi } from '@/lib/api/service.api'
import { notFound } from 'next/navigation'
import { Check, ArrowLeft, Brain, Code, Smartphone, Database, Zap, Cloud, Palette, Search } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

// Mock service for fallback
const MOCK_SERVICE_DETAILS = {
  'ai-development': { 
    id: '1', 
    title: 'AI & Machine Learning Development', 
    slug: 'ai-development', 
    description: 'Transform your business with cutting-edge AI and Machine Learning solutions. Our expert team develops intelligent systems including predictive analytics, natural language processing, computer vision, and custom LLM applications. We leverage TensorFlow, PyTorch, and advanced ML frameworks to build scalable AI models that automate workflows, enhance decision-making, and provide actionable insights from your data.', 
    short_desc: 'Custom AI models and intelligent automation systems for business transformation.', 
    icon: 'brain', 
    features: ['Natural Language Processing', 'Computer Vision Solutions', 'Predictive Analytics', 'Custom LLM Development', 'AI Model Training & Deployment', 'Automated Decision Systems', 'Recommendation Engines', 'Voice Recognition Systems'], 
    is_active: true, 
    order: 1 
  },
  'ai-automation': { 
    id: '9', 
    title: 'AI Automation Solutions', 
    slug: 'ai-automation', 
    description: 'Revolutionize your business processes with intelligent AI automation. We design and implement comprehensive automation solutions that leverage artificial intelligence to streamline workflows, reduce manual tasks, and increase operational efficiency. From automated customer service chatbots to intelligent document processing and workflow automation, our AI solutions transform how businesses operate.', 
    short_desc: 'Intelligent AI-powered automation solutions to streamline business processes.', 
    icon: 'brain', 
    features: ['Intelligent Process Automation', 'AI Chatbots & Virtual Assistants', 'Document Processing Automation', 'Workflow Optimization', 'Predictive Maintenance', 'Automated Decision Making', 'Smart Data Extraction', 'Integration with Existing Systems'], 
    is_active: true, 
    order: 9 
  },
  'web-apps': { 
    id: '2', 
    title: 'Custom Web Application Development', 
    slug: 'web-apps', 
    description: 'Build powerful, scalable web applications with our expert development team. We specialize in modern frameworks like Next.js, React, and Node.js to create high-performance web platforms that drive business growth. From enterprise dashboards to e-commerce platforms, we deliver secure, responsive, and SEO-optimized web solutions tailored to your specific business requirements.', 
    short_desc: 'Enterprise-grade web applications built with cutting-edge technologies.', 
    icon: 'code', 
    features: ['Next.js & React Development', 'Full-Stack Architecture', 'RESTful API Development', 'Progressive Web Apps (PWA)', 'E-commerce Solutions', 'Cloud-Native Applications', 'Real-time Web Applications', 'Performance Optimization'], 
    is_active: true, 
    order: 2 
  },
  'mobile-apps': { 
    id: '3', 
    title: 'Mobile App Development', 
    slug: 'mobile-apps', 
    description: 'Reach your customers on every device with our cross-platform mobile development services. We create native-feeling iOS and Android applications using React Native and Flutter, ensuring optimal performance and user experience. Our mobile apps feature seamless backend integration, real-time synchronization, and are optimized for app store discovery and user engagement.', 
    short_desc: 'Cross-platform mobile apps that deliver native performance and user experience.', 
    icon: 'smartphone', 
    features: ['React Native & Flutter Development', 'Native iOS & Android Apps', 'UI/UX Mobile Design', 'App Store Optimization (ASO)', 'Push Notification Systems', 'Offline Functionality', 'Mobile Payment Integration', 'Geolocation Services'], 
    is_active: true, 
    order: 3 
  },
  'saas-development': { 
    id: '4', 
    title: 'Software & SaaS Development', 
    slug: 'saas-development', 
    description: 'Launch successful SaaS products with our comprehensive development services. We build scalable, multi-tenant SaaS platforms with subscription management, user authentication, and analytics dashboards. Our solutions feature microservices architecture, automated billing systems, and are designed for rapid scaling as your user base grows, ensuring high availability and optimal performance.', 
    short_desc: 'Scalable SaaS platforms and enterprise software solutions.', 
    icon: 'database', 
    features: ['Multi-Tenant Architecture', 'Subscription Billing Systems', 'User Authentication & Authorization', 'Analytics & Reporting Dashboards', 'Microservices Development', 'Automated Testing & Deployment', 'Data Migration Services', 'Performance Monitoring'], 
    is_active: true, 
    order: 4 
  },
  'api-backend': { 
    id: '5', 
    title: 'API & Backend Solutions', 
    slug: 'api-backend', 
    description: 'Power your applications with robust, scalable backend solutions and APIs. We develop high-performance RESTful APIs, GraphQL endpoints, and microservices that handle millions of requests efficiently. Our backend solutions feature advanced security measures, real-time data processing, and seamless integration with third-party services to ensure your applications run smoothly and securely.', 
    short_desc: 'High-performance APIs and scalable backend infrastructure.', 
    icon: 'database', 
    features: ['RESTful API Development', 'GraphQL Services', 'Microservices Architecture', 'Real-time Data Processing', 'API Security & Authentication', 'Database Design & Optimization', 'API Documentation & Testing', 'Third-party Integrations'], 
    is_active: true, 
    order: 5 
  },
  'cloud-devops': { 
    id: '6', 
    title: 'Cloud & DevOps Solutions', 
    slug: 'cloud-devops', 
    description: 'Optimize your infrastructure with our comprehensive Cloud and DevOps services. We architect and deploy scalable cloud solutions on AWS, Azure, and Google Cloud, implementing CI/CD pipelines, container orchestration with Kubernetes, and infrastructure as code. Our DevOps expertise ensures rapid deployment, automated monitoring, and optimal resource utilization for maximum efficiency and cost-effectiveness.', 
    short_desc: 'Cloud infrastructure and DevOps automation for scalable deployments.', 
    icon: 'cloud', 
    features: ['Cloud Architecture (AWS/Azure/GCP)', 'CI/CD Pipeline Setup', 'Kubernetes & Docker Containerization', 'Infrastructure as Code (Terraform)', 'Automated Monitoring & Logging', 'Security & Compliance Management', 'Cost Optimization Strategies', 'Disaster Recovery Planning'], 
    is_active: true, 
    order: 6 
  },
  'ui-ux-branding': { 
    id: '7', 
    title: 'UI/UX Design & Branding', 
    slug: 'ui-ux-branding', 
    description: 'Create stunning user experiences with our comprehensive UI/UX design and branding services. We design intuitive interfaces, conduct user research, and develop cohesive brand identities that resonate with your target audience. Our design process focuses on user-centered design principles, accessibility standards, and creating visual experiences that drive engagement and conversion.', 
    short_desc: 'User-centered design and compelling brand identity solutions.', 
    icon: 'palette', 
    features: ['User Interface (UI) Design', 'User Experience (UX) Research', 'Brand Identity Development', 'Design Systems & Style Guides', 'Prototyping & Wireframing', 'Accessibility & Responsive Design', 'User Testing & Analysis', 'Visual Brand Strategy'], 
    is_active: true, 
    order: 7 
  },
  'seo-marketing': { 
    id: '8', 
    title: 'SEO & Digital Marketing', 
    slug: 'seo-marketing', 
    description: 'Dominate search results and grow your online presence with our expert SEO and digital marketing services. We implement comprehensive SEO strategies including technical optimization, content marketing, link building, and performance tracking. Our data-driven approach ensures improved search rankings, increased organic traffic, and higher conversion rates for sustainable business growth.', 
    short_desc: 'Comprehensive SEO strategies and digital marketing solutions.', 
    icon: 'search', 
    features: ['Technical SEO Optimization', 'Content Marketing Strategy', 'Link Building & Outreach', 'Local SEO Services', 'Analytics & Performance Tracking', 'Conversion Rate Optimization', 'Social Media Marketing', 'Pay-Per-Click (PPC) Management'], 
    is_active: true, 
    order: 8 
  },
}

function getServiceIcon(slug: string) {
  if (slug.includes('ai')) return <Brain className="w-6 h-6" />
  if (slug.includes('web')) return <Code className="w-6 h-6" />
  if (slug.includes('mobile')) return <Smartphone className="w-6 h-6" />
  if (slug.includes('saas')) return <Database className="w-6 h-6" />
  if (slug.includes('api') || slug.includes('backend')) return <Database className="w-6 h-6" />
  if (slug.includes('cloud') || slug.includes('devops')) return <Cloud className="w-6 h-6" />
  if (slug.includes('ui') || slug.includes('ux') || slug.includes('branding')) return <Palette className="w-6 h-6" />
  if (slug.includes('seo') || slug.includes('marketing')) return <Search className="w-6 h-6" />
  return <Database className="w-6 h-6" />
}

async function getService(slug: string) {
  try {
    const res = await serviceApi.getBySlug(slug)
    return res.data.data || MOCK_SERVICE_DETAILS[slug as keyof typeof MOCK_SERVICE_DETAILS]
  } catch {
    return MOCK_SERVICE_DETAILS[slug as keyof typeof MOCK_SERVICE_DETAILS]
  }
}


export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Service Not Found | TFX AI' }
  return {
    title: `${service.title} | TFX AI Services`,
    description: service.short_desc,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) notFound()

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          {/* Service Hero */}
          <section className="flex flex-col lg:flex-row gap-16 items-start mb-24">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" /> Service Detail
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-10">
                {service.description}
              </p>
              <AnimatedButton href={`/contact?service=${service.slug}`} size="lg">
                Start This Project
              </AnimatedButton>
            </div>

            <div className="flex-1 w-full lg:max-w-md">
              <GlassCard className="p-10 flex flex-col gap-8 sticky top-32">
                <h4 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4">Key Features</h4>
                <div className="flex flex-col gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-gray-300">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-pink/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-brand-pink" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </section>

          {/* Related Services */}
          <section className="border-t border-white/10 pt-24">
            <SectionHeading title="Related Services" className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.values(MOCK_SERVICE_DETAILS)
                .filter(s => s.slug !== slug)
                .slice(0, 3)
                .map((relatedService) => (
                  <GlassCard key={relatedService.id} hover className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink">
                        {getServiceIcon(relatedService.slug)}
                      </div>
                      <h4 className="text-xl font-display font-bold text-white">{relatedService.title}</h4>
                    </div>
                    <p className="text-gray-400 text-sm mb-6">{relatedService.short_desc}</p>
                    <Link href={`/services/${relatedService.slug}`} className="text-brand-pink font-semibold flex items-center gap-2 group">
                      Learn More <Zap className="w-3 h-3 group-hover:fill-brand-pink transition-all" />
                    </Link>
                  </GlassCard>
                ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
