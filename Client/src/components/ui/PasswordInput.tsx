import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { InputField } from './InputField.tsx';
import type { InputFieldProps } from './InputField.tsx';

interface PasswordInputProps
  extends Omit<InputFieldProps, 'type' | 'endAdornment' | 'showPasswordToggle'> {
  showStrengthIndicator?: boolean;
  strengthRules?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
  onStrengthChange?: (strength: PasswordStrength) => void;
}

export type PasswordStrength = 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter your password',
  required = false,
  disabled = false,
  minLength = 8,
  showStrengthIndicator = true,
  strengthRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  onStrengthChange,
  variant = 'default',
  size = 'md',
  error,
  success,
  helperText,
  className = '',
  ...inputProps
}) => {
  const [showPassword] = useState(false);
  const [isFocused] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return 'very-weak';

    let score = 0;
    const rules = strengthRules;

    // Length check
    if (password.length >= (rules.minLength || 8)) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (rules.requireUppercase && /[A-Z]/.test(password)) score += 1;
    if (rules.requireLowercase && /[a-z]/.test(password)) score += 1;
    if (rules.requireNumbers && /[0-9]/.test(password)) score += 1;
    if (rules.requireSpecialChars && /[^A-Za-z0-9]/.test(password)) score += 1;

    // Bonus for very long passwords
    if (password.length >= 16) score += 1;

    const strengthMap: PasswordStrength[] = [
      'very-weak',
      'weak',
      'fair',
      'good',
      'strong',
      'very-strong',
    ];

    return strengthMap[Math.min(score, strengthMap.length - 1)];
  };

  const passwordStrength = calculatePasswordStrength(value);
  const strengthScore = ['very-weak', 'weak', 'fair', 'good', 'strong', 'very-strong'].indexOf(
    passwordStrength
  );

  // Check individual rules
  const ruleChecks = {
    length: value.length >= (strengthRules.minLength || 8),
    uppercase: !strengthRules.requireUppercase || /[A-Z]/.test(value),
    lowercase: !strengthRules.requireLowercase || /[a-z]/.test(value),
    numbers: !strengthRules.requireNumbers || /[0-9]/.test(value),
    special: !strengthRules.requireSpecialChars || /[^A-Za-z0-9]/.test(value),
  };

  const strengthColors = {
    'very-weak': 'bg-error',
    weak: 'bg-error',
    fair: 'bg-warning',
    good: 'bg-amber-400',
    strong: 'bg-success',
    'very-strong': 'bg-green-500',
  };

  const strengthLabels = {
    'very-weak': 'Very Weak',
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
    'very-strong': 'Very Strong',
  };

  // Notify parent component of strength changes
  useState(() => {
    onStrengthChange?.(passwordStrength);
  });

  return (
    <div className={className}>
      <InputField
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        minLength={minLength}
        variant={variant}
        size={size}
        error={error}
        success={success}
        helperText={helperText}
        showPasswordToggle={true}
        icon={<LockIcon />}
        // onFocus={() => setIsFocused(true)}
        // onBlur={() => setIsFocused(false)}
        {...inputProps}
      />

      {/* Password Strength Indicator */}
      {showStrengthIndicator && value && (
        <div className='mt-3 space-y-2 animate-slide-down'>
          {/* Strength Bar */}
          <div className='flex items-center justify-between mb-1'>
            <span className='text-xs font-medium text-muted-foreground'>Password Strength</span>
            <span
              className={`text-xs font-semibold ${
                passwordStrength === 'very-weak' || passwordStrength === 'weak'
                  ? 'text-error'
                  : passwordStrength === 'fair'
                    ? 'text-warning'
                    : passwordStrength === 'good'
                      ? 'text-amber-500'
                      : 'text-success'
              }`}
            >
              {strengthLabels[passwordStrength]}
            </span>
          </div>

          <div className='w-full bg-muted rounded-full h-1.5 overflow-hidden'>
            <div
              className={`h-full smooth-transition ${strengthColors[passwordStrength]}`}
              style={{
                width: `${(strengthScore + 1) * (100 / 6)}%`,
              }}
            />
          </div>

          {/* Password Rules */}
          {(isFocused || value) && (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2'>
              <PasswordRule
                met={ruleChecks.length}
                text={`At least ${strengthRules.minLength || 8} characters`}
              />
              {strengthRules.requireUppercase && (
                <PasswordRule met={ruleChecks.uppercase} text='One uppercase letter' />
              )}
              {strengthRules.requireLowercase && (
                <PasswordRule met={ruleChecks.lowercase} text='One lowercase letter' />
              )}
              {strengthRules.requireNumbers && (
                <PasswordRule met={ruleChecks.numbers} text='One number' />
              )}
              {strengthRules.requireSpecialChars && (
                <PasswordRule met={ruleChecks.special} text='One special character' />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for password rules
const PasswordRule: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className='flex items-center gap-1.5'>
    {met ? (
      <CheckCircle2 className='w-3 h-3 text-success flex-shrink-0' />
    ) : (
      <XCircle className='w-3 h-3 text-muted-foreground flex-shrink-0' />
    )}
    <span className={`text-xs ${met ? 'text-success' : 'text-muted-foreground'}`}>{text}</span>
  </div>
);

// Simple lock icon component
const LockIcon: React.FC = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    />
  </svg>
);
