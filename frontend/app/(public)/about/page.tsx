import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionHeading } from '@/components/common/SectionHeading'
import { GlassCard } from '@/components/common/GlassCard'
import { GradientText } from '@/components/common/GradientText'
import { AnimatedButton } from '@/components/common/AnimatedButton'
import { Github, Linkedin, Target, Eye, Code2, BrainCircuit, Globe2, Database, Laptop2, Cpu } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'About | TFX AI',
  description: 'Learn more about TFX AI, our mission, our tech stack, and the team behind the intelligence.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        {/* About Hero */}
        <section className="container mx-auto px-4 text-center mb-24">
          <SectionHeading
            badge="About Us"
            title="Pioneering the Future of Digital Intelligence"
            center
            className="mb-8"
          />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            TFX AI is a forward-thinking digital agency dedicated to bridging the gap between cutting-edge artificial intelligence and practical business solutions.
          </p>
          <div className="flex justify-center gap-4">
            <AnimatedButton href="/contact">Contact Us</AnimatedButton>
            <AnimatedButton href="/portfolio" variant="outline">View Work</AnimatedButton>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-dark-bg/50 py-24 mb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-brand p-1">
                  <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                    <span className="text-6xl font-display font-bold text-white">AKB</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-brand-pink text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                  Founder
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Arun Kumar Bind</h2>
                <p className="text-brand-pink font-semibold mb-6">Founder & Lead AI Engineer</p>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Full Stack Developer & Generative AI Engineer with a passion for building autonomous systems and high-performance web applications. Arun founded TFX AI to help businesses integrate AI naturally into their digital infrastructure.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <a href="https://github.com" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="https://linkedin.com" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission/Vision */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-10 flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To democratize advanced AI technology by creating accessible, powerful, and ethical digital products that solve real-world problems for businesses of all sizes.
              </p>
            </GlassCard>
            
            <GlassCard className="p-10 flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To become the global leader in AI-integrated development, setting the standard for how intelligence and design converge in the modern digital landscape.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="container mx-auto px-4 mb-24">
          <SectionHeading title="Our Tech Stack" center className="mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StackGroup title="Frontend" icon={<Laptop2 />} color="text-blue-400" items={['Next.js', 'React', 'TypeScript', 'Tailwind', 'Framer Motion']} />
            <StackGroup title="Backend" icon={<Code2 />} color="text-green-400" items={['FastAPI', 'Node.js', 'Express.js', 'Python', 'Go']} />
            <StackGroup title="AI / ML" icon={<BrainCircuit />} color="text-purple-400" items={['Gemini', 'OpenAI', 'LangChain', 'PyTorch', 'TensorFlow']} />
            <StackGroup title="Database" icon={<Database />} color="text-red-400" items={['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Neon']} />
            <StackGroup title="DevOps" icon={<Globe2 />} color="text-orange-400" items={['Vercel', 'Render', 'Docker', 'GitHub Actions', 'AWS']} />
            <StackGroup title="Tools" icon={<Cpu />} color="text-yellow-400" items={['Git', 'Figma', 'Postman', 'VS Code', 'Linear']} />
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="container mx-auto px-4 mb-24">
          <SectionHeading title="Our Journey" center className="mb-16" />
          <div className="max-w-4xl mx-auto flex flex-col gap-12">
            <TimelineItem year="2023" title="Started Freelancing" desc="Building custom web solutions for international clients." />
            <TimelineItem year="2024" title="First SaaS Launch" desc="Developed and launched a successful AI-driven analytics platform." isLast={false} />
            <TimelineItem year="2024" title="AI Expertise" desc="Deep-dived into Generative AI and RAG architectures." isLast={false} />
            <TimelineItem year="2025" title="Founded TFX AI" desc="Established as a full-service agency to scale digital impact." isLast={false} />
            <TimelineItem year="2025" title="50+ Projects" desc="Successfully delivered over 50 projects to satisfied clients globally." isLast={true} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function StackGroup({ title, icon, color, items }: { title: string, icon: any, color: string, items: string[] }) {
  return (
    <GlassCard className="p-8">
      <div className={`flex items-center gap-3 mb-6 ${color}`}>
        {icon}
        <h4 className="text-xl font-display font-bold text-white">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
            {item}
          </span>
        ))}
      </div>
    </GlassCard>
  )
}

function TimelineItem({ year, title, desc, isLast = false }: { year: string, title: string, desc: string, isLast?: boolean }) {
  return (
    <div className="flex gap-8 relative">
      {!isLast && <div className="absolute top-10 bottom-[-48px] left-[19px] w-0.5 bg-gradient-to-b from-brand-pink to-transparent" />}
      <div className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center shrink-0 z-10 shadow-lg shadow-brand-pink/20">
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>
      <div className="pb-12">
        <span className="text-brand-pink font-bold text-sm mb-1 block">{year}</span>
        <h4 className="text-xl font-display font-bold text-white mb-2">{title}</h4>
        <p className="text-gray-400">{desc}</p>
      </div>
    </div>
  )
}
