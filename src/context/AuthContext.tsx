import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Business } from '../types';
import { api } from '../services/api';

interface AuthContextValue {
  user: User | null;
  business: Business | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, businessName?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateBusinessLocally: (business: Business) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('growthpilot_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('growthpilot_token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setBusiness(data.business);
    } catch (err) {
      console.warn('Session check failed, resetting token');
      localStorage.removeItem('growthpilot_token');
      setToken(null);
      setUser(null);
      setBusiness(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('growthpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setBusiness(res.business || null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, businessName?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password, businessName });
      localStorage.setItem('growthpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setBusiness(res.business || null);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin();
      localStorage.setItem('growthpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setBusiness(res.business || null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('growthpilot_token');
    setToken(null);
    setUser(null);
    setBusiness(null);
  };

  const updateBusinessLocally = (updated: Business) => {
    setBusiness(updated);
  };

  const refreshProfile = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      setBusiness(data.business);
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        demoLogin,
        logout,
        updateBusinessLocally,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
