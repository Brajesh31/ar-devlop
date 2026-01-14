/**
 * API Service Layer
 * Connects frontend components to PHP backend APIs using Axios
 * * STATUS: Admin Auth, Admin Events, Public Auth, Student Dashboard
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';

// ============================================================================
// 1. AXIOS CONFIGURATION
// ============================================================================

export const apiClient = axios.create({
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
  institution?: string;
}

// Student Dashboard Types
export interface StudentStats {
  eventsRegistered: number;
  hackathonsParticipated: number;
  projectsShowcased: number;
  lensesSubmitted: number;
  nextEventDate?: string;
}

export interface UpcomingActivity {
  id: string;
  title: string;
  type: 'event' | 'hackathon' | 'workshop';
  date: string;
  image?: string;
}

// ============================================================================
// 3. GENERIC REQUEST HELPER
// ============================================================================

async function apiRequest<T>(
    endpoint: string,
    options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
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

  // --- STUDENT / PUBLIC AUTH ---

  login: async (credentials: PublicLoginCredentials) => {
    return apiRequest<any>('/auth/login.php', {
      method: 'POST',
      data: credentials,
    });
  },

  register: async (data: any) => {
    return apiRequest<any>('/auth/register.php', {
      method: 'POST',
      data: data,
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest<any>('/auth/forgot_password.php', {
      method: 'POST',
      data: { email },
    });
  },

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
    list: async () => {
      return apiRequest<any[]>('/admin/events/list.php');
    },

    getDetails: async (id: string) => {
      return apiRequest<any>(`/admin/events/get_details.php?id=${id}`);
    },

    create: async (data: any) => {
      return apiRequest('/admin/events/create.php', {
        method: 'POST',
        data: data,
      });
    },

    update: async (data: any) => {
      return apiRequest('/admin/events/update.php', {
        method: 'POST',
        data: data,
      });
    },

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
    list: async () => {
      const response = await axios.get(`${API_CONFIG.baseUrl}/events/list.php`);
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axios.get(`${API_CONFIG.baseUrl}/events/get.php?id=${id}`);
      return response.data;
    },

    register: async (data: any) => {
      const response = await axios.post(`${API_CONFIG.baseUrl}/events/register.php`, data);
      return response.data;
    }
  }
};

// ============================================================================
// 6. STUDENT SERVICES (New)
// ============================================================================

export const studentService = {
  // 1. Get Dashboard Overview Stats
  getStats: async (): Promise<StudentStats> => {
    // TODO: Replace with actual backend call when ready
    // return apiRequest<StudentStats>('/student/dashboard/stats.php');

    // Mock Data for UI Development
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        eventsRegistered: 12,
        hackathonsParticipated: 3,
        projectsShowcased: 5,
        lensesSubmitted: 2,
        nextEventDate: "2025-09-15T10:00:00"
      }), 800);
    });
  },

  // 2. Get Upcoming Activities
  getUpcoming: async (): Promise<UpcomingActivity[]> => {
    // TODO: Replace with actual backend call

    return new Promise((resolve) => {
      setTimeout(() => resolve([
        {
          id: '1',
          title: 'Advanced AR Workshop',
          type: 'workshop',
          date: '2025-09-15T10:00:00',
          image: '/src/assets/bharat-xr-hero.png'
        },
        {
          id: '2',
          title: 'Lensathon 2.0',
          type: 'hackathon',
          date: '2025-10-01T09:00:00'
        }
      ]), 1000);
    });
  }
};