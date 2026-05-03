'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../common/SectionHeading'
import { GlassCard } from '../common/GlassCard'
import { Service } from '@/types'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface ServicesOverviewProps {
  services: Service[]
}

const BRAND_COLORS = [
  'bg-brand-purple',
  'bg-brand-pink',
  'bg-brand-red',
  'bg-brand-orange',
  'bg-brand-yellow',
  'bg-brand-base',
]

export function ServicesOverview({ services }: ServicesOverviewProps) {
  return (
    <section className="py-24 px-4 bg-dark-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[100px] -mr-64 -mt-64" />
      
      <div className="container mx-auto">
        <SectionHeading
          badge="Services"
          title="End-to-end digital solutions"
          center
          className="mb-16"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <GlassCard
                hover
                className="h-full flex flex-col group relative overflow-hidden"
              >
                {/* Glow Effect */}
                <div className={cn(
                  "absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity",
                  BRAND_COLORS[idx % BRAND_COLORS.length]
                )} />

                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform",
                  BRAND_COLORS[idx % BRAND_COLORS.length]
                )}>
                  {/* Icon Placeholder - in production you'd use a dynamic icon component */}
                  <div className="text-xl font-bold">{service.title[0]}</div>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {service.short_desc}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.slice(0, 3).map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-brand-pink" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-pink hover:text-brand-purple transition-colors group/link"
                >
                  Learn More 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
