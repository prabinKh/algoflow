/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the app.
 * Wrap your app with AuthProvider to use authentication.
 * 
 * @example
 * ```tsx
 * // In main.tsx or App.tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 * 
 * @example
 * ```tsx
 * // In any component
 * const { user, login, isAuthenticated, isAdmin } = useAuth();
 * ```
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginApi,
  registerApi,
  logoutApi,
  checkAuthApi,
  refreshTokenApi,
  resetPasswordApi,
  verifyEmailApi,
  resendVerificationApi,
  User,
} from './api';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await checkAuthApi();
      if (data.authenticated && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await refreshTokenApi();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    
    if (data.success && data.user) {
      setUser(data.user);
    } else {
      throw new Error('Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    await registerApi(name, email, password, confirmPassword);
    // Don't auto-login after registration - user needs to verify email first
  };

  const resetPassword = async (email: string) => {
    await resetPasswordApi(email);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  const verifyEmail = async (token: string) => {
    const data = await verifyEmailApi(token);
    if (data.success && data.user) {
      setUser(data.user);
    }
  };

  const resendVerification = async (email: string) => {
    await resendVerificationApi(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        resetPassword,
        logout,
        refreshToken,
        checkAuth,
        verifyEmail,
        resendVerification,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.is_superuser ?? false,
        isStaff: user?.is_staff ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
