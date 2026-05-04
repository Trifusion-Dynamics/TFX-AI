import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { serviceApi } from '@/lib/api/service.api'
import { Service } from '@/types'
import { Brain, Code, Smartphone, Database, Check, ArrowRight, Palette, Search, Cloud } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Professional Web Development & Digital Services | TFX AI Agency',
  description: 'Expert AI development, web & mobile apps, SaaS solutions, API development, cloud DevOps, UI/UX design, and SEO services. Transform your business with cutting-edge technology solutions.',
  keywords: ['AI development', 'web development', 'mobile app development', 'SaaS development', 'API development', 'cloud DevOps', 'UI/UX design', 'SEO services', 'machine learning', 'React development', 'Next.js development', 'custom software solutions'],
  openGraph: {
    title: 'Professional Web Development & Digital Services | TFX AI Agency',
    description: 'Expert AI development, web & mobile apps, SaaS solutions, API development, cloud DevOps, UI/UX design, and SEO services. Transform your business with cutting-edge technology solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Web Development & Digital Services | TFX AI Agency',
    description: 'Expert AI development, web & mobile apps, SaaS solutions, API development, cloud DevOps, UI/UX design, and SEO services.',
  },
  alternates: {
    canonical: '/services',
  },
}

// Mock services for fallback
const MOCK_SERVICES: Service[] = [
  { 
    id: '1', 
    title: 'AI & Machine Learning Development', 
    slug: 'ai-development', 
    description: 'Transform your business with cutting-edge AI and Machine Learning solutions. Our expert team develops intelligent systems including predictive analytics, natural language processing, computer vision, and custom LLM applications. We leverage TensorFlow, PyTorch, and advanced ML frameworks to build scalable AI models that automate workflows, enhance decision-making, and provide actionable insights from your data.', 
    short_desc: 'Custom AI models and intelligent automation systems for business transformation.', 
    icon: 'brain', 
    features: ['Natural Language Processing', 'Computer Vision Solutions', 'Predictive Analytics', 'Custom LLM Development', 'AI Model Training & Deployment', 'Automated Decision Systems'], 
    is_active: true, 
    order: 1 
  },
  { 
    id: '2', 
    title: 'Custom Web Application Development', 
    slug: 'web-apps', 
    description: 'Build powerful, scalable web applications with our expert development team. We specialize in modern frameworks like Next.js, React, and Node.js to create high-performance web platforms that drive business growth. From enterprise dashboards to e-commerce platforms, we deliver secure, responsive, and SEO-optimized web solutions tailored to your specific business requirements.', 
    short_desc: 'Enterprise-grade web applications built with cutting-edge technologies.', 
    icon: 'code', 
    features: ['Next.js & React Development', 'Full-Stack Architecture', 'RESTful API Development', 'Progressive Web Apps (PWA)', 'E-commerce Solutions', 'Cloud-Native Applications'], 
    is_active: true, 
    order: 2 
  },
  { 
    id: '3', 
    title: 'Mobile App Development', 
    slug: 'mobile-apps', 
    description: 'Reach your customers on every device with our cross-platform mobile development services. We create native-feeling iOS and Android applications using React Native and Flutter, ensuring optimal performance and user experience. Our mobile apps feature seamless backend integration, real-time synchronization, and are optimized for app store discovery and user engagement.', 
    short_desc: 'Cross-platform mobile apps that deliver native performance and user experience.', 
    icon: 'smartphone', 
    features: ['React Native & Flutter Development', 'Native iOS & Android Apps', 'UI/UX Mobile Design', 'App Store Optimization (ASO)', 'Push Notification Systems', 'Offline Functionality'], 
    is_active: true, 
    order: 3 
  },
  { 
    id: '4', 
    title: 'Software & SaaS Development', 
    slug: 'saas-development', 
    description: 'Launch successful SaaS products with our comprehensive development services. We build scalable, multi-tenant SaaS platforms with subscription management, user authentication, and analytics dashboards. Our solutions feature microservices architecture, automated billing systems, and are designed for rapid scaling as your user base grows, ensuring high availability and optimal performance.', 
    short_desc: 'Scalable SaaS platforms and enterprise software solutions.', 
    icon: 'database', 
    features: ['Multi-Tenant Architecture', 'Subscription Billing Systems', 'User Authentication & Authorization', 'Analytics & Reporting Dashboards', 'Microservices Development', 'Automated Testing & Deployment'], 
    is_active: true, 
    order: 4 
  },
  { 
    id: '5', 
    title: 'API & Backend Solutions', 
    slug: 'api-backend', 
    description: 'Power your applications with robust, scalable backend solutions and APIs. We develop high-performance RESTful APIs, GraphQL endpoints, and microservices that handle millions of requests efficiently. Our backend solutions feature advanced security measures, real-time data processing, and seamless integration with third-party services to ensure your applications run smoothly and securely.', 
    short_desc: 'High-performance APIs and scalable backend infrastructure.', 
    icon: 'database', 
    features: ['RESTful API Development', 'GraphQL Services', 'Microservices Architecture', 'Real-time Data Processing', 'API Security & Authentication', 'Database Design & Optimization'], 
    is_active: true, 
    order: 5 
  },
  { 
    id: '6', 
    title: 'Cloud & DevOps Solutions', 
    slug: 'cloud-devops', 
    description: 'Optimize your infrastructure with our comprehensive Cloud and DevOps services. We architect and deploy scalable cloud solutions on AWS, Azure, and Google Cloud, implementing CI/CD pipelines, container orchestration with Kubernetes, and infrastructure as code. Our DevOps expertise ensures rapid deployment, automated monitoring, and optimal resource utilization for maximum efficiency and cost-effectiveness.', 
    short_desc: 'Cloud infrastructure and DevOps automation for scalable deployments.', 
    icon: 'database', 
    features: ['Cloud Architecture (AWS/Azure/GCP)', 'CI/CD Pipeline Setup', 'Kubernetes & Docker Containerization', 'Infrastructure as Code (Terraform)', 'Automated Monitoring & Logging', 'Security & Compliance Management'], 
    is_active: true, 
    order: 6 
  },
  { 
    id: '7', 
    title: 'UI/UX Design & Branding', 
    slug: 'ui-ux-branding', 
    description: 'Create stunning user experiences with our comprehensive UI/UX design and branding services. We design intuitive interfaces, conduct user research, and develop cohesive brand identities that resonate with your target audience. Our design process focuses on user-centered design principles, accessibility standards, and creating visual experiences that drive engagement and conversion.', 
    short_desc: 'User-centered design and compelling brand identity solutions.', 
    icon: 'database', 
    features: ['User Interface (UI) Design', 'User Experience (UX) Research', 'Brand Identity Development', 'Design Systems & Style Guides', 'Prototyping & Wireframing', 'Accessibility & Responsive Design'], 
    is_active: true, 
    order: 7 
  },
  { 
    id: '8', 
    title: 'SEO & Digital Marketing', 
    slug: 'seo-marketing', 
    description: 'Dominate search results and grow your online presence with our expert SEO and digital marketing services. We implement comprehensive SEO strategies including technical optimization, content marketing, link building, and performance tracking. Our data-driven approach ensures improved search rankings, increased organic traffic, and higher conversion rates for sustainable business growth.', 
    short_desc: 'Comprehensive SEO strategies and digital marketing solutions.', 
    icon: 'database', 
    features: ['Technical SEO Optimization', 'Content Marketing Strategy', 'Link Building & Outreach', 'Local SEO Services', 'Analytics & Performance Tracking', 'Conversion Rate Optimization'], 
    is_active: true, 
    order: 8 
  },
]

async function getServices() {
  try {
    const res = await serviceApi.getAll()
    return res.data.data || MOCK_SERVICES
  } catch {
    return MOCK_SERVICES
  }
}


export default async function ServicesPage() {
  const services = await getServices()

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "TFX AI - Digital Services Agency",
    "description": "Expert AI development, web & mobile apps, SaaS solutions, API development, cloud DevOps, UI/UX design, and SEO services",
    "url": "https://tfxai.com/services",
    "telephone": "+1-234-567-8900",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tech City",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Services",
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.description
        },
        "position": index + 1
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-24">
          <SectionHeading
            badge="Our Expert Services"
            title="Transform Your Business with Cutting-Edge Technology Solutions"
            subtitle="From AI-powered applications to scalable cloud infrastructure, we deliver comprehensive digital services that drive growth and innovation."
            center
            className="mb-8"
          />
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-400 text-lg mb-8">
              Partner with our expert team to build custom software solutions that scale with your business. 
              We combine technical excellence with strategic thinking to deliver results that matter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AnimatedButton href="/contact">
                Start Your Project
              </AnimatedButton>
              <AnimatedButton href="/portfolio" variant="outline">
                View Our Work
              </AnimatedButton>
            </div>
          </div>
        </section>

        {/* Detailed Services List */}
        <section className="container mx-auto px-4">
          <div className="flex flex-col gap-12">
            {services.map((service, idx) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Visual Area */}
                <div className="flex-1 w-full">
                  <div className="relative group aspect-square max-w-md mx-auto lg:mx-0">
                    <div className="absolute inset-0 bg-gradient-brand opacity-20 rounded-3xl blur-3xl group-hover:opacity-40 transition-opacity" />
                    <GlassCard className="h-full flex items-center justify-center border-white/10 group-hover:border-brand-pink/30 transition-colors">
                      <div className="p-12 rounded-full bg-white/5 flex items-center justify-center">
                        <ServiceIcon slug={service.slug} className="w-24 h-24 text-brand-pink" />
                      </div>
                    </GlassCard>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-brand-pink shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <AnimatedButton href={`/contact?service=${service.slug}`}>
                      Get This Service
                    </AnimatedButton>
                    <Link 
                      href={`/services/${service.slug}`} 
                      className="text-gray-400 hover:text-white font-medium flex items-center gap-2 group"
                    >
                      View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-dark-bg/50 py-24 mt-24">
          <div className="container mx-auto px-4 text-center">
            <SectionHeading title="Our Process" subtitle="How we turn your vision into reality" center className="mb-16" />
            
            <div className="relative max-w-5xl mx-auto">
              {/* Connector line for desktop */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-brand opacity-20 hidden lg:block -translate-y-1/2" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <ProcessStep number="01" title="Discovery" desc="Initial consultation to understand your goals, requirements, and business objectives." />
                <ProcessStep number="02" title="Planning" desc="Detailed project roadmap, UI/UX wireframes, and technology stack selection." />
                <ProcessStep number="03" title="Development" desc="Agile development with regular updates, testing, and client feedback integration." />
                <ProcessStep number="04" title="Launch" desc="Final testing, deployment, monitoring setup, and ongoing support." />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <SectionHeading 
              title="Frequently Asked Questions" 
              subtitle="Everything you need to know about our services" 
              center 
              className="mb-16" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FAQItem 
                  question="How long does a typical project take?" 
                  answer="Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications may take 3-6 months. We provide detailed timelines during the planning phase." 
                />
                <FAQItem 
                  question="What technologies do you specialize in?" 
                  answer="We specialize in React, Next.js, Node.js, Python, TensorFlow, AWS, Docker, Kubernetes, and modern cloud technologies. Our tech stack is chosen based on your specific needs." 
                />
                <FAQItem 
                  question="Do you provide ongoing support?" 
                  answer="Yes, we offer comprehensive maintenance and support packages including bug fixes, updates, performance optimization, and 24/7 monitoring for critical applications." 
                />
                <FAQItem 
                  question="What is your pricing structure?" 
                  answer="We offer flexible pricing models including fixed-price projects, hourly rates, and retainers. Pricing depends on project complexity, timeline, and specific requirements." 
                />
                <FAQItem 
                  question="Can you work with our existing team?" 
                  answer="Absolutely! We can augment your existing team, provide consultation, or take full ownership of projects. We adapt to your preferred collaboration style." 
                />
                <FAQItem 
                  question="Do you sign NDAs?" 
                  answer="Yes, we prioritize client confidentiality and are happy to sign NDAs. We understand the importance of protecting your intellectual property." 
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ServiceIcon({ slug, className }: { slug: string, className?: string }) {
  if (slug.includes('ai')) return <Brain className={className} />
  if (slug.includes('web')) return <Code className={className} />
  if (slug.includes('mobile')) return <Smartphone className={className} />
  if (slug.includes('saas')) return <Database className={className} />
  if (slug.includes('api') || slug.includes('backend')) return <Database className={className} />
  if (slug.includes('cloud') || slug.includes('devops')) return <Cloud className={className} />
  if (slug.includes('ui') || slug.includes('ux') || slug.includes('branding')) return <Palette className={className} />
  if (slug.includes('seo') || slug.includes('marketing')) return <Search className={className} />
  return <Database className={className} />
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-dark-bg/30 rounded-xl p-6 border border-white/5 hover:border-brand-pink/20 transition-colors">
      <h4 className="text-lg font-display font-bold text-white mb-3">{question}</h4>
      <p className="text-gray-400 leading-relaxed">{answer}</p>
    </div>
  )
}

function ProcessStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-dark-bg border-2 border-brand-pink flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-brand-pink/20">
        {number}
      </div>
      <h4 className="text-xl font-display font-bold text-white">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{desc}</p>
    </div>
  )
}
