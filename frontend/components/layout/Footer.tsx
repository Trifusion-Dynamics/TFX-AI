import Link from 'next/link'
import Image from 'next/image'
import { Zap, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react'
import { GradientText } from '../common/GradientText'
import { AnimatedButton } from '../common/AnimatedButton'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-dark-card border-t border-dark-border pt-16 pb-8 overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-brand opacity-50" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center group">
              <div className="relative h-20 w-16 overflow-hidden">
                <Image 
                  src="/mainLogo.png" 
                  alt="TFX AI Logo" 
                  fill 
                  className="object-contain group-hover:scale-105 transition-transform duration-300" 
                  priority
                />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-white">
                TFX <GradientText>AI</GradientText>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transforming businesses with cutting-edge AI solutions and modern web development. We build the future, today.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#0a66c2] transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#1da1f2] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://wa.me" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#25d366] transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">About Us</Link></li>
              <li><Link href="/portfolio" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">Our Work</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6">Services</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/services/ai-development" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">AI Development</Link></li>
              <li><Link href="/services/web-apps" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">Web Applications</Link></li>
              <li><Link href="/services/mobile-apps" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">Mobile Apps</Link></li>
              <li><Link href="/services/ui-ux" className="text-sm text-gray-400 hover:text-brand-pink transition-colors">UI/UX Design</Link></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest AI news and updates from TFX AI.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-brand-purple outline-none text-sm transition-colors"
                required
              />
              <AnimatedButton type="submit" variant="primary" className="w-full">
                Subscribe
              </AnimatedButton>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} TFX AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
