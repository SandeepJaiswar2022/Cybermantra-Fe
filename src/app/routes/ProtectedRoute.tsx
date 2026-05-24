import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import type { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const location = useLocation();

  // Wait for auth initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their proper dashboard
    const dashboardRoute =
      user.role === 'ADMIN'
        ? ROUTES.ADMIN.DASHBOARD
        : user.role === 'INSTRUCTOR'
          ? ROUTES.INSTRUCTOR.DASHBOARD
          : ROUTES.STUDENT.DASHBOARD;

    return <Navigate to={dashboardRoute} replace />;
  }

  return <>{children}</>;
}

// Redirect authenticated users away from auth pages
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const dashboardRoute =
      user.role === 'ADMIN'
        ? ROUTES.ADMIN.DASHBOARD
        : user.role === 'INSTRUCTOR'
          ? ROUTES.INSTRUCTOR.DASHBOARD
          : ROUTES.STUDENT.DASHBOARD;

    return <Navigate to={dashboardRoute} replace />;
  }

  return <>{children}</>;
}
