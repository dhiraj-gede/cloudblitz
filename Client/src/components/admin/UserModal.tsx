import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog.tsx';
import { useToast } from '../../hooks/useToast.ts';
import type { User } from '../../types/index.ts';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSave: (data: Partial<User>) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const isNewUser = !user;
  const [formData, setFormData] = useState<
    Partial<User> & { password?: string; confirmPassword?: string }
  >({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(isNewUser);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.role) newErrors.role = 'Role is required';
    if (showChangePassword || isNewUser) {
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      toast.error('Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className='sm:max-w-[400px] border border-[hsl(var(--border))]'>
        <DialogHeader>
          <DialogTitle className='text-[hsl(var(--foreground))]'>
            {user ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={formData.name || ''}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-[hsl(var(--input))] rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='Enter name'
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className='text-[hsl(var(--destructive))] text-sm mt-1'>{errors.name}</p>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email || ''}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-[hsl(var(--input))] rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='Enter email'
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className='text-[hsl(var(--destructive))] text-sm mt-1'>{errors.email}</p>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1'>
              Role
            </label>
            <select
              name='role'
              value={formData.role || 'user'}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-[hsl(var(--input))] rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-primary'
              disabled={isSubmitting}
            >
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
              <option value='staff'>Staff</option>
            </select>
            {errors.role && (
              <p className='text-[hsl(var(--destructive))] text-sm mt-1'>{errors.role}</p>
            )}
          </div>
          {!isNewUser && (
            <div className='mb-2'>
              <button
                type='button'
                className='text-sm px-3 py-1 rounded bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] transition-colors'
                onClick={() => setShowChangePassword((v) => !v)}
              >
                {showChangePassword ? 'Cancel Change Password' : 'Change Password'}
              </button>
            </div>
          )}
          {(showChangePassword || isNewUser) && (
            <>
              <div>
                <label className='block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1'>
                  New Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password || ''}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-[hsl(var(--input))] rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-primary pr-10'
                    placeholder='Enter new password'
                    disabled={isSubmitting}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-2 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] focus:outline-none'
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-[hsl(var(--destructive))] text-sm mt-1'>{errors.password}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    value={formData.confirmPassword || ''}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-[hsl(var(--input))] rounded-md bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-primary pr-10'
                    placeholder='Confirm password'
                    disabled={isSubmitting}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-2 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] focus:outline-none'
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-[hsl(var(--destructive))] text-sm mt-1'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        <div className='flex gap-2 justify-end mt-6'>
          <button
            className='px-4 py-2 rounded bg-[hsl(var(--accent))] text-[hsl(var(--warning))] hover:bg-[hsl(var(--muted-foreground))] transition-colors border border-[hsl(var(--border))]'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border border-[hsl(var(--border))]'
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
