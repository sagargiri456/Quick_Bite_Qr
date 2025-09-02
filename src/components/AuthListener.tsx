'use client'
import { useEffect } from 'react'
import { supabase }  from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthListener() {
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth event:', event)

      if (event === 'SIGNED_IN') {
        router.push('/dashboard') // or wherever you want
      }

      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }

      // You can also handle TOKEN_REFRESHED, USER_UPDATED, etc.
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return null
}
