import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { blogApi } from '@/lib/api/blog.api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, User, Share2, Twitter, Linkedin, Link as LinkIcon, MessageSquare } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { SectionHeading } from '@/components/common/SectionHeading'

interface Props {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  try {
    const res = await blogApi.getBySlug(slug)
    return res.data.data
  } catch {
    return null
  }
}


export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Post Not Found | TFX AI' }
  return {
    title: `${post.title} | Blog | TFX AI`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnail],
    }
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  // Mock content for display
  const postContent = `
    <h2>The Evolution of Modern Web Stacks</h2>
    <p>In the rapidly changing landscape of web development, staying ahead means embracing tools that not only increase productivity but also deliver exceptional user experiences.</p>
    <blockquote>AI integration is no longer a luxury; it's a fundamental requirement for competitive software products in 2025.</blockquote>
    <p>Next.js has revolutionized how we think about full-stack development, and when paired with FastAPI for AI workloads, it creates an unbeatable foundation for intelligence-first applications.</p>
    <h3>Key Benefits of AI-First Development</h3>
    <ul>
      <li>Automated Decision Making</li>
      <li>Enhanced Personalization</li>
      <li>Natural Language Interaction</li>
      <li>Data-Driven Optimization</li>
    </ul>
    <pre><code>const aiFeature = async () => {
  const response = await api.generate('intelligence');
  return response.data;
}</code></pre>
  `

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-4 text-xs font-bold text-brand-pink mb-6">
                <span className="px-2 py-1 bg-brand-pink/10 rounded uppercase">{post.category}</span>
                <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time} min read</span>
                <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.created_at}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-between py-6 border-y border-white/10 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-brand" />
                  <div>
                    <p className="text-white font-semibold">Arun Kumar Bind</p>
                    <p className="text-gray-500 text-xs">Founder & AI Engineer</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ShareButton icon={<Twitter />} />
                  <ShareButton icon={<Linkedin />} />
                  <ShareButton icon={<LinkIcon />} />
                </div>
              </div>

              <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-invert prose-pink max-w-none prose-h2:font-display prose-h2:text-3xl prose-blockquote:border-brand-pink prose-pre:bg-dark-card prose-pre:border prose-pre:border-white/10 mb-24"
              dangerouslySetInnerHTML={{ __html: postContent }}
            />

            {/* Footer */}
            <footer className="border-t border-white/10 pt-12">
              <div className="flex flex-wrap gap-2 mb-12">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">#{tag}</span>
                ))}
              </div>

              <GlassCard className="p-10 mb-24 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-gradient-brand shrink-0" />
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-display font-bold text-white mb-2">About the Author</h4>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Arun is the founder of TFX AI and a specialist in building intelligent web architectures. He writes about the intersection of AI and modern engineering.
                  </p>
                  <AnimatedButton href="/about" variant="ghost" size="sm">View Profile</AnimatedButton>
                </div>
              </GlassCard>

              {/* Related Posts */}
              <div className="mb-24">
                <SectionHeading title="Keep Reading" className="mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-40">
                  <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                </div>
              </div>

              {/* Newsletter CTA */}
              <GlassCard className="p-12 bg-gradient-brand/5 border-brand-pink/20 text-center flex flex-col items-center gap-6">
                <MessageSquare className="w-12 h-12 text-brand-pink" />
                <h3 className="text-3xl font-display font-bold text-white">Join the Conversation</h3>
                <p className="text-gray-400 max-w-xl mx-auto">
                  Subscribe to our newsletter to get more articles like this directly in your inbox every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-brand-pink text-white" />
                  <AnimatedButton>Subscribe</AnimatedButton>
                </div>
              </GlassCard>
            </footer>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

function ShareButton({ icon }: { icon: any }) {
  return (
    <button className="p-2.5 bg-white/5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all">
      {icon}
    </button>
  )
}
