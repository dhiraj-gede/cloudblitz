import { useState } from 'react';
import { LoginForm } from './LoginForm.tsx';
import { RegisterForm } from './RegisterForm.tsx';

export const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Enhanced background elements */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.03),transparent)]' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:64px_64px]' />

      {/* Floating background elements */}
      <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse' />
      <div className='absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000' />
      <div className='absolute top-1/3 right-1/3 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse delay-500' />

      <div className='w-full max-w-md relative z-10'>
        {/* Mode indicator */}
        <div className='flex items-center justify-center mb-8'>
          <div className='bg-card/80 backdrop-blur-glass border border-border/50 rounded-2xl p-1 shadow-lg'>
            <div className='flex rounded-xl bg-muted/30 p-1'>
              <button
                onClick={() => setIsLoginMode(true)}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg smooth-transition focus-ring ${
                  isLoginMode
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg smooth-transition focus-ring ${
                  !isLoginMode
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Form container with enhanced styling */}
        <div className='bg-card/80 backdrop-blur-glass border border-border/50 rounded-2xl shadow-xl smooth-transition hover-lift'>
          <div className='p-px rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10'>
            <div className='rounded-2xl bg-card/95 backdrop-blur-sm p-1'>
              {isLoginMode ? (
                <LoginForm
                  onSuccess={() => console.log('Login successful')}
                  onSwitchToRegister={() => setIsLoginMode(false)}
                />
              ) : (
                <RegisterForm
                  onSuccess={() => console.log('Registration successful')}
                  onSwitchToLogin={() => setIsLoginMode(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className='text-center mt-6'>
          <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
            <div className='w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center'>
              <span className='text-primary-foreground text-xs font-bold'>C</span>
            </div>
            <span>CloudBlitz • Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
