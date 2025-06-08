import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  sicilNo: string;
  ad: string;
  soyad: string;
  unvan: string;
  mevcutAdliye: string;
  iseBaslamaTarihi: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (sicilNo: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (sicilNo: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { sicilNo, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return true;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Giriş başarısız');
      }
      throw new Error('Giriş başarısız. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Kayıt başarısız');
      }
      throw new Error('Kayıt başarısız. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 