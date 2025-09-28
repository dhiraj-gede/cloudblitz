import type { ReactNode } from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'progress';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
  textClassName?: string;
  showProgress?: boolean;
  progress?: number; // 0-100
  children?: ReactNode;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  overlay = false,
  className = '',
  textClassName = '',
  showProgress = false,
  progress = 0,
  children,
}) => {
  const sizeStyles = {
    sm: {
      container: 'p-4',
      loader: 'w-4 h-4',
      text: 'text-xs mt-2',
      progress: 'h-1',
    },
    md: {
      container: 'p-6',
      loader: 'w-6 h-6',
      text: 'text-sm mt-3',
      progress: 'h-1.5',
    },
    lg: {
      container: 'p-8',
      loader: 'w-8 h-8',
      text: 'text-base mt-4',
      progress: 'h-2',
    },
    xl: {
      container: 'p-10',
      loader: 'w-12 h-12',
      text: 'text-lg mt-4',
      progress: 'h-2.5',
    },
  };

  const currentSize = sizeStyles[size];

  // Loader variants
  const loaders = {
    spinner: (
      <div className={`border-2 border-primary/20 rounded-full ${currentSize.loader}`}>
        <div className='w-full h-full border-2 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    ),
    dots: (
      <div className={`flex space-x-1 ${currentSize.loader}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='w-1/3 bg-primary rounded-full animate-bounce'
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    ),
    pulse: <div className={`bg-primary rounded-full animate-pulse ${currentSize.loader}`} />,
    bars: (
      <div className={`flex space-x-1 items-end ${currentSize.loader}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='w-1/5 bg-primary rounded-t-sm animate-pulse'
            style={{
              height: `${(i % 2 === 0 ? 60 : 100) + i * 5}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    ),
    ring: (
      <div className={`relative ${currentSize.loader}`}>
        <div className='absolute inset-0 border-4 border-primary/20 rounded-full' />
        <div className='absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    ),
    progress: (
      <div className={`w-full bg-muted rounded-full overflow-hidden ${currentSize.progress}`}>
        <div
          className='bg-primary smooth-transition h-full rounded-full'
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    ),
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center ${currentSize.container} ${className}`}
    >
      {/* Loader */}
      {variant !== 'progress' && loaders[variant]}

      {/* Progress bar variant */}
      {variant === 'progress' && (
        <div className='w-full max-w-xs'>
          {loaders.progress}
          {showProgress && (
            <div className='text-xs text-muted-foreground mt-2'>{Math.round(progress)}%</div>
          )}
        </div>
      )}

      {/* Text */}
      {text && (
        <p className={`text-muted-foreground font-medium ${currentSize.text} ${textClassName}`}>
          {text}
        </p>
      )}

      {/* Custom children content */}
      {children}
    </div>
  );

  // Container variants
  if (fullScreen) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'>
        <div className='bg-card border border-border rounded-xl shadow-lg'>{content}</div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10'>
        <div className='bg-card border border-border rounded-lg shadow-lg'>{content}</div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center bg-card border border-border rounded-lg shadow-sm'>
      {content}
    </div>
  );
};

// Additional specialized loading components
export const PageLoading: React.FC<Partial<LoadingProps>> = (props) => (
  <Loading fullScreen variant='spinner' size='lg' text='Loading page...' {...props} />
);

export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`border-2 border-current border-t-transparent rounded-full animate-spin ${sizes[size]}`}
    />
  );
};

export const InlineLoading: React.FC<{ text?: string; className?: string }> = ({
  text = 'Loading...',
  className = '',
}) => (
  <div className={`inline-flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
    <div className='w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin' />
    {text}
  </div>
);

// Loading overlay for containers
export const LoadingOverlay: React.FC<LoadingProps & { isVisible?: boolean }> = ({
  isVisible = true,
  ...props
}) => {
  if (!isVisible) return null;

  return (
    <div className='absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10'>
      <Loading overlay={false} {...props} />
    </div>
  );
};
