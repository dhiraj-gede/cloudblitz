import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-glass data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border/50 bg-card/80 backdrop-blur-glass p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl md:w-full',
        className
      )}
      {...props}
    >
      {/* Background gradient overlay */}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 pointer-events-none' />

      {/* Border gradient */}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 p-px pointer-events-none'>
        <div className='w-full h-full rounded-2xl bg-card/80 backdrop-blur-glass' />
      </div>

      {/* Content container */}
      <div className='relative z-10'>{children}</div>

      <DialogPrimitive.Close className='absolute right-4 top-4 z-20 rounded-xl p-2 opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:bg-accent/50 backdrop-blur-sm'>
        <X className='h-4 w-4' />
        <span className='sr-only'>Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-card-foreground',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Enhanced Dialog with additional styling options
interface EnhancedDialogProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated';
}

const EnhancedDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & EnhancedDialogProps
>(({ className, children, variant = 'glass', ...props }, ref) => {
  const variantStyles = {
    default: 'bg-card border-border',
    glass: 'bg-card/80 backdrop-blur-glass border-border/50',
    elevated: 'bg-card/90 backdrop-blur-sm border-border shadow-2xl',
  };

  const variantKey: keyof typeof variantStyles = variant;

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl md:w-full',
          variantStyles[variantKey],
          className
        )}
        {...props}
      >
        {/* Glass morphism background effects */}
        {(variant === 'glass' || variant === 'elevated') && (
          <>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-60 pointer-events-none' />
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none' />
          </>
        )}

        {/* Border gradient for glass variant */}
        {variant === 'glass' && (
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/15 via-transparent to-secondary/15 p-px pointer-events-none'>
            <div className='w-full h-full rounded-2xl bg-card/80 backdrop-blur-glass' />
          </div>
        )}

        {/* Content container */}
        <div className='relative z-10'>{children}</div>

        <DialogPrimitive.Close
          className={cn(
            'absolute right-4 top-4 z-20 rounded-xl p-2 opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground backdrop-blur-sm',
            variant === 'glass' ? 'hover:bg-accent/30' : 'hover:bg-accent/50'
          )}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
EnhancedDialogContent.displayName = 'EnhancedDialogContent';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  EnhancedDialogContent,
};
