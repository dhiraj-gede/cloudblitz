"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.refreshTokenSchema = exports.mongoIdSchema = exports.enquiryFiltersSchema = exports.paginationSchema = exports.updateEnquirySchema = exports.createEnquirySchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// User validation schemas
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim(),
    email: zod_1.z.string().email('Please enter a valid email').toLowerCase().trim(),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
    role: zod_1.z.enum(['admin', 'staff', 'user']).optional().default('user'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email').toLowerCase().trim(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .email('Please enter a valid email')
        .toLowerCase()
        .trim()
        .optional(),
    role: zod_1.z.enum(['admin', 'staff', 'user']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Enquiry validation schemas
exports.createEnquirySchema = zod_1.z.object({
    customerName: zod_1.z
        .string()
        .min(2, 'Customer name must be at least 2 characters')
        .max(100, 'Customer name cannot exceed 100 characters')
        .trim(),
    email: zod_1.z.string().email('Please enter a valid email').toLowerCase().trim(),
    phone: zod_1.z
        .string()
        .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
        .trim(),
    message: zod_1.z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message cannot exceed 1000 characters')
        .trim(),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional().default('medium'),
    createdBy: zod_1.z.string().optional(),
});
exports.updateEnquirySchema = zod_1.z.object({
    customerName: zod_1.z
        .string()
        .min(2, 'Customer name must be at least 2 characters')
        .max(100, 'Customer name cannot exceed 100 characters')
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .email('Please enter a valid email')
        .toLowerCase()
        .trim()
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
        .trim()
        .optional(),
    message: zod_1.z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message cannot exceed 1000 characters')
        .trim()
        .optional(),
    status: zod_1.z.enum(['new', 'in-progress', 'closed']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional(),
    assignedTo: zod_1.z.string().optional(),
    notes: zod_1.z.array(zod_1.z.string()).optional(),
});
// Query validation schemas
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .transform(val => parseInt(val) || 1)
        .refine(val => val > 0, 'Page must be greater than 0')
        .optional(),
    limit: zod_1.z
        .string()
        .transform(val => parseInt(val) || 10)
        .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
        .optional(),
    sort: zod_1.z.string().optional(),
    order: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
});
exports.enquiryFiltersSchema = zod_1.z
    .object({
    status: zod_1.z.enum(['new', 'in-progress', 'closed']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional(),
    assignedTo: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    startDate: zod_1.z
        .string()
        .transform(val => (val ? new Date(val) : undefined))
        .optional(),
    endDate: zod_1.z
        .string()
        .transform(val => (val ? new Date(val) : undefined))
        .optional(),
})
    .merge(exports.paginationSchema);
// ID validation
exports.mongoIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});
// Auth validation schemas
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email').toLowerCase().trim(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
});
