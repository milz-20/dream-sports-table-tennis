import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import NextAuthProvider from '@/components/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'All About Table Tennis - Premium Equipment & Accessories',
  description: 'Premium table tennis equipment and accessories in India. Genuine Butterfly, Stiga, DHS products with fast shipping.',
  keywords: 'table tennis india, tt equipment, butterfly blades, stiga equipment, table tennis shop',
  openGraph: {
    title: 'All About Table Tennis - Premium Equipment & Accessories',
    description: 'Premium table tennis equipment and accessories',
    url: 'https://allabouttabletennis.in',
    siteName: 'All About Table Tennis',
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
        <NextAuthProvider>
          <AuthProvider>
            <CartProvider>
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
