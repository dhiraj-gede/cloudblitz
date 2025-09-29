import * as React from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import type { Enquiry, User } from '../../types/index.ts';
import { useEffect, useState } from 'react';
import { fetchUsers } from '../../services/api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import {
  Mail,
  Phone,
  MessageSquare,
  User as UserIcon,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface EnquiryFormProps {
  enquiry?: Partial<Enquiry>;
  onSubmit: (data: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  canAssign?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  enquiry,
  onSubmit,
  onCancel,
  isSubmitting = false,
  canAssign = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [autoAssign, setAutoAssign] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Get logged-in user
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    if (loggedInUser && loggedInUser.role!=='admin') {
      return;
    }

    setIsLoadingUsers(true);
    fetchUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setIsLoadingUsers(false));
  }, [loggedInUser]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>({
    defaultValues: {
      customerName: enquiry?.customerName || loggedInUser?.name || '',
      email: enquiry?.email || loggedInUser?.email || '',
      phone: enquiry?.phone || '',
      message: enquiry?.message || '',
      status: enquiry?.status || 'new',
      assignedTo: enquiry?.id
        ? enquiry?.assignedTo ||
          (loggedInUser
            ? { id: loggedInUser.id, name: loggedInUser.name, email: loggedInUser.email }
            : { id: '', name: '', email: '' })
        : undefined,
      autoAssign: enquiry?.id ? false : true,
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
    // For new enquiry, always use autoAssign and no assignedTo
    console.log('Form Data before submit:', data);
    if (!enquiry?.id) {
      console.log('Creating new enquiry with auto-assign');
      delete data.assignedTo;
      data.autoAssign = true;
    } else if (autoAssign) {
      console.log('Creating new enquiry with auto-assign2');
      delete data.assignedTo;
      data.autoAssign = true;
    }
    else {
      console.log('Creating new enquiry with auto-assign3');
      data.autoAssign = false;
    }
    onSubmit(data);
  };

  const statusConfig = {
    new: {
      icon: AlertCircle,
      color: 'text-info',
      bg: 'bg-info/10',
      border: 'border-info/20',
      label: 'New',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      label: 'In Progress',
    },
    closed: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      label: 'Closed',
    },
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='p-6 space-y-8'>
      {/* Form Header */}
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-card-foreground'>
          {isEditing ? 'Update Enquiry' : 'Create New Enquiry'}
        </h2>
        <p className='text-muted-foreground'>
          {isEditing
            ? 'Update the enquiry details below'
            : 'Fill in the enquiry details to get started'}
        </p>
      </div>

      {/* Assignment Section - only show if canAssign (admin) and not when creating own enquiry */}
      {canAssign && enquiry?.id && (
        <div className='bg-card/50 rounded-xl p-6 border border-border space-y-4'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center'>
              <Settings className='w-5 h-5 text-warning' />
            </div>
            <div>
              <h3 className='font-semibold text-card-foreground'>Assignment Settings</h3>
              <p className='text-sm text-muted-foreground'>
                Manage team assignment for this enquiry
              </p>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-base font-medium text-card-foreground'>Assignment Type</label>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  autoAssign
                    ? 'bg-warning/20 text-warning border border-warning/30'
                    : 'bg-success/20 text-success border border-success/30'
                }`}
              >
                {autoAssign ? 'Auto-assign' : 'Manual assignment'}
              </span>
            </div>

            <div className='space-y-3'>
              <select
                {...register('assignedTo')}
                className='w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground 
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent 
                           smooth-transition disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-sm hover:border-border/80'
                disabled={autoAssign || isSubmitting || isLoadingUsers}
              >
                <option value={enquiry?.assignedTo?.id || ''}>
                  {enquiry?.assignedTo?.name
                    ? `${enquiry.assignedTo.name} • ${enquiry.assignedTo.email}`
                    : 'Select team member...'}
                </option>
                {users
                  .filter((user) => user.role !== 'user')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} • {user.email} ({user.role})
                    </option>
                  ))}
              </select>
              {isLoadingUsers && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <div className='w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin' />
                  Loading team members...
                </div>
              )}
            </div>

            {/* Auto-assign Toggle */}
            <div className='flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border'>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-card-foreground'>Auto-assign</span>
                  <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full'>
                    Recommended
                  </span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Automatically distribute enquiries using round-robin algorithm
                </p>
              </div>
              <button
                type='button'
                onClick={() => setAutoAssign((v) => !v)}
                disabled={isSubmitting}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring ${
                  autoAssign ? 'bg-warning' : 'bg-success'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoAssign ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className='bg-card/50 rounded-xl p-6 border border-border space-y-6'>
        <h3 className='font-semibold text-card-foreground flex items-center gap-2'>
          <UserIcon className='w-5 h-5 text-primary' />
          Contact Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Customer Name (read-only) */}
          <div className='space-y-3'>
            <label
              htmlFor='customerName'
              className='text-sm font-medium text-card-foreground flex items-center gap-1'
            >
              Customer Name <span className='text-destructive'>*</span>
            </label>
            <div className='relative'>
              <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                id='customerName'
                value={loggedInUser?.name || ''}
                readOnly
                className='w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-muted/50 text-foreground opacity-70 cursor-not-allowed smooth-transition'
              />
            </div>
          </div>

          {/* Phone (editable) */}
          <div className='space-y-3'>
            <label
              htmlFor='phone'
              className='text-sm font-medium text-card-foreground flex items-center gap-1'
            >
              Phone Number <span className='text-destructive'>*</span>
            </label>
            <div className='relative'>
              <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[1-9][\d]{0,15}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                id='phone'
                defaultValue={enquiry?.phone || ''}
                className='w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         smooth-transition placeholder:text-muted-foreground/60'
                placeholder='+1 (555) 123-4567'
              />
            </div>
            {errors.phone && (
              <p className='text-sm text-destructive flex items-center gap-2'>
                <AlertCircle className='w-4 h-4' />
                {getErrorMessage(errors.phone)}
              </p>
            )}
          </div>
        </div>

        {/* Email (read-only) */}
        <div className='space-y-3'>
          <label
            htmlFor='email'
            className='text-sm font-medium text-card-foreground flex items-center gap-1'
          >
            Email Address <span className='text-destructive'>*</span>
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              id='email'
              type='email'
              value={loggedInUser?.email || ''}
              readOnly
              className='w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-muted/50 text-foreground opacity-70 cursor-not-allowed smooth-transition'
              placeholder='customer@example.com'
            />
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className='bg-card/50 rounded-xl p-6 border border-border space-y-4'>
        <h3 className='font-semibold text-card-foreground flex items-center gap-2'>
          <MessageSquare className='w-5 h-5 text-primary' />
          Enquiry Details
        </h3>

        <div className='space-y-3'>
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
              rows={6}
              className='w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground 
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                       smooth-transition placeholder:text-muted-foreground/60 resize-vertical
                       shadow-sm hover:border-border/80'
              placeholder='Please describe your enquiry in detail...'
            />
            <div className='absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-full border border-border'>
              {watchedFields.message?.length || 0}/1000
            </div>
          </div>
          {errors.message && (
            <p className='text-sm text-destructive flex items-center gap-2'>
              <AlertCircle className='w-4 h-4' />
              {getErrorMessage(errors.message)}
            </p>
          )}
        </div>
      </div>

      {/* Status (Editing only) */}
      {isEditing && (
        <div className='bg-card/50 rounded-xl p-6 border border-border space-y-4'>
          <h3 className='font-semibold text-card-foreground'>Status</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {Object.entries(statusConfig).map(([value, config]) => {
              const Icon = config.icon;
              const isActive = watchedFields.status === value;
              return (
                <label key={value} className='cursor-pointer'>
                  <input type='radio' value={value} {...register('status')} className='sr-only' />
                  <div
                    className={`p-4 rounded-xl border-2 smooth-transition flex items-center gap-3 ${
                      isActive
                        ? `${config.bg} ${config.border} ${config.color} font-medium`
                        : 'border-border bg-background text-muted-foreground hover:bg-accent hover:border-border/60'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    <span>{config.label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex justify-between items-center pt-6 border-t border-border'>
        <div className='flex items-center gap-2 text-sm'>
          {isDirty && (
            <div className='flex items-center gap-2 text-warning'>
              <AlertCircle className='w-4 h-4' />
              <span>Unsaved changes</span>
            </div>
          )}
        </div>

        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onCancel}
            disabled={isSubmitting}
            className='px-6 py-3 border border-input rounded-lg text-foreground bg-background 
                     hover:bg-accent hover:text-accent-foreground disabled:opacity-50
                     smooth-transition font-medium shadow-sm focus-ring min-w-[100px]'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                     smooth-transition shadow-sm hover:shadow-md focus-ring flex items-center gap-2 min-w-[140px] justify-center'
          >
            {isSubmitting ? (
              <>
                <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <CheckCircle className='w-4 h-4' />
                {isEditing ? 'Update Enquiry' : 'Create Enquiry'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
