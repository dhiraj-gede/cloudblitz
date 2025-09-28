import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showDecorations?: boolean;
  showBranding?: boolean;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  showDecorations = true,
  showBranding = true,
}) => {
  const variants = {
    default: 'bg-card border border-border shadow-sm',
    elevated: 'bg-card/95 border border-border shadow-lg backdrop-blur-sm',
    glass: 'bg-card/60 border border-border/30 shadow-lg backdrop-blur-glass',
    minimal: 'bg-transparent border-none shadow-none',
  };

  const sizes = {
    sm: 'max-w-sm p-6',
    md: 'max-w-md p-8',
    lg: 'max-w-lg p-10',
    xl: 'max-w-xl p-12',
  };

  return (
    <div className='flex-1'>
      {/* Optional Decorations */}
      {showDecorations && (
        <>
          <div className='absolute top-10 left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float-slow' />
          <div className='absolute bottom-16 right-16 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-float-medium delay-1000' />
          <div className='absolute top-20 right-20 w-20 h-20 bg-accent/10 rounded-full blur-lg animate-float-fast delay-500' />
        </>
      )}

      {/* Main Card */}
      <div
        className={`relative rounded-xl overflow-hidden ${variants[variant]} ${sizes[size]} z-10 ${className}`}
      >
        {children}
      </div>

      {/* Optional Branding */}
      {showBranding && (
        <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 text-xs text-muted-foreground/80 flex items-center gap-2'>
          <div className='flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/30'>
            <div className='w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center shadow-sm'>
              <span className='text-primary-foreground text-xs font-bold'>C</span>
            </div>
            <span>CloudBlitz</span>
            <div className='w-1 h-1 bg-success rounded-full animate-pulse' />
            <span className='text-xs text-muted-foreground/60'>Secure Auth</span>
          </div>
        </div>
      )}
    </div>
  );
};
