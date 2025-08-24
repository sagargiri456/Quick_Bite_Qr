'use client'
import { useState } from 'react'
import { loginWithEmail } from '@/lib/auth/login'
import {supabase} from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (useMagicLink) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://quickbiteqr.online/dashboard',
        },
      })
      if (error) alert(error.message)
      else alert('Magic link sent! Check your email.')
    } else {
      const { error } = await loginWithEmail(email, password)
      if (error) alert(error.message)
      else router.push('/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      {!useMagicLink && (
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        onClick={handleLogin}
      >
        {useMagicLink ? 'Send Magic Link' : 'Login with Password'}
      </button>
      <p className="mt-4 text-sm text-center">
        {useMagicLink ? 'Prefer password login?' : 'Prefer magic link login?'}{' '}
        <button
          className="text-blue-600 underline"
          onClick={() => setUseMagicLink(!useMagicLink)}
        >
          Switch
        </button>
      </p>
    </div>
  )
}