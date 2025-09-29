import { useState } from 'react';
import { UserPlus, User, Mail, Lock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.ts';
import { AuthCard } from '../ui/AuthCard.tsx';
import { AuthCardHeader } from '../ui/AuthCardHeader.tsx';
import { InputField } from '../ui/InputField.tsx';
import { PasswordInput } from '../ui/PasswordInput.tsx';
import { ErrorAlert } from '../ui/ErrorAlert.tsx';
import { LoadingButton } from '../ui/LoadingButton.tsx';
import { SwitchAuthMode } from '../ui/SwitchAuthMode.tsx';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showValidationTooltip, setShowValidationTooltip] = useState(false);

  const { register } = useAuth();

  // Password strength indicators
  const passwordStrength = {
    hasMinLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Simple email validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isEmailValid = isValidEmail(email);
  const isNameValid = name.trim().length > 0;
  const isPasswordValid =
    passwordStrength.hasMinLength &&
    passwordStrength.hasUpperCase &&
    passwordStrength.hasLowerCase &&
    passwordStrength.hasNumbers &&
    passwordStrength.hasSpecialChar;
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;

  const isFormValid =
    isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && termsAccepted;

  // Get validation errors for tooltip
  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!isNameValid) {
      errors.push('• Full name is required');
    }

    if (!isEmailValid && email.length > 0) {
      errors.push('• Please enter a valid email address');
    } else if (!isEmailValid) {
      errors.push('• Email address is required');
    }

    if (!isPasswordValid && password.length > 0) {
      errors.push('• Password does not meet all requirements');
    } else if (!isPasswordValid) {
      errors.push('• Password is required');
    }

    if (!isConfirmPasswordValid && confirmPassword.length > 0) {
      errors.push('• Passwords do not match');
    } else if (!isConfirmPasswordValid) {
      errors.push('• Please confirm your password');
    }

    if (!termsAccepted) {
      errors.push('• You must accept the Terms and Privacy Policy');
    }

    return errors;
  };

  const validationErrors = getValidationErrors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setShowValidationTooltip(true);
      // Hide tooltip after 5 seconds
      setTimeout(() => setShowValidationTooltip(false), 5000);
      setError('Please fix the form errors to continue');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard size='lg'>
      <AuthCardHeader
        icon={<UserPlus className='w-6 h-6' />}
        title='Create Your Account'
        subtitle='Join CloudBlitz and unlock powerful features'
      />

      <form className='space-y-5' onSubmit={handleSubmit}>
        {error && <ErrorAlert message={error} variant='error' />}

        <div className='grid gap-4'>
          <InputField
            id='name'
            label='Full Name'
            type='text'
            value={name}
            onChange={setName}
            placeholder='Enter your full name'
            required
            disabled={isSubmitting}
            icon={<User className='w-4 h-4' />}
            className='bg-background/50 border-border/70 focus:border-primary/50'
            error={!isNameValid && name.length > 0 ? 'Full name is required' : undefined}
          />

          <InputField
            id='email'
            label='Email Address'
            type='email'
            value={email}
            onChange={setEmail}
            placeholder='Enter your email'
            required
            disabled={isSubmitting}
            icon={<Mail className='w-4 h-4' />}
            className='bg-background/50 border-border/70 focus:border-primary/50'
            error={
              !isEmailValid && email.length > 0 ? 'Please enter a valid email address' : undefined
            }
          />

          <PasswordInput
            id='password'
            label='Password'
            value={password}
            onChange={setPassword}
            placeholder='Create a strong password'
            required
            disabled={isSubmitting}
            minLength={6}
            className='bg-background/50 border-border/70 focus:border-primary/50'
          />

          {/* Password Strength Indicator */}
          {password && (
            <div className='space-y-2 p-3 bg-muted/30 rounded-lg border border-border/50'>
              <div className='text-xs font-medium text-foreground mb-2'>Password Strength</div>
              <div className='space-y-1.5'>
                {[
                  { key: 'hasMinLength', label: 'At least 6 characters' },
                  { key: 'hasUpperCase', label: 'One uppercase letter' },
                  { key: 'hasLowerCase', label: 'One lowercase letter' },
                  { key: 'hasNumbers', label: 'One number' },
                  { key: 'hasSpecialChar', label: 'One special character' },
                ].map(({ key, label }) => (
                  <div key={key} className='flex items-center gap-2 text-xs'>
                    <CheckCircle
                      className={`w-3 h-3 ${
                        passwordStrength[key as keyof typeof passwordStrength]
                          ? 'text-success'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                    <span
                      className={
                        passwordStrength[key as keyof typeof passwordStrength]
                          ? 'text-success-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <InputField
            id='confirmPassword'
            label='Confirm Password'
            type='password'
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder='Re-enter your password'
            required
            disabled={isSubmitting}
            minLength={6}
            icon={<Lock className='w-4 h-4' />}
            className='bg-background/50 border-border/70 focus:border-primary/50'
            error={
              !isConfirmPasswordValid && confirmPassword.length > 0
                ? 'Passwords do not match'
                : undefined
            }
          />
        </div>

        {/* Terms and Conditions */}
        <div className='flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/30'>
          <div className='flex items-center h-5'>
            <input
              id='terms'
              type='checkbox'
              required
              disabled={isSubmitting}
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className='w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50 focus:ring-2'
            />
          </div>
          <label htmlFor='terms' className='text-xs text-muted-foreground'>
            I agree to the{' '}
            <a
              href='/terms'
              className='text-primary hover:text-primary/80 underline smooth-transition'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='text-primary hover:text-primary/80 underline smooth-transition'
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Validation Tooltip */}
        {showValidationTooltip && validationErrors.length > 0 && (
          <div className='p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <AlertCircle className='w-4 h-4 text-destructive' />
              <span className='text-sm font-medium text-destructive'>Form Validation Errors</span>
            </div>
            <ul className='text-xs text-destructive space-y-1'>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='relative'>
          <LoadingButton
            isLoading={isSubmitting}
            type='submit'
            onClick={() => {}}
            loadingText='Creating your account...'
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium shadow-sm smooth-transition focus-ring'
            disabled={!isFormValid || isSubmitting}
          >
            Sign Up
          </LoadingButton>

          {/* Tooltip trigger */}
          {!isFormValid && !isSubmitting && (
            <button
              type='button'
              onClick={() => setShowValidationTooltip(!showValidationTooltip)}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground smooth-transition'
              title='Show validation errors'
            >
              <Info className='w-4 h-4' />
            </button>
          )}
        </div>
      </form>

      {onSwitchToLogin && (
        <SwitchAuthMode
          text='Already have an account?'
          linkText='Sign in to your account'
          onClick={onSwitchToLogin}
        />
      )}
    </AuthCard>
  );
};
