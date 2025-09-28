import React from 'react';

interface ContentHeaderProps {
  label: string;
  description: string;
  userRoleConfig: {
    label: string;
    badge: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  };
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  gradient?: 'default' | 'subtle' | 'none';
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  label,
  description,
  userRoleConfig,
  breadcrumbs,
  actions,
  gradient = 'default',
}) => {
  const gradientClasses = {
    default: 'bg-gradient-to-r from-card via-card to-accent/10',
    subtle: 'bg-gradient-to-r from-background to-accent/5',
    none: 'bg-card',
  };

  const badgeVariants = {
    default: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-success-bg text-success-fg border-success/20',
    warning: 'bg-warning-bg text-warning-fg border-warning/20',
    error: 'bg-error-bg text-error-fg border-error/20',
    info: 'bg-info-bg text-info-fg border-info/20',
  };

  return (
    <div
      className={`relative border-b border-border ${gradientClasses[gradient]} backdrop-blur-glass`}
    >
      {/* Subtle background pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--accent)/0.02)_50%,transparent_75%)] bg-[length:250px_250px] opacity-20' />

      <div className='relative px-4 lg:px-8 py-6 lg:py-8'>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className='flex items-center gap-2 mb-3 text-sm' aria-label='Breadcrumb'>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className='text-muted-foreground/40 mx-1'>/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className='text-muted-foreground hover:text-foreground smooth-transition'
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className='text-foreground font-medium'>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-2xl lg:text-4xl font-bold text-foreground tracking-tight'>
                {label}
              </h1>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                  badgeVariants[userRoleConfig.variant || 'default']
                } ${userRoleConfig.badge} backdrop-blur-sm`}
              >
                {userRoleConfig.label}
              </span>
            </div>

            <p className='text-muted-foreground text-lg max-w-3xl leading-relaxed'>{description}</p>

            {/* Stats/Info row - optional additional context */}
            <div className='flex items-center gap-6 mt-4 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1.5'>
                <div className='w-2 h-2 bg-online rounded-full animate-pulse' />
                Last updated: Just now
              </span>
              <span className='flex items-center gap-1.5'>
                <div className='w-2 h-2 bg-focus rounded-full' />
                Active session
              </span>
            </div>
          </div>

          {/* Actions section */}
          {actions && <div className='flex items-center gap-3 lg:justify-end'>{actions}</div>}
        </div>
      </div>

      {/* Bottom accent border */}
      <div className='h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent' />
    </div>
  );
};
