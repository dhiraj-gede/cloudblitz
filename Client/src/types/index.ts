// Common types for the application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  assignedTo?: string;
  assignedUser?: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface AuthResponse {
  data: { accessToken: string; user: User };
  message: string;
  status: 'success' | 'error';
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EnquiryFilters {
  status?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}
