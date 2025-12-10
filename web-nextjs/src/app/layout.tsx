import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Pune Table Tennis - Professional Coaching & Equipment',
  description: 'Professional table tennis coaching and equipment in Pune. Expert coaches, premium Butterfly & Stiga equipment. Join our academy for world-class training.',
  keywords: 'table tennis pune, table tennis coaching pune, butterfly equipment pune, stiga blades pune, tt coaching, table tennis academy',
  openGraph: {
    title: 'Pune Table Tennis - Professional Coaching & Equipment',
    description: 'Professional table tennis coaching and equipment in Pune',
    url: 'https://dreamtabletennis.com',
    siteName: 'Pune Table Tennis',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white">
        <CartProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
