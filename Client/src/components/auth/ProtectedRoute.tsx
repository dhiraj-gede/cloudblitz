import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string | string[];
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  fallback = <div>Access denied</div>,
}) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  if (roles && !hasRole(roles)) {
    return fallback;
  }

  return <>{children}</>;
};
