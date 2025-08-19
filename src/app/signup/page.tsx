'use client'
import { useState } from 'react'
import { signUpWithEmail } from '@/lib/auth/signup'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    const { error } = await signUpWithEmail(email, password)
    if (error) alert(error.message)
    else {
      alert('Check your email to confirm signup')
      router.push('/login')
    }
  }

  return (
    <div>
      <h1>Signup</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  )
}
