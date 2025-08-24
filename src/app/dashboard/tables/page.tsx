'use client'
import { useState } from 'react'
import { loginWithEmail } from '@/lib/auth/login'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    const { error } = await loginWithEmail(email, password)
    if (error) {
      setError(error.message)
      setIsSubmitting(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Welcome Back!</h1>
          <p className="text-gray-600 mt-2 text-center">Log in to manage your restaurant.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* --- MODIFICATION: Added 'text-gray-900' --- */}
            <input
              className="w-full p-3 border-2 rounded-lg text-gray-900"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {/* --- MODIFICATION: Added 'text-gray-900' --- */}
            <input
              className="w-full p-3 border-2 rounded-lg text-gray-900"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold p-3 rounded-lg flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-indigo-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}