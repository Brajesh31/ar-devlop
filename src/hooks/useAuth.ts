/**
 * Authentication Hook
 * Manages user authentication state and provides unified access to all Auth APIs
 * * STATUS: Updated for Login, Signup, Forgot Password, and Reset Password
 */

import { useState, useEffect, useCallback } from 'react';
import { authService, AuthUser, PublicLoginCredentials } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AUTH_STORAGE_KEY = 'bharatxr_auth_user';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // 1. Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Login Function
  const login = useCallback(async (credentials: PublicLoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);

      if (result.status === 'success' && result.user) {
        const authUser: AuthUser = result.user;

        setUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${authUser.name}!`,
        });

        // Return result for redirect logic in UI
        return { success: true, user: authUser, redirect: result.redirect };
      } else {
        toast({
          title: 'Login Failed',
          description: result.message || 'Invalid credentials',
          variant: 'destructive',
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
      return { success: false, message: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // 3. Signup Function
  const signup = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const result = await authService.register(data);

      if (result.status === 'success') {
        toast({
          title: 'Account Created',
          description: 'Registration successful! Please login.',
        });
        return { success: true, userId: result.user_id };
      } else {
        toast({
          title: 'Registration Failed',
          description: result.message || 'Could not create account',
          variant: 'destructive',
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
      return { success: false, message: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // 4. Forgot Password Function (NEW)
  const forgotPassword = useCallback(async (email: string) => {
    try {
      const result = await authService.forgotPassword(email);
      if (result.status === 'success') {
        toast({
          title: 'Email Sent',
          description: 'Check your inbox for the reset link.',
        });
        return { success: true };
      } else {
        toast({
          title: 'Request Failed',
          description: result.message || 'Could not send reset link',
          variant: 'destructive',
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  }, [toast]);

  // 5. Reset Password Function (NEW)
  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      const result = await authService.resetPassword(token, password);
      if (result.status === 'success') {
        toast({
          title: 'Password Reset',
          description: 'Your password has been updated successfully.',
        });
        return { success: true };
      } else {
        toast({
          title: 'Reset Failed',
          description: result.message || 'Could not reset password',
          variant: 'destructive',
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  }, [toast]);

  // 6. Logout Function
  const logout = useCallback(async () => {
    try {
      // Optional: Call backend logout if needed
      // await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.',
      });
    }
  }, [toast]);

  // Role Helpers
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isStudent = ['school', 'undergraduate', 'graduate'].includes(user?.role || '');
  const isProfessional = user?.role === 'professional';

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isStudent,
    isProfessional,
    login,
    signup,
    logout,
    forgotPassword, // Exposed new method
    resetPassword,  // Exposed new method
  };
};

export const getStoredUser = (): AuthUser | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};