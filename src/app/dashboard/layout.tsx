import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast } from 'sonner'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bistro Insights - Restaurant Dashboard',
  description: 'Monitor your restaurant\'s performance with real-time analytics, sales trends, and customer insights all in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 