import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import CalculatorClient from './calculator-client'

export const metadata = {
  title: 'Project Cost Calculator | TFX AI',
  description: 'Estimate your project cost instantly. Get a rough budget range for web development, AI chatbot, or SaaS project.',
}

export default function CalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <CalculatorClient />
        </div>
      </main>
      <Footer />
    </>
  )
}
