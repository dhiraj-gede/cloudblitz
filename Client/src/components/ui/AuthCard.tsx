import type { ReactNode } from 'react';
import './index.css';
interface AuthCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBranding?: boolean;
  showDecorations?: boolean;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  description,
  variant = 'default',
  size = 'md',
  className = '',
  showBranding = true,
  showDecorations = true,
}) => {
  const variantStyles = {
    default: 'bg-card border-border shadow-sm',
    elevated: 'bg-card border-border shadow-lg backdrop-blur-sm bg-card/95',
    glass: 'bg-card/60 border-border/30 shadow-lg backdrop-blur-glass border',
    minimal: 'bg-transparent border-transparent shadow-none',
  };

  const sizeStyles = {
    sm: 'max-w-sm p-6 space-y-4',
    md: 'max-w-md p-8 space-y-6',
    lg: 'max-w-lg p-10 space-y-8',
    xl: 'max-w-xl p-12 space-y-8',
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4 relative overflow-hidden'>
      {/* Enhanced background with gradient mesh */}
      {showDecorations && (
        <>
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)] opacity-40' />
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:64px_64px] opacity-10' />

          {/* Animated floating elements */}
          <div className='absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float-slow' />
          <div className='absolute bottom-32 right-16 w-48 h-48 bg-secondary/10 rounded-full blur-xl animate-float-medium delay-1000' />
          <div className='absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-lg animate-float-fast delay-500' />
        </>
      )}

      <div
        className={`relative w-full ${sizeStyles[size]} ${variantStyles[variant]} rounded-xl border-0 smooth-transition z-10 ${className}`}
      >
        {/* Enhanced card with better shadow and backdrop */}
        <div
          className={`relative bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg p-px overflow-hidden ${
            variant === 'minimal' ? 'bg-transparent border-transparent shadow-none' : ''
          }`}
        >
          {/* Gradient border effect */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-xl' />

          {/* Main content container */}
          <div className='relative bg-card/80 backdrop-blur-sm rounded-[11px] p-6 lg:p-8'>
            {/* Card header with enhanced typography */}
            {(title || description) && (
              <div className='text-center mb-8'>
                {title && (
                  <h1 className='text-2xl lg:text-3xl font-bold text-card-foreground mb-3 tracking-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent'>
                    {title}
                  </h1>
                )}
                {description && (
                  <p className='text-muted-foreground text-sm lg:text-base leading-relaxed max-w-md mx-auto'>
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Card content */}
            <div className={`${sizeStyles[size].split(' ')[2]}`}>{children}</div>

            {/* Enhanced decorative elements */}
            {showDecorations && (
              <>
                <div className='absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/30 rounded-tl-xl' />
                <div className='absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-secondary/30 rounded-br-xl' />
                <div className='absolute top-4 right-4 w-2 h-2 bg-success rounded-full animate-pulse' />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced footer branding */}
      {showBranding && (
        <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10'>
          <div className='flex items-center gap-3 text-sm text-muted-foreground/80'>
            <div className='flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/30'>
              <div className='w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center shadow-sm'>
                <span className='text-primary-foreground text-xs font-bold'>C</span>
              </div>
              <span className='font-medium'>CloudBlitz</span>
              <div className='w-1 h-1 bg-success rounded-full animate-pulse' />
              <span className='text-xs text-muted-foreground/60'>Secure Auth</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
