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

  return (
    <section className="py-24 bg-dark-bg/30 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <SectionHeading
          badge="Testimonials"
          title="What Our Clients Say"
          center
        />
      </div>

      <div className="flex overflow-hidden relative">
        <motion.div
          animate={{
            x: [0, -100 * testimonials.length + '%'],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-6 whitespace-nowrap"
        >
          {duplicatedTestimonials.map((testimonial, idx) => (
            <div key={`${testimonial.id}-${idx}`} className="w-[350px] md:w-[450px] shrink-0">
              <GlassCard className="h-full flex flex-col p-8 whitespace-normal relative group">
                <Quote className="absolute top-6 right-8 w-12 h-12 text-white/5 group-hover:text-brand-pink/10 transition-colors" />
                
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-300 italic mb-8 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="mt-auto flex items-center gap-4">
                  {testimonial.avatar ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-purple/30">
                      <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-display font-bold text-sm">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
