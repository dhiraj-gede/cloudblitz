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
    <AuthCard>
      <AuthCardHeader
        icon={<User className='w-5 h-5' />}
        title='Welcome Back'
        subtitle='Sign in to your account'
      />

      <form className='space-y-4' onSubmit={handleSubmit}>
        {error && <ErrorAlert message={error} />}

        <InputField
          id='email'
          label='Email'
          type='email'
          value={email}
          onChange={setEmail}
          placeholder='Enter your email'
          required
          disabled={isSubmitting}
          icon={<Mail className='w-4 h-4' />}
        />

        <PasswordInput
          id='password'
          label='Password'
          value={password}
          onChange={setPassword}
          placeholder='Enter your password'
          required
          disabled={isSubmitting}
        />

        <LoadingButton
          isLoading={isSubmitting}
          type='submit'
          onClick={() => {}}
          loadingText='Signing in...'
        >
          Sign In
        </LoadingButton>
      </form>

      {onSwitchToRegister && (
        <SwitchAuthMode
          text="Don't have an account?"
          linkText='Sign up'
          onClick={onSwitchToRegister}
        />
      )}
    </AuthCard>
  );
};
