/**
 * API Service Layer
 * Connects frontend components to PHP backend APIs using Axios
 * STATUS: Admin Auth, Admin Events, Public Auth, Student Dashboard (Separate), SHOWCASE & LENS
 */

import axios, { AxiosRequestConfig } from 'axios';
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

export interface ApiResponse<T = any> {
  user_id: any;
  redirect: any;
  status: 'success' | 'error';
  data?: T;       // Standard data payload
  user?: T;       // specific to login endpoint
  event?: any;    // specific to get_details
  registrations?: any[]; // specific to get_details
  message?: string;
  url?: string;   // specific to upload
  count?: number;

  // NEW: Admin List Response specific
  meta?: {
    count_verified: number;
    count_guest: number;
    filter_status?: string;
  };
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

// Student Dashboard Types (Your Original Structure)
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

// NEW: Showcase & Lens Item Type
export interface ShowcaseItem {
  id: number;
  student_name: string;
  email: string;
  college_name: string;

  // Specific to Showcase (Video)
  project_title?: string;
  video_url?: string;
  video_path?: string;

  // Specific to Lens
  lens_link?: string;
  gender?: string;

  // Statuses
  user_id?: number | null;
  status: 'pending' | 'published' | 'rejected';
  is_featured?: number | boolean;
  views?: number;
  likes?: number;

  received_at: string;
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
  // --- ADMIN AUTH (UNTOUCHED) ---
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

  // --- STUDENT / PUBLIC AUTH (UNTOUCHED) ---
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
    pending_showcase: number; // Added
    pending_lens: number;     // Added
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
  // Fetch Dashboard Stats (Updated to include Pending Counts)
  getStats: async () => {
    return apiRequest<DashboardStats>('/admin/dashboard/stats.php');
  },

  // === IMAGE UPLOAD SERVICE (UNTOUCHED) ===
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_CONFIG.baseUrl}/admin/media/upload.php`, formData, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error("Upload Error:", error);
      return { status: 'error', message: "Image upload failed" };
    }
  },

  // === EVENTS MANAGEMENT (UNTOUCHED) ===
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
  },

  // === NEW: SHOWCASE & LENS MANAGEMENT ===
  showcase: {
    // 1. Fetch List (Verified vs Guest) - Points to our new list_master.php
    getAll: async (type: 'showcase' | 'lens', filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const query = new URLSearchParams({
        type,
        status: filters?.status || 'all',
        start_date: filters?.startDate || '2024-01-01',
        end_date: filters?.endDate || new Date().toISOString().split('T')[0],
      });

      return apiRequest<{
        verified_students: ShowcaseItem[];
        guest_submissions: ShowcaseItem[];
      }>(`/admin/showcase/list_master.php?${query.toString()}`);
    },

    // 2. Update Status (Approve/Reject)
    updateStatus: async (
        id: number,
        type: 'showcase' | 'lens',
        status: 'approved' | 'rejected' | 'pending'
    ) => {
      return apiRequest('/admin/showcase/update_status.php', {
        method: 'POST',
        data: { submission_id: id, type, status }
      });
    },

    // 3. Toggle Feature
    toggleFeatured: async (id: number, type: 'showcase' | 'lens', isFeatured: boolean) => {
      return apiRequest('/admin/showcase/manage.php', {
        method: 'POST',
        data: {
          id: id,
          type: type,
          action: isFeatured ? 'feature' : 'unfeature'
        }
      });
    },

    // 4. Delete Item
    deleteItem: async (id: number, type: 'showcase' | 'lens') => {
      return apiRequest('/admin/showcase/manage.php', {
        method: 'POST',
        data: { id, type, action: 'reject' }
      });
    },

    // 5. Get CSV Export URL
    getExportUrl: (type: 'showcase' | 'lens', startDate: string, endDate: string) => {
      return `${API_CONFIG.baseUrl}/admin/showcase/export.php?type=${type}&start_date=${startDate}&end_date=${endDate}`;
    }
  }
};

// ============================================================================
// 5. PUBLIC SERVICES
// ============================================================================

export const publicService = {
  // EVENTS (UNTOUCHED)
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
      return apiRequest('/events/register.php', {
        method: 'POST',
        data: data,
      });
    }
  },

  // === NEW: SHOWCASE (VIDEOS) ===
  showcase: {
    submitVideo: async (formData: FormData) => {
      try {
        const response = await axios.post(`${API_CONFIG.baseUrl}/showcase/submit.php`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } catch (error: any) {
        return {
          status: 'error',
          message: error.response?.data?.message || "Video upload failed."
        };
      }
    },
    getGallery: async () => {
      const response = await axios.get(`${API_CONFIG.baseUrl}/showcase/get_public.php`);
      return response.data;
    }
  },

  // === NEW: LENS (AR LINKS) ===
  lens: {
    submitLens: async (data: any) => {
      return apiRequest('/lens/submit.php', {
        method: 'POST',
        data: data
      });
    },
    getGallery: async () => {
      const response = await axios.get(`${API_CONFIG.baseUrl}/lens/get_public.php`);
      return response.data;
    }
  },

  // === NEW: ANALYTICS ===
  analytics: {
    registerView: async (id: number, type: 'showcase' | 'lens') => {
      axios.post(`${API_CONFIG.baseUrl}/analytics/view.php`, { id, type });
    }
  }
};

// ============================================================================
// 6. STUDENT SERVICES (Authenticated)
// ============================================================================

export const studentService = {

  // 1. Get Registered Events (UNTOUCHED)
  getMyEvents: async () => {
    return apiRequest<any[]>('/student/my_events.php');
  },

  // 2. Get Dashboard Stats (UNTOUCHED - As requested)
  getStats: async () => {
    return apiRequest<StudentStats>('/student/dashboard/stats.php');
  },

  // 3. Get Upcoming Activities (UNTOUCHED - As requested)
  getUpcoming: async () => {
    return apiRequest<UpcomingActivity[]>('/student/dashboard/upcoming.php');
  },

  // 4. [NEW] Get My Showcase & Lens Submissions
  // We use the new backend file to fetch this specific list
  getMySubmissions: async () => {
    // This file returns { submissions: { videos: [], lenses: [] }, ... }
    return apiRequest<{
      submissions: { videos: ShowcaseItem[], lenses: ShowcaseItem[] }
    }>('/student/get_dashboard.php');
  }
};