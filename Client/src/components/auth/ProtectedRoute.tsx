import type { ReactNode } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.ts';
import { Loading } from '../ui/Loading.tsx';
import { AccessDenied, AccessDeniedAction } from '../ui/AccessDenied.tsx';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string | string[];
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  fallback = (
    <div className='text-center text-muted-foreground'>
      You don't have permission to access this page.
    </div>
  ),
}) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background/50'>
        <Loading
          variant='ring'
          size='lg'
          text='Verifying access...'
          className='bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg'
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AccessDenied
        icon={<Lock className='w-6 h-6' />}
        title='Authentication Required'
        message={fallback}
        variant='error'
        action={
          <AccessDeniedAction onClick={() => (window.location.href = '/login')}>
            Sign In to Continue
          </AccessDeniedAction>
        }
      />
    );
  }

  if (roles && !hasRole(roles)) {
    return (
      <AccessDenied
        icon={<ShieldAlert className='w-6 h-6' />}
        title='Access Restricted'
        message={fallback}
        variant='warning'
        action={
          <AccessDeniedAction variant='outline' onClick={() => (window.location.href = '/')}>
            Back to Safety
          </AccessDeniedAction>
        }
      />
    );
  }

  return <>{children}</>;
};
