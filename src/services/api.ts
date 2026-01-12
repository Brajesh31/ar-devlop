/**
 * API Service Layer
 * Connects frontend components to PHP backend APIs using Axios
 * * STATUS: Admin Auth, Admin Events, Public Auth (Login/Register/Reset) & Events
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';

// ============================================================================
// 1. AXIOS CONFIGURATION
// ============================================================================

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  withCredentials: true, // Important: Handles cookies for sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// 2. TYPES & INTERFACES
// ============================================================================

interface ApiResponse<T = any> {
  user_id: any;
  redirect: any;
  status: 'success' | 'error';
  data?: T;       // Standard data payload
  user?: T;       // specific to login endpoint
  event?: any;    // specific to get_details
  registrations?: any[]; // specific to get_details
  message?: string;
  url?: string;   // specific to upload
}

// Admin Login Credentials (Email only)
export interface LoginCredentials {
  email: string;
  password: string;
}

// Student/Public Login Credentials (Email or Phone)
export interface PublicLoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthUser {
  user_id: string;
  email: string;
  role: string;
  name: string;
  is_permanent?: boolean;
  institution?: string; // Added to support student dashboard
}

// ============================================================================
// 3. GENERIC REQUEST HELPER
// ============================================================================

async function apiRequest<T>(
    endpoint: string,
    options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request<ApiResponse<T>>({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);

    if (axios.isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Network error.',
      };
    }

    return { status: 'error', message: 'An unexpected error occurred.' };
  }
}

// ============================================================================
// 4. ADMIN SERVICES
// ============================================================================

export const authService = {
  // --- ADMIN AUTH ---
  adminLogin: async (credentials: LoginCredentials) => {
    return apiRequest<AuthUser>('/admin/auth/login.php', {
      method: 'POST',
      data: credentials,
    });
  },

  adminForgotPassword: async (email: string) => {
    return apiRequest('/admin/auth/forgot_password.php', {
      method: 'POST',
      data: { email },
    });
  },

  adminResetPassword: async (token: string, email: string, newPassword: string) => {
    return apiRequest('/admin/auth/reset_password.php', {
      method: 'POST',
      data: { token, email, new_password: newPassword },
    });
  },

  logout: async () => {
    return apiRequest('/admin/auth/logout.php', { method: 'POST' });
  },

  // --- STUDENT / PUBLIC AUTH (UPDATED) ---

  // Login with Identifier (Email/Phone) & Password
  login: async (credentials: PublicLoginCredentials) => {
    return apiRequest<any>('/auth/login.php', {
      method: 'POST',
      data: credentials,
    });
  },

  // Register with full profile data
  register: async (data: any) => {
    return apiRequest<any>('/auth/register.php', {
      method: 'POST',
      data: data,
    });
  },

  // Forgot Password (Request Link) - ADDED THIS
  forgotPassword: async (email: string) => {
    return apiRequest<any>('/auth/forgot_password.php', {
      method: 'POST',
      data: { email },
    });
  },

  // Reset Password (Submit new password with token) - ADDED THIS
  resetPassword: async (token: string, password: string) => {
    return apiRequest<any>('/auth/reset_password.php', {
      method: 'POST',
      data: { token, password },
    });
  },
};

export interface DashboardStats {
  counts: {
    students: number;
    events: number;
    hackathons: number;
    growth: number;
  };
  activity: Array<{
    user: string;
    action: string;
    target: string;
    time: string;
    type: 'user' | 'system';
  }>;
}

export const adminService = {
  // Fetch Dashboard Stats
  getStats: async () => {
    return apiRequest<DashboardStats>('/admin/dashboard/stats.php');
  },

  // === IMAGE UPLOAD SERVICE ===
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    // Direct Axios call to handle multipart/form-data correctly
    try {
      const response = await axios.post(`${API_CONFIG.baseUrl}/admin/media/upload.php`, formData);
      return response.data;
    } catch (error: any) {
      console.error("Upload Error:", error);
      return { status: 'error', message: "Image upload failed" };
    }
  },

  // === EVENTS MANAGEMENT ===
  events: {
    // 1. List All Events (Admin View)
    list: async () => {
      return apiRequest<any[]>('/admin/events/list.php');
    },

    // 2. Get Single Event + Registrations (Analytics)
    getDetails: async (id: string) => {
      return apiRequest<any>(`/admin/events/get_details.php?id=${id}`);
    },

    // 3. Create Event
    create: async (data: any) => {
      return apiRequest('/admin/events/create.php', {
        method: 'POST',
        data: data,
      });
    },

    // 4. Update Event
    update: async (data: any) => {
      return apiRequest('/admin/events/update.php', {
        method: 'POST',
        data: data,
      });
    },

    // 5. Delete Event
    delete: async (eventId: number | string) => {
      return apiRequest('/admin/events/delete.php', {
        method: 'POST',
        data: { event_id: eventId },
      });
    },
  }
};

// ============================================================================
// 5. PUBLIC SERVICES
// ============================================================================

export const publicService = {
  events: {
    // 1. List Published Events (Public View)
    list: async () => {
      const response = await axios.get(`${API_CONFIG.baseUrl}/events/list.php`);
      return response.data;
    },

    // 2. Get Single Event Details (Public View)
    getById: async (id: string) => {
      const response = await axios.get(`${API_CONFIG.baseUrl}/events/get.php?id=${id}`);
      return response.data;
    },

    // 3. Register for Event (Saves to Dynamic Table)
    register: async (data: any) => {
      const response = await axios.post(`${API_CONFIG.baseUrl}/events/register.php`, data);
      return response.data;
    }
  }
};