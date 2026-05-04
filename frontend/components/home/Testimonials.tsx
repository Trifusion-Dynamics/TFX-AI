'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '../common/SectionHeading'
import { GlassCard } from '../common/GlassCard'
import { Testimonial } from './../../types'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  // Double the items for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  // Handle empty testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-24 bg-dark-bg/30 relative overflow-hidden">
        <div className="container mx-auto px-4 mb-16">
          <SectionHeading
            badge="Testimonials"
            title="What Our Clients Say"
            center
          />
        </div>
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">No testimonials available yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-dark-bg/30 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <SectionHeading
          badge="Testimonials"
          title="What Our Clients Say"
          center
        />
      </div>

      <div className="relative overflow-hidden">
        <motion.div
          animate={{
            x: ['0%', `-${50 * testimonials.length}%`],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-6"
        >
          {duplicatedTestimonials.map((testimonial, idx) => {
            // Ensure testimonial has all required properties
            if (!testimonial || !testimonial.id || !testimonial.name) {
              return null
            }

            return (
              <div key={`${testimonial.id}-${idx}`} className="w-[350px] md:w-[400px] lg:w-[450px] flex-shrink-0">
                <GlassCard className="h-full flex flex-col p-6 md:p-8 relative group hover:border-brand-pink/40 transition-all duration-300">
                  <Quote className="absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 text-white/5 group-hover:text-brand-pink/20 transition-colors duration-300" />
                  
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (testimonial.rating || 0) ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 italic mb-6 leading-relaxed text-sm md:text-base">
                    "{testimonial.content || 'Great experience working with the team!'}"
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    {testimonial.avatar ? (
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-brand-purple/30">
                        <Image 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          fill 
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = `<div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm md:text-base">${testimonial.name[0]}</div>`
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm md:text-base">
                        {testimonial.name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-display font-bold text-sm md:text-base truncate">{testimonial.name}</h4>
                      <p className="text-gray-500 text-xs md:text-sm truncate">
                        {testimonial.role || 'Client'} at {testimonial.company || 'Company'}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
