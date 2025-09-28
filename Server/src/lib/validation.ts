import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  role: z.enum(['admin', 'staff', 'user']).optional().default('user'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim()
    .optional(),
  role: z.enum(['admin', 'staff', 'user']).optional(),
  isActive: z.boolean().optional(),
  hasSeenTutorial: z.boolean().optional(),
});

// Enquiry validation schemas
export const createEnquirySchema = z.object({
  customerName: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name cannot exceed 100 characters')
    .trim(),
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  phone: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  createdBy: z.string().optional(),
  autoAssign: z.boolean().optional(),
  assignedTo: z.string().optional(),
});

export const updateEnquirySchema = z.object({
  customerName: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name cannot exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .trim()
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim()
    .optional(),
  status: z.enum(['new', 'in-progress', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedTo: z.string().optional(),
  notes: z.array(z.string()).optional(),
  autoAssign: z.boolean().optional(),
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val) || 1)
    .refine(val => val > 0, 'Page must be greater than 0')
    .optional(),
  limit: z
    .string()
    .transform(val => parseInt(val) || 10)
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const enquiryFiltersSchema = z
  .object({
    status: z.enum(['new', 'in-progress', 'closed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    assignedTo: z.string().optional(),
    search: z.string().optional(),
    startDate: z
      .string()
      .transform(val => (val ? new Date(val) : undefined))
      .optional(),
    endDate: z
      .string()
      .transform(val => (val ? new Date(val) : undefined))
      .optional(),
  })
  .merge(paginationSchema);

// ID validation
export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

// Auth validation schemas
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;
export type EnquiryFilters = z.infer<typeof enquiryFiltersSchema>;
export type MongoId = z.infer<typeof mongoIdSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
