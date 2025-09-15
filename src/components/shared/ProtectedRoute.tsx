import { Navigate, Outlet } from 'react-router-dom';
import { useClerkAuthContext } from '@/contexts/ClerkAuthContext';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useClerkAuthContext();

  if (!isLoaded) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Note: Admin role checking would need to be implemented differently with Clerk
  // For now, we'll just check if they're signed in
  if (adminOnly) {
    // You might need to implement admin checking based on Clerk's user metadata
    // For now, let's assume non-admin users can access admin routes for testing
    // In production, you'd want to check user.organization_memberships or custom claims
  }

  return <Outlet />;
}