/**
 * Authentication Hook
 * Manages user authentication state and provides login/logout functions
 */

import { useState, useEffect, useCallback } from 'react';
import { authService, AuthUser, LoginCredentials, SignupData } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AUTH_STORAGE_KEY = 'bharatxr_auth_user';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Load user from storage on mount
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

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      
      if (result.status === 'success' && result.data?.user) {
        const authUser = result.data.user;
        setUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${authUser.name}!`,
        });
        
        return { success: true, user: authUser };
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

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    try {
      const result = await authService.signup(data);
      
      if (result.status === 'success') {
        toast({
          title: 'Account Created',
          description: 'Please login with your credentials.',
        });
        return { success: true, userId: result.data?.user_id };
      } else {
        toast({
          title: 'Signup Failed',
          description: result.message || 'Registration failed',
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

  const logout = useCallback(async () => {
    try {
      await authService.logout();
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

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isStudent = user?.role === 'student';

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isStudent,
    login,
    signup,
    logout,
  };
};

// Auth context for global state (optional usage)
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

export const clearStoredUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
