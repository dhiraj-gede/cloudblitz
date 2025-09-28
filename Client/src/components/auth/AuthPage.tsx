import { useState } from 'react';
import { LoginForm } from './LoginForm.tsx';
import { RegisterForm } from './RegisterForm.tsx';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
import { AuthCard } from '../../components/ui/AuthCard.tsx';

export const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden'>
      {/* Background patterns */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.03),transparent)]' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:64px_64px]' />

      {/* Floating blobs - resized */}
      <div className='absolute top-1/4 left-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-primary/5 rounded-full blur-2xl animate-pulse' />
      <div className='absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000' />
      <div className='absolute top-1/3 right-1/3 w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 bg-accent/5 rounded-full blur-xl animate-pulse delay-500' />

      <div className='w-full max-w-md xl:max-w-6xl relative z-10'>
        {/* Desktop Hero + Form */}
        <div className='hidden xl:flex items-center justify-between gap-16 mb-12'>
          {/* Hero Section */}
          <div className='flex-1 max-w-xl space-y-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl'>
                  <span className='text-primary-foreground font-bold text-xl'>C</span>
                </div>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                  CloudBlitz
                </h1>
              </div>
              <h2 className='text-5xl font-bold text-foreground leading-tight'>
                Welcome to Your <span className='text-primary'>Workspace</span>
              </h2>
              <p className='text-lg text-muted-foreground leading-relaxed'>
                Streamline your workflow with our powerful cloud platform. Join thousands of teams
                already boosting productivity.
              </p>
            </div>

            {/* Features */}
            <div className='grid grid-cols-2 gap-4 mt-8'>
              <div className='flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50'>
                <Monitor className='w-5 h-5 text-primary' />
                <span className='text-sm font-medium text-foreground'>Real-time Collaboration</span>
              </div>
              <div className='flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50'>
                <Tablet className='w-5 h-5 text-secondary' />
                <span className='text-sm font-medium text-foreground'>Cross Platform</span>
              </div>
              <div className='flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50'>
                <Smartphone className='w-5 h-5 text-info' />
                <span className='text-sm font-medium text-foreground'>Mobile Ready</span>
              </div>
              <div className='flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50'>
                <div className='w-5 h-5 bg-success rounded-full flex items-center justify-center'>
                  <span className='text-success-foreground text-xs'>✓</span>
                </div>
                <span className='text-sm font-medium text-foreground'>Secure & Reliable</span>
              </div>
            </div>

            {/* Stats */}
            <div className='flex items-center justify-center xl:justify-start gap-8 mt-8 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-online rounded-full animate-pulse' />
                <span>99.9% Uptime</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-success rounded-full' />
                <span>10K+ Users</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-primary rounded-full' />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <AuthCard className='w-full' size='lg' variant='glass' showDecorations={false}>
            <div className='space-y-6'>
              {/* Mode Switch */}
              <div className='flex items-center justify-center gap-4'>
                <div className='bg-card/80 backdrop-blur-glass border border-border/50 rounded-2xl p-1 shadow-lg w-full max-w-xs'>
                  <div className='flex rounded-xl bg-muted/30 p-1 gap-4'>
                    <button
                      onClick={() => setIsLoginMode(true)}
                      className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg smooth-transition focus-ring ${
                        isLoginMode
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsLoginMode(false)}
                      className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg smooth-transition focus-ring ${
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

              {/* Form */}
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
            </div>
          </AuthCard>
        </div>

        {/* Mobile & Tablet */}
        <div className='xl:hidden w-full max-w-sm mx-auto'>
          {/* Mode Switch */}
          <div className='flex items-center justify-center mb-4 sm:mb-6'>
            <div className='bg-card/80 backdrop-blur-glass border border-border/50 rounded-2xl p-1 shadow-lg w-full max-w-sm'>
              <div className='flex rounded-xl bg-muted/30 p-1 gap-4'>
                <button
                  onClick={() => setIsLoginMode(true)}
                  className={`flex-1 px-4  sm:px-6 py-2.5 sm:py-3 text-sm font-medium rounded-lg smooth-transition focus-ring ${
                    isLoginMode
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLoginMode(false)}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium rounded-lg smooth-transition focus-ring ${
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

          {/* Header */}
          <div className='text-center mb-4 sm:mb-6'>
            <div className='flex items-center justify-center gap-3 mb-3'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg'>
                <span className='text-primary-foreground font-bold text-lg sm:text-xl'>C</span>
              </div>
              <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                CloudBlitz
              </h1>
            </div>
            <p className='text-muted-foreground text-sm sm:text-base'>
              {isLoginMode
                ? 'Welcome back! Sign in to continue'
                : 'Create your account to get started'}
            </p>
          </div>

          {/* Form */}
          <div className='bg-card/80 backdrop-blur-glass border border-border/50 rounded-2xl shadow-xl smooth-transition'>
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

          {/* Footer */}
          <div className='text-center mt-4 sm:mt-6'>
            <div className='flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground'>
              <div className='w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center'>
                <span className='text-primary-foreground text-xs font-bold'>C</span>
              </div>
              <span>CloudBlitz • Secure Authentication</span>
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className='hidden xl:flex items-center justify-between mt-12 pt-8 border-t border-border/50'>
          <div className='flex items-center gap-6 text-sm text-muted-foreground'>
            <span>© 2024 CloudBlitz. All rights reserved.</span>
            <div className='flex items-center gap-4'>
              <button className='hover:text-foreground smooth-transition'>Terms</button>
              <button className='hover:text-foreground smooth-transition'>Privacy</button>
              <button className='hover:text-foreground smooth-transition'>Support</button>
            </div>
          </div>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-online rounded-full animate-pulse' />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
