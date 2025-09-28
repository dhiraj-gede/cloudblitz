import { AlertCircle, X, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface ErrorAlertProps {
  message: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: ReactNode;
  title?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  variant = 'error',
  size = 'md',
  dismissible = false,
  onDismiss,
  className = '',
  icon,
  title,
}) => {
  const variantStyles = {
    error: {
      bg: 'bg-error-bg',
      border: 'border-error/20',
      text: 'text-error-fg',
      icon: 'text-error',
      iconBg: 'bg-error/10',
      accent: 'border-l-error',
    },
    warning: {
      bg: 'bg-warning-bg',
      border: 'border-warning/20',
      text: 'text-warning-fg',
      icon: 'text-warning',
      iconBg: 'bg-warning/10',
      accent: 'border-l-warning',
    },
    info: {
      bg: 'bg-info-bg',
      border: 'border-info/20',
      text: 'text-info-fg',
      icon: 'text-info',
      iconBg: 'bg-info/10',
      accent: 'border-l-info',
    },
    success: {
      bg: 'bg-success-bg',
      border: 'border-success/20',
      text: 'text-success-fg',
      icon: 'text-success',
      iconBg: 'bg-success/10',
      accent: 'border-l-success',
    },
  };

  const sizeStyles = {
    sm: 'p-2 text-xs gap-1.5',
    md: 'p-3 text-sm gap-2',
    lg: 'p-4 text-base gap-3',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const defaultIcons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle2,
  };

  const IconComponent = defaultIcons[variant];
  const styles = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const currentIconSize = iconSize[size];

  return (
    <div
      className={`
        relative w-full rounded-lg border smooth-transition
        ${styles.bg} ${styles.border} ${styles.text} ${styles.accent}
        border-l-4 ${currentSize} ${className}
        animate-slide-down
      `}
      role='alert'
      aria-live='polite'
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-start gap-3 flex-1'>
          {/* Icon */}
          <div className={`flex-shrink-0 rounded-full p-1.5 ${styles.iconBg} ${currentIconSize}`}>
            {icon || <IconComponent className={`${currentIconSize} ${styles.icon}`} />}
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            {title && <h4 className={`font-semibold mb-1 ${styles.text}`}>{title}</h4>}
            <p className={`leading-relaxed ${title ? 'text-sm' : ''}`}>{message}</p>
          </div>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={onDismiss}
            className={`
              flex-shrink-0 ml-2 rounded-full p-1 smooth-transition
              hover:bg-black/10 focus:outline-none focus-ring
              ${styles.text} ${styles.icon}
            `}
            aria-label='Dismiss alert'
          >
            <X className={currentIconSize} />
          </button>
        )}
      </div>

      {/* Progress bar for auto-dismiss (optional enhancement) */}
      {dismissible && (
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-20 rounded-b-lg overflow-hidden'>
          <div
            className={`h-full bg-current opacity-40 animate-pulse ${styles.accent.split('border-l-')[1]}`}
          />
        </div>
      )}
    </div>
  );
};
