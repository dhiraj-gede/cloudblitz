import * as React from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import type { Enquiry, User } from '../../types/index.ts';
import { useEffect, useState } from 'react';
import { fetchUsers } from '../../services/api.ts';

interface EnquiryFormProps {
  enquiry?: Partial<Enquiry>;
  onSubmit: (data: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  enquiry,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [autoAssign, setAutoAssign] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    setIsLoadingUsers(true);
    fetchUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setIsLoadingUsers(false));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>({
    defaultValues: {
      customerName: enquiry?.customerName || '',
      email: enquiry?.email || '',
      phone: enquiry?.phone || '',
      message: enquiry?.message || '',
      status: enquiry?.status || 'new',
      assignedTo: enquiry?.assignedTo || '',
    },
  });

  const isEditing = !!enquiry?.id;
  const watchedFields = watch();

  const getErrorMessage = (error: FieldError): string | undefined => {
    if (!error) return undefined;
    if (typeof error.message === 'string') return error.message;
    return undefined;
  };

  type FormData = Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
    autoAssign?: boolean;
  };

  const handleFormSubmit = (data: FormData) => {
    if (autoAssign) {
      delete data.assignedTo;
      data.autoAssign = true;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='p-6 space-y-6'>
      {/* Assignment Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='text-base font-medium text-card-foreground'>Assignment</label>
          <span className='text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full'>
            {autoAssign ? 'Auto-assign enabled' : 'Manual assignment'}
          </span>
        </div>

        <div className='flex gap-4 items-start'>
          <div className='flex-1'>
            <select
              {...register('assignedTo')}
              className='w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground 
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent 
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-sm hover:border-gray-300'
              disabled={autoAssign || isSubmitting || isLoadingUsers}
            >
              <option className='text-black' value=''>
                Select team member...
              </option>
              {users
                .filter((user) => user.role !== 'user')
                .map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                    className={
                      user.role === 'admin'
                        ? 'text-[hsl(var(--primary))]'
                        : user.role === 'staff'
                          ? 'text-[hsl(var(--info))]'
                          : 'text-[hsl(var(--foreground))]'
                    }
                  >
                    {user.name} ({user.role})
                  </option>
                ))}
            </select>
            {isLoadingUsers && (
              <p className='text-xs text-muted-foreground mt-1'>Loading team members...</p>
            )}
          </div>

          <label
            className='flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-accent/50 
                               transition-colors cursor-pointer min-w-fit'
          >
            <div className='relative'>
              <input
                type='checkbox'
                checked={autoAssign}
                onChange={() => setAutoAssign((v) => !v)}
                disabled={isSubmitting}
                className='sr-only'
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                  autoAssign ? ' bg-[hsl(var(--warning-bg))]' : ' bg-[hsl(var(--success-bg))]'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-200 ${
                    autoAssign
                      ? 'transform translate-x-5 bg-[hsl(var(--warning))]'
                      : 'transform bg-[hsl(var(--success))] translate-x-1'
                  }`}
                />
              </div>
            </div>
            <span className='text-sm font-medium'>Auto-assign</span>
          </label>
        </div>
        <p className='text-xs text-muted-foreground'>
          Auto-assign will automatically distribute enquiries using round-robin algorithm
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Customer Name */}
        <div className='space-y-2'>
          <label
            htmlFor='customerName'
            className='text-sm font-medium text-card-foreground flex items-center gap-1'
          >
            Customer Name <span className='text-destructive'>*</span>
          </label>
          <input
            {...register('customerName', {
              required: 'Customer name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
            })}
            id='customerName'
            className='w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200 placeholder:text-muted-foreground/60
                         shadow-sm hover:border-gray-300'
            placeholder='Enter customer name'
          />
          {errors.customerName && (
            <p className='text-sm text-destructive flex items-center gap-1'>
              <span>⚠</span>
              {getErrorMessage(errors.customerName)}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className='space-y-2'>
          <label
            htmlFor='phone'
            className='text-sm font-medium text-card-foreground flex items-center gap-1'
          >
            Phone <span className='text-destructive'>*</span>
          </label>
          <input
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number',
              },
            })}
            id='phone'
            className='w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200 placeholder:text-muted-foreground/60
                         shadow-sm hover:border-gray-300'
            placeholder='+1 (555) 123-4567'
          />
          {errors.phone && (
            <p className='text-sm text-destructive flex items-center gap-1'>
              <span>⚠</span>
              {getErrorMessage(errors.phone)}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className='space-y-2'>
        <label
          htmlFor='email'
          className='text-sm font-medium text-card-foreground flex items-center gap-1'
        >
          Email <span className='text-destructive'>*</span>
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Please enter a valid email',
            },
          })}
          id='email'
          type='email'
          className='w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground 
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                       transition-all duration-200 placeholder:text-muted-foreground/60
                       shadow-sm hover:border-gray-300'
          placeholder='customer@example.com'
        />
        {errors.email && (
          <p className='text-sm text-destructive flex items-center gap-1'>
            <span>⚠</span>
            {getErrorMessage(errors.email)}
          </p>
        )}
      </div>

      {/* Message */}
      <div className='space-y-2'>
        <label
          htmlFor='message'
          className='text-sm font-medium text-card-foreground flex items-center gap-1'
        >
          Message <span className='text-destructive'>*</span>
        </label>
        <div className='relative'>
          <textarea
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' },
              maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters' },
            })}
            id='message'
            rows={5}
            className='w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-all duration-200 placeholder:text-muted-foreground/60 resize-vertical
                         shadow-sm hover:border-gray-300'
            placeholder='Enter the enquiry message details...'
          />
          <div className='absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded'>
            {watchedFields.message?.length || 0}/1000
          </div>
        </div>
        {errors.message && (
          <p className='text-sm text-destructive flex items-center gap-1'>
            <span>⚠</span>
            {getErrorMessage(errors.message)}
          </p>
        )}
      </div>

      {/* Status (Editing only) */}
      {isEditing && (
        <div className='space-y-2'>
          <label htmlFor='status' className='text-sm font-medium text-card-foreground'>
            Status
          </label>
          <div className='flex gap-2'>
            {[
              { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
              {
                value: 'in-progress',
                label: 'In Progress',
                color: 'bg-amber-100 text-amber-800',
              },
              { value: 'closed', label: 'Closed', color: 'bg-green-100 text-green-800' },
            ].map((status) => (
              <label key={status.value} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  value={status.value}
                  {...register('status')}
                  className='sr-only'
                />
                <div
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                    watchedFields.status === status.value
                      ? `${status.color} border-current font-medium`
                      : 'border-border bg-background text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {status.label}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex justify-between items-center pt-6 border-t border-border'>
        <div className='text-sm text-muted-foreground'>
          {isDirty && <span className='text-amber-600'>• Unsaved changes</span>}
        </div>

        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onCancel}
            disabled={isSubmitting}
            className='px-6 py-2.5 border border-input rounded-lg text-foreground bg-background 
                         hover:bg-accent hover:text-accent-foreground disabled:opacity-50
                         transition-all duration-200 font-medium shadow-sm'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium
                         hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2'
          >
            {isSubmitting ? (
              <>
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <span>✓</span>
                {isEditing ? 'Update Enquiry' : 'Create Enquiry'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
