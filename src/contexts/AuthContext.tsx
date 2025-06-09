// Gerekli React bileşenlerinin ve API servisinin import edilmesi
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Kullanıcı bilgileri için TypeScript interface tanımı
interface User {
  id: number;                 // Kullanıcı ID'si
  sicilNo: string;           // Sicil numarası
  ad: string;                // Adı
  soyad: string;            // Soyadı
  unvan: string;            // Ünvanı
  mevcutAdliye: string;     // Çalıştığı adliye
  iseBaslamaTarihi: string; // İşe başlama tarihi
  isAdmin: boolean;         // Admin yetkisi durumu
}

// AuthContext için TypeScript interface tanımı
interface AuthContextType {
  user: User | null;                                         // Mevcut kullanıcı bilgisi
  login: (sicilNo: string, password: string) => Promise<boolean>; // Giriş fonksiyonu
  logout: () => void;                                       // Çıkış fonksiyonu
  register: (userData: any) => Promise<void>;               // Kayıt fonksiyonu
}

// AuthContext oluşturulması
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// useAuth hook'u - AuthContext'e kolay erişim sağlar
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider bileşeni - Uygulama genelinde authentication state'ini yönetir
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Kullanıcı state'i - localStorage'dan başlangıç değeri alır
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Token kontrolü ve API header'ına eklenmesi
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Kullanıcı bilgilerinin localStorage'da güncellenmesi
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // Kullanıcı çıkış yaptığında tüm verilerin temizlenmesi
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // Giriş işlemi fonksiyonu
  const login = async (sicilNo: string, password: string): Promise<boolean> => {
    try {
      // API'ye giriş isteği gönderme
      const response = await api.post('/auth/login', { sicilNo, password });
      const { token, user } = response.data;
      
      // Token ve kullanıcı bilgilerinin kaydedilmesi
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user.isAdmin; // Admin durumunu döndür
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Giriş başarısız');
      }
      throw new Error('Giriş başarısız. Lütfen daha sonra tekrar deneyin.');
    }
  };

  // Çıkış işlemi fonksiyonu
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  // Kayıt işlemi fonksiyonu
  const register = async (userData: any) => {
    try {
      // API'ye kayıt isteği gönderme
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Kayıt başarısız');
      }
      throw new Error('Kayıt başarısız. Lütfen daha sonra tekrar deneyin.');
    }
  };

  // Context Provider'ın render edilmesi
  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 