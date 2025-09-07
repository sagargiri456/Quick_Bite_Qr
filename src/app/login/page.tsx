'use client'
import { useState, useEffect } from 'react'
import { loginWithEmail } from '@/lib/auth/login'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

// Lazy load icon
const Loader2 = dynamic(() => import('lucide-react').then(m => m.Loader2))

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isOffline) return

    setError(null)
    setIsSubmitting(true)

    const { error } = await loginWithEmail(email, password)
    if (error) {
      setError(error)
      setIsSubmitting(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-8 flex items-center justify-center">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Welcome Back!</h1>
          <p className="text-gray-600 mt-2 text-center text-sm sm:text-base">Log in to manage your restaurant.</p>

          {isOffline && (
            <p className="mt-3 text-center text-sm text-red-600 font-medium bg-red-100 p-2 rounded-lg">
              You’re offline. Please reconnect to continue.
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <input
              className="w-full p-3 border-2 rounded-lg text-gray-900 text-sm sm:text-base"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isOffline}
            />

            <input
              className="w-full p-3 border-2 rounded-lg text-gray-900 text-sm sm:text-base"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isOffline}
            />

            {error && (
              <motion.p
                className="text-red-500 text-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isOffline}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold p-3 rounded-lg flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />}
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>

            <p className="text-center text-gray-600 text-sm sm:text-base">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-indigo-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
