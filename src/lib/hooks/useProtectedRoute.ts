'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth/session'

export const useProtectedRoute = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getSession()
      if (!session) {
        // CORRECTED: Redirect to the actual login page
        router.replace('/signup/login') 
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router]) // Added router to dependency array

  return { loading }
}
