import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { blogApi } from '@/lib/api/blog.api'
import { BlogPost } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Calendar, User, Clock, ChevronRight, Tag } from 'lucide-react'
import { GradientText } from '@/components/common/GradientText'

export const metadata = {
  title: 'Blog | TFX AI',
  description: 'Insights on AI, Web Development, and SaaS. Stay updated with the latest trends in technology.',
}

const MOCK_POSTS: BlogPost[] = [
  { id: '1', title: 'The Future of Generative AI in Web Development', slug: 'future-of-gen-ai', excerpt: 'How LLMs are changing the way we build and maintain modern web applications.', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', tags: ['AI', 'Web Dev'], category: 'AI', is_published: true, is_featured: true, views: 1200, read_time: 5, created_at: '2024-03-15' },
  { id: '2', title: 'Building Scalable SaaS with Next.js 15', slug: 'scalable-saas-nextjs-15', excerpt: 'Exploring the new features in Next.js 15 and how they benefit large-scale SaaS platforms.', thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80', tags: ['Next.js', 'SaaS'], category: 'WEB', is_published: true, is_featured: false, views: 850, read_time: 8, created_at: '2024-03-10' },
  { id: '3', title: 'Why FastAPI is the Best Choice for AI Backends', slug: 'fastapi-for-ai', excerpt: 'A deep dive into why high-performance Python frameworks are essential for AI integrations.', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', tags: ['FastAPI', 'Python'], category: 'AI', is_published: true, is_featured: false, views: 2100, read_time: 6, created_at: '2024-03-05' },
]

async function getBlogs() {
  try {
    const res = await blogApi.getAll()
    return res.data?.data || MOCK_POSTS
  } catch {
    return MOCK_POSTS
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs()
  const featuredPost = blogs.find(p => p.is_featured) || blogs[0]
  const regularPosts = blogs.filter(p => p.id !== featuredPost.id)

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* Blog Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <SectionHeading
            badge="Insights"
            title="Blog & Articles"
            subtitle="Deep dives into AI, Web Development, and the future of SaaS."
            center
            className="mb-12"
          />
          
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-pink transition-colors" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/5 border border-white/10 focus:border-brand-pink outline-none transition-all text-white"
            />
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="lg:w-3/4 flex flex-col gap-12">
              
              {/* Featured Post */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="group">
                  <GlassCard className="p-0 overflow-hidden border-brand-pink/20 hover:border-brand-pink/50 transition-all flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative aspect-[16/9] md:aspect-auto">
                      <Image src={featuredPost.thumbnail} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-xs font-bold text-brand-pink">
                        <span className="px-2 py-1 bg-brand-pink/10 rounded uppercase">{featuredPost.category}</span>
                        <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.read_time} min read</span>
                      </div>
                      <h2 className="text-3xl font-display font-bold text-white group-hover:text-brand-pink transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-400 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-brand" />
                          <div className="text-sm">
                            <p className="text-white font-semibold">TFX Editorial</p>
                            <p className="text-gray-500">{featuredPost.created_at}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-brand-pink group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              )}

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <GlassCard className="p-0 overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-[16/9]">
                        <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex flex-col gap-4 flex-grow">
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                          <span className="text-brand-pink uppercase">{post.category}</span>
                          <span className="flex items-center gap-1 uppercase"><Clock className="w-3 h-3" /> {post.read_time} MIN</span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-white group-hover:text-brand-pink transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10" />
                          <span className="text-xs text-gray-500">{post.created_at}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>

              {/* Pagination Placeholder */}
              <div className="flex justify-center gap-2 pt-8">
                <button className="w-10 h-10 rounded-lg bg-brand-pink text-white flex items-center justify-center font-bold">1</button>
                <button className="w-10 h-10 rounded-lg bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10">2</button>
                <button className="w-10 h-10 rounded-lg bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10">3</button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/4 flex flex-col gap-10">
              {/* Categories */}
              <GlassCard className="p-8">
                <h4 className="text-lg font-display font-bold text-white mb-6">Categories</h4>
                <div className="flex flex-col gap-4">
                  <CategoryLink label="AI Development" count={12} />
                  <CategoryLink label="Web Technology" count={18} />
                  <CategoryLink label="SaaS Insights" count={8} />
                  <CategoryLink label="Agency Life" count={5} />
                </div>
              </GlassCard>

              {/* Popular Tags */}
              <GlassCard className="p-8">
                <h4 className="text-lg font-display font-bold text-white mb-6">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'FastAPI', 'LLM', 'React', 'TypeScript', 'SaaS', 'Automation', 'Design'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-brand-pink transition-all cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Newsletter */}
              <div className="p-8 rounded-3xl bg-gradient-brand flex flex-col gap-6">
                <h4 className="text-lg font-display font-bold text-white text-center">Join Our Newsletter</h4>
                <p className="text-sm text-white/80 text-center">Get the latest insights delivered straight to your inbox.</p>
                <div className="flex flex-col gap-3">
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder:text-white/60 outline-none focus:bg-white/30 transition-all text-white text-sm" />
                  <AnimatedButton className="w-full bg-white text-black hover:bg-white/90">
                    Subscribe
                  </AnimatedButton>
                </div>
              </div>
            </aside>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function CategoryLink({ label, count }: { label: string, count: number }) {
  return (
    <Link href="#" className="flex items-center justify-between group">
      <span className="text-gray-400 group-hover:text-brand-pink transition-colors text-sm">{label}</span>
      <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-[10px] font-bold border border-white/10">{count}</span>
    </Link>
  )
}
