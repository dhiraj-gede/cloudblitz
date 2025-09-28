// Updated AccessDenied component with destructive variant
import type { ReactNode } from 'react';

interface AccessDeniedProps {
  icon: ReactNode;
  title: string;
  message: ReactNode;
  action?: ReactNode;
  variant?: 'error' | 'warning' | 'info' | 'destructive';
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  icon,
  title,
  message,
  action,
  variant = 'error',
}) => {
  const variantStyles = {
    error: {
      iconBg: 'bg-error-bg',
      iconColor: 'text-error',
      border: 'border-error/20',
      glow: 'shadow-error/5',
    },
    warning: {
      iconBg: 'bg-warning-bg',
      iconColor: 'text-warning',
      border: 'border-warning/20',
      glow: 'shadow-warning/5',
    },
    info: {
      iconBg: 'bg-info-bg',
      iconColor: 'text-info',
      border: 'border-info/20',
      glow: 'shadow-info/5',
    },
    destructive: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      border: 'border-destructive/20',
      glow: 'shadow-destructive/5',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className='flex items-center justify-center min-h-screen bg-background p-6'>
      <div
        className={`bg-card border ${currentVariant.border} rounded-2xl p-8 text-center max-w-md w-full shadow-lg ${currentVariant.glow} backdrop-blur-glass`}
      >
        {/* Icon Container */}
        <div
          className={`w-16 h-16 ${currentVariant.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}
        >
          <div className={`text-2xl ${currentVariant.iconColor}`}>{icon}</div>
        </div>

        {/* Title */}
        <h3 className='text-xl font-semibold text-card-foreground mb-3 tracking-tight'>{title}</h3>

        {/* Message */}
        <div className='text-muted-foreground text-sm leading-relaxed mb-6'>{message}</div>

        {/* Optional Action */}
        {action && <div className='flex justify-center'>{action}</div>}

        {/* Decorative Elements */}
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-50 pointer-events-none' />
      </div>

      {/* Background Pattern */}
      <div className='fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10' />
    </div>
  );
};

// AccessDeniedAction component remains the same
export const AccessDeniedAction: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}> = ({ children, onClick, variant = 'primary' }) => {
  const baseStyles = 'px-6 py-2.5 rounded-lg font-medium smooth-transition focus-ring';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-transparent hover:bg-accent text-foreground',
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
};
