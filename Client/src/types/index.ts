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
  assignedTo?: Partial<User>;
  autoAssign?: boolean;
  assignedUser?: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
export interface EnquiryPayload {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  assignedTo?: string;
  autoAssign?: boolean;
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
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface EnquiryFilters {
  status?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}
