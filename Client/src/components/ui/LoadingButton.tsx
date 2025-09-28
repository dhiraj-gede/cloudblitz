import type { ReactNode } from 'react';

interface LoadingButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  loadingText: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  disabled = false,
  onClick,
  className = '',
  loadingText,
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
}) => {
  const baseStyles =
    'w-full font-medium rounded-lg shadow-sm smooth-transition focus-ring disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/20',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary/20',
    outline: 'border border-border bg-transparent hover:bg-accent text-foreground',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/20',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {/* Animated background shine effect */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full smooth-transition' />

      {isLoading ? (
        <div className='flex items-center justify-center space-x-3 relative z-10'>
          <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
          <span className='font-medium'>{loadingText}</span>
        </div>
      ) : (
        <span className='relative z-10 font-medium'>{children}</span>
      )}

      {/* Focus ring enhancement */}
      <div className='absolute inset-0 rounded-lg ring-2 ring-ring/0 focus:ring-ring/20 smooth-transition pointer-events-none' />
    </button>
  );
};
