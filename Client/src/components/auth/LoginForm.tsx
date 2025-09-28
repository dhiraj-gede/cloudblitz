// LoginForm.tsx
import { useState } from 'react';
import { User, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.ts';
import { AuthCard } from '../ui/AuthCard.tsx';
import { AuthCardHeader } from '../ui/AuthCardHeader.tsx';
import { InputField } from '../ui/InputField.tsx';
import { PasswordInput } from '../ui/PasswordInput.tsx';
import { ErrorAlert } from '../ui/ErrorAlert.tsx';
import { LoadingButton } from '../ui/LoadingButton.tsx';
import { SwitchAuthMode } from '../ui/SwitchAuthMode.tsx';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}
export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const handleChange = (field: keyof typeof credentials) => (value: string) =>
    setCredentials((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(credentials.email, credentials.password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <AuthCard>
      {' '}
      <AuthCardHeader
        icon={<User className='w-5 h-5' />}
        title='Welcome Back'
        subtitle='Sign in to your account'
      />{' '}
      <form className='space-y-4' onSubmit={handleSubmit} noValidate>
        {' '}
        {error && <ErrorAlert message={error} />}{' '}
        <InputField
          id='email'
          label='Email'
          type='email'
          value={credentials.email}
          onChange={handleChange('email')}
          placeholder='Enter your email'
          required
          disabled={isSubmitting}
          icon={<Mail className='w-4 h-4' />}
        />{' '}
        <PasswordInput
          id='password'
          label='Password'
          value={credentials.password}
          onChange={handleChange('password')}
          placeholder='Enter your password'
          required
          disabled={isSubmitting}
        />{' '}
        <LoadingButton
          isLoading={isSubmitting}
          type='submit'
          onClick={() => {}}
          loadingText='Signing in...'
          className='w-full'
        >
          {' '}
          Sign In{' '}
        </LoadingButton>{' '}
      </form>{' '}
      {onSwitchToRegister && (
        <SwitchAuthMode
          text="Don't have an account?"
          linkText='Sign up'
          onClick={onSwitchToRegister}
        />
      )}{' '}
    </AuthCard>
  );
};
