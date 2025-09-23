import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-foreground'>Sign In</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {error && (
          <div className='p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md'>
            {error}
          </div>
        )}

        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium text-foreground'>
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full px-3 py-2 text-sm border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
            placeholder='Enter your email'
            disabled={isSubmitting}
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='password' className='text-sm font-medium text-foreground'>
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full px-3 py-2 text-sm border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
            placeholder='Enter your password'
            disabled={isSubmitting}
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {onSwitchToRegister && (
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={onSwitchToRegister}
              className='font-medium text-primary hover:text-primary/90'
            >
              Create one here
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
