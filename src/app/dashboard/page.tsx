'use client'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth/logout'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'

export default function DashboardPage() {
  const { loading } = useProtectedRoute()
  const router = useRouter()


  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
