import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService from '../services/auth.service';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, lastname: string, email: string, password: string) => Promise<void>;
  recoverPassword: (email: string, code?: string) => Promise<void>;
  resetPassword: (email: string, token: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // TODO: Verify token and get user profile
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      localStorage.setItem('token', response.token);
      
      // Get user profile
      const profile = await authService.getProfile(response.token);
      setUser(profile.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, lastname: string, email: string, password: string) => {
    try {
      await authService.register({ name, lastname, email, password });
      // After successful registration, login
      await login(email, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const recoverPassword = async (email: string, code?: string) => {
    try {
      await authService.recoverPassword({ email, code });
    } catch (error) {
      console.error('Password recovery error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string, token: string, password: string) => {
    try {
      await authService.resetPassword({ email, token, password });
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    recoverPassword,
    resetPassword,
    logout,
    isLoading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
