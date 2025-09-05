import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <div>Loading...</div> // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (adminOnly && user.user_metadata?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
