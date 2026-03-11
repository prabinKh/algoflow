import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
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
     const response = await apiFetch('/auth/check/');
     if (response.ok) {
       const data = await response.json();
       if (data.authenticated && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
     console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
     const response = await apiFetch('/auth/token/refresh/', {
       method: 'POST',
      });
      
     if (!response.ok) {
       throw new Error('Token refresh failed');
      }
      
      return true;
    } catch (error) {
     console.error('Token refresh failed:', error);
      setUser(null);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
     const response = await apiFetch('/auth/login/', {
       method: 'POST',
       body: JSON.stringify({ email, password }),
      });
      
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.message || 'Login failed');
      }
      
     const data = await response.json();
      
     if (data.success && data.user) {
        setUser(data.user);
      } else {
       throw new Error('Login failed');
      }
    } catch (error: any) {
     console.error('Login failed:', error);
     throw error;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
     const response = await apiFetch('/auth/register/', {
       method: 'POST',
       body: JSON.stringify({ name, email, password, password2: confirmPassword }),
      });
      
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.errors?.email?.[0] || errorData.errors?.password?.[0] || errorData.message || 'Registration failed');
      }
      
     const data = await response.json();
      
     if (!data.success) {
       throw new Error(data.message || 'Registration failed');
      }
      
      // Don't auto-login after registration - user needs to verify email first
      //User will be redirected to login or verification page
    } catch (error: any) {
     console.error('Registration failed:', error);
     throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
     const response = await apiFetch('/auth/password-reset/', {
       method: 'POST',
       body: JSON.stringify({ email }),
      });
      
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.message || 'Password reset failed');
      }
      
     const data = await response.json();
      
     if (!data.success) {
       throw new Error(data.message || 'Password reset failed');
      }
    } catch (error: any) {
     console.error('Password reset failed:', error);
     throw error;
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout/', {
       method: 'POST',
      });
    } catch (error) {
     console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      resetPassword, 
      logout, 
      refreshToken,
      checkAuth,
      isAuthenticated: !!user,
      isLoading 
    }}>
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
