import * as React from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import type { Enquiry } from '../../types/index.ts';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const getErrorMessage = (error: FieldError): string | undefined => {
    if (!error) return undefined;
    if (typeof error.message === 'string') return error.message;
    return undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-1'>
        <label htmlFor='customerName' className='text-sm font-medium'>
          Customer Name
        </label>
        <input
          {...register('customerName', {
            required: 'Customer name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
          })}
          id='customerName'
          className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
        />
        {errors.customerName && (
          <p className='text-sm text-destructive'>{getErrorMessage(errors.customerName)}</p>
        )}
      </div>

      <div className='space-y-1'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
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
          className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
        />
        {errors.email && (
          <p className='text-sm text-destructive'>{getErrorMessage(errors.email)}</p>
        )}
      </div>

      <div className='space-y-1'>
        <label htmlFor='phone' className='text-sm font-medium'>
          Phone
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
          className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
        />
        {errors.phone && (
          <p className='text-sm text-destructive'>{getErrorMessage(errors.phone)}</p>
        )}
      </div>

      <div className='space-y-1'>
        <label htmlFor='message' className='text-sm font-medium'>
          Message
        </label>
        <textarea
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' },
            maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters' },
          })}
          id='message'
          rows={4}
          className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
        />
        {errors.message && (
          <p className='text-sm text-destructive'>{getErrorMessage(errors.message)}</p>
        )}
      </div>

      {isEditing && (
        <div className='space-y-1'>
          <label htmlFor='status' className='text-sm font-medium'>
            Status
          </label>
          <select
            {...register('status')}
            id='status'
            className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
          >
            <option value='new'>New</option>
            <option value='in-progress'>In Progress</option>
            <option value='closed'>Closed</option>
          </select>
        </div>
      )}

      <div className='flex justify-end space-x-2 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 border border-input rounded-md text-muted-foreground hover:text-foreground'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50'
        >
          {isSubmitting ? 'Submitting...' : isEditing ? 'Update Enquiry' : 'Create Enquiry'}
        </button>
      </div>
    </form>
  );
};
