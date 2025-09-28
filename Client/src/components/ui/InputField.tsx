import type { ReactNode } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import React from 'react';

export interface InputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  success?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  className?: string;
  inputClassName?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  minLength,
  maxLength,
  icon,
  endAdornment,
  variant = 'default',
  size = 'md',
  error,
  success,
  helperText,
  showPasswordToggle = type === 'password',
  className = '',
  inputClassName = '',
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const variantStyles = {
    default: 'bg-background border-input focus:bg-background',
    filled: 'bg-muted border-transparent focus:bg-background focus:border-input',
    outlined: 'bg-transparent border-input focus:bg-background',
    minimal: 'bg-transparent border-transparent border-b-input rounded-none focus:bg-transparent',
  };

  const sizeStyles = {
    sm: {
      container: 'space-y-1.5',
      label: 'text-xs',
      input: 'px-3 py-1.5 text-sm rounded-md',
      icon: 'w-3 h-3',
      helper: 'text-xs',
    },
    md: {
      container: 'space-y-2',
      label: 'text-sm',
      input: 'px-3 py-2 text-sm rounded-md',
      icon: 'w-4 h-4',
      helper: 'text-xs',
    },
    lg: {
      container: 'space-y-2.5',
      label: 'text-base',
      input: 'px-4 py-3 text-base rounded-lg',
      icon: 'w-5 h-5',
      helper: 'text-sm',
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  return (
    <div className={`${currentSize.container} ${className}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className={`
          block font-medium text-card-foreground smooth-transition
          ${disabled ? 'text-muted-foreground/60' : ''}
          ${currentSize.label}
        `}
      >
        {label}
        {required && <span className='text-error ml-1'>*</span>}
      </label>

      {/* Input Container */}
      <div className='relative'>
        {/* Start Icon */}
        {icon && (
          <div
            className={`
            absolute inset-y-0 left-0 flex items-center pl-3 
            ${hasError ? 'text-error' : hasSuccess ? 'text-success' : 'text-muted-foreground'}
            ${disabled ? 'opacity-50' : ''}
          `}
          >
            <div className={currentSize.icon}>{icon}</div>
          </div>
        )}

        {/* Input Field */}
        <input
          id={id}
          type={showPasswordToggle && showPassword ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full border smooth-transition focus-ring
            placeholder:text-muted-foreground/60
            disabled:opacity-50 disabled:cursor-not-allowed
            read-only:bg-muted/50 read-only:cursor-default
            ${currentVariant}
            ${currentSize.input}
            ${icon ? 'pl-10' : 'pl-3'}
            ${showPasswordToggle || endAdornment ? 'pr-10' : 'pr-3'}
            ${
              hasError
                ? 'border-error focus:border-error focus:ring-error/20'
                : hasSuccess
                  ? 'border-success focus:border-success focus:ring-success/20'
                  : 'focus:border-ring'
            }
            ${inputClassName}
          `}
        />

        {/* Status Icons */}
        <div className='absolute inset-y-0 right-0 flex items-center pr-3 space-x-1'>
          {/* Error/Success Icon */}
          {(hasError || hasSuccess) && (
            <div
              className={`
              flex items-center justify-center
              ${hasError ? 'text-error' : 'text-success'}
            `}
            >
              {hasError ? (
                <AlertCircle className={currentSize.icon} />
              ) : (
                <CheckCircle2 className={currentSize.icon} />
              )}
            </div>
          )}

          {/* Password Toggle */}
          {showPasswordToggle && !endAdornment && (
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className={`
                smooth-transition rounded p-1 focus-ring
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'}
                text-muted-foreground hover:text-foreground
              `}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className={currentSize.icon} />
              ) : (
                <Eye className={currentSize.icon} />
              )}
            </button>
          )}

          {/* Custom End Adornment */}
          {endAdornment && !showPasswordToggle && (
            <div className='flex items-center'>{endAdornment}</div>
          )}
        </div>
      </div>

      {/* Helper Text, Error, or Success Message */}
      {(helperText || error || success) && (
        <p
          className={`
          smooth-transition
          ${currentSize.helper}
          ${hasError ? 'text-error' : hasSuccess ? 'text-success' : 'text-muted-foreground'}
        `}
        >
          {error || success || helperText}
        </p>
      )}

      {/* Character Counter */}
      {maxLength && (
        <div className='flex justify-end'>
          <span
            className={`
            text-xs smooth-transition
            ${
              value.length > maxLength
                ? 'text-error'
                : value.length > maxLength * 0.8
                  ? 'text-warning'
                  : 'text-muted-foreground'
            }
          `}
          >
            {value.length} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
};
