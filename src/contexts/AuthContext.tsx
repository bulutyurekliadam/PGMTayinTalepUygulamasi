import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  login: (sicilNo: string, password: string) => Promise<void>;
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
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (sicilNo: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5032/api/auth/login', {
        sicilNo,
        password,
      });
      setUser(response.data);
    } catch (error) {
      throw new Error('Giriş başarısız');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => {
    try {
      await axios.post('http://localhost:5032/api/auth/register', userData);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data || 'Kayıt başarısız');
      }
      throw new Error('Kayıt başarısız');
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 