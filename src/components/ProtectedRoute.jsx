// ============================================================
// EMCS: Protected Route Guard
// Redirects unauthenticated users to /auth
// Optionally restricts by role
// ============================================================
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole, requiredRoles }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const activeRole = profile?.role || user?.user_metadata?.role

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#888',
        fontSize: '1.1rem',
      }}>
        Loading...
      </div>
    )
  }

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Check role if required
  const allowedRoles = requiredRoles || (requiredRole ? [requiredRole] : null)
  if (allowedRoles && activeRole) {
    if (!allowedRoles.includes(activeRole)) {
      // Authenticated but wrong role → redirect to their portal
      const roleRoutes = {
        admin: '/admin/dashboard',
        teacher: '/teacher/dashboard',
        parent: '/portal/parent',
        student: '/portal/student',
        agent: '/portal/agent',
      }
      const redirect = roleRoutes[activeRole] || '/'
      return <Navigate to={redirect} replace />
    }
  }

  return children
}
