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
        router.replace('/login') // redirect if not logged in
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  return { loading }
}
