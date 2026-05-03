import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits').optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(300),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

export type ContactFormData = z.infer<typeof contactSchema>
