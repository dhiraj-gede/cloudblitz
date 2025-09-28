import type { ReactNode } from 'react';

interface AuthCardHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'gradient';
  className?: string;
}

export const AuthCardHeader: React.FC<AuthCardHeaderProps> = ({
  icon,
  title,
  subtitle,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      icon: 'w-10 h-10 text-base',
      title: 'text-xl',
      subtitle: 'text-xs',
    },
    md: {
      icon: 'w-12 h-12 text-lg',
      title: 'text-2xl',
      subtitle: 'text-sm',
    },
    lg: {
      icon: 'w-16 h-16 text-xl',
      title: 'text-3xl',
      subtitle: 'text-base',
    },
  };

  const variantStyles = {
    default: {
      icon: 'bg-primary text-primary-foreground rounded-xl shadow-sm',
      title: 'text-card-foreground',
      subtitle: 'text-muted-foreground',
    },
    minimal: {
      icon: 'bg-transparent text-primary border-2 border-primary/20 rounded-xl',
      title: 'text-card-foreground',
      subtitle: 'text-muted-foreground',
    },
    gradient: {
      icon: 'bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-xl shadow-sm',
      title: 'bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent',
      subtitle: 'text-muted-foreground',
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <div className={`text-center mb-6 smooth-transition ${className}`}>
      {/* Icon Container */}
      <div
        className={`flex items-center justify-center mx-auto mb-4 ${currentSize.icon} ${currentVariant.icon} smooth-transition hover-lift`}
      >
        <div className='flex items-center justify-center'>{icon}</div>
      </div>

      {/* Title */}
      <h2
        className={`font-semibold tracking-tight mb-3 ${currentSize.title} ${currentVariant.title}`}
      >
        {title}
      </h2>

      {/* Subtitle */}
      <p
        className={`leading-relaxed max-w-md mx-auto ${currentSize.subtitle} ${currentVariant.subtitle}`}
      >
        {subtitle}
      </p>

      {/* Decorative line */}
      <div className='w-16 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent mx-auto mt-4 opacity-60' />
    </div>
  );
};
