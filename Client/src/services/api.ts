const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  baseURL: API_BASE_URL,

  // Helper function to get auth headers
  getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // Generic API call function
  async call<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {...this.getAuthHeaders(), 'ngrok-skip-browser-warning': 'true'},
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // HTTP methods
  get<T>(endpoint: string): Promise<T> {
    return this.call<T>(endpoint);
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.call<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.call<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.call<T>(endpoint, {
      method: 'DELETE',
    });
  },
};

// Enquiries API
import type {
  Enquiry,
  EnquiryFilters,
  PaginatedResponse,
  ApiResponse,
  User,
  EnquiryPayload,
} from '../types/index.ts';

export const fetchEnquiries = async (
  filters?: EnquiryFilters
): Promise<PaginatedResponse<Enquiry>> => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const response = await api.get<PaginatedResponse<Enquiry>>(`/enquiries${query}`);
  return response;
};

export const fetchEnquiryById = async (id: string): Promise<Enquiry> => {
  return api.get<ApiResponse<Enquiry>>(`/enquiries/${id}`).then((res) => res.data!);
};

export const createEnquiry = async (
  data: Omit<EnquiryPayload, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Enquiry> => {
  return api.post<ApiResponse<Enquiry>>('/enquiries', data).then((res) => res.data!);
};

export const updateEnquiry = async (
  id: string,
  data: Partial<EnquiryPayload>
): Promise<Enquiry> => {
  return api.put<ApiResponse<Enquiry>>(`/enquiries/${id}`, data).then((res) => res.data!);
};

export const deleteEnquiry = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/enquiries/${id}`);
};

// User API
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<PaginatedResponse<User>>('/users');
  return response.data || [];
};

export const createUser = async (
  data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
): Promise<User> => {
  return api.post<ApiResponse<User>>('/users', data).then((res) => res.data!);
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  return api.put<ApiResponse<User>>(`/users/${id}`, data).then((res) => res.data!);
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/users/${id}`);
};
