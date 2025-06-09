// Gerekli React ve Material-UI bileşenlerinin import edilmesi
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns';
import { tr } from 'date-fns/locale';

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

// Admin Kullanıcılar Listesi bileşeni
const AdminUsers = () => {
  // State tanımlamaları
  const [users, setUsers] = useState<User[]>([]); // Kullanıcı listesini tutan state
  const [loading, setLoading] = useState(true);   // Yükleme durumu
  const [error, setError] = useState<string>(''); // Hata mesajı

  // Tarihi formatlamak için yardımcı fonksiyon (örn: 01.06.2025)
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '-';
      const date = parseISO(dateString);
      return format(date, 'dd.MM.yyyy', { locale: tr });
    } catch (error) {
      console.error('Tarih formatlanırken hata:', error);
      return dateString || '-';
    }
  };

  // İşe başlama tarihine göre hizmet süresini hesaplayan fonksiyon
  const calculateHizmetSuresi = (iseBaslamaTarihi: string) => {
    try {
      if (!iseBaslamaTarihi) return '-';
      const startDate = parseISO(iseBaslamaTarihi);
      const today = new Date();
      const years = differenceInYears(today, startDate);
      const months = differenceInMonths(today, startDate) % 12;
      
      // Sadece ay veya yıl ve ay olarak formatlama
      if (years === 0) {
        return `${months} ay`;
      }
      return `${years} yıl ${months} ay`;
    } catch (error) {
      console.error('Hizmet süresi hesaplanırken hata:', error);
      return '-';
    }
  };

  // Kullanıcı listesini API'den çekme
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Token kontrolü
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Oturum bulunamadı');
          setLoading(false);
          return;
        }

        // API'den kullanıcıları getirme
        const response = await axios.get('http://localhost:5032/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Kullanıcılar yüklenirken hata:', error);
        setError(error.response?.data || 'Kullanıcılar yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Component mount olduğunda bir kere çalışır

  // Yükleme durumu gösterimi
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Hata durumu gösterimi
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Ana bileşen render'ı
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Kullanıcı Listesi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          {/* Tablo başlıkları */}
          <TableHead>
            <TableRow>
              <TableCell>Sicil No</TableCell>
              <TableCell>Ad</TableCell>
              <TableCell>Soyad</TableCell>
              <TableCell>Ünvan</TableCell>
              <TableCell>Mevcut Adliye</TableCell>
              <TableCell>İşe Başlama Tarihi</TableCell>
              <TableCell>Hizmet Süresi</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>
          {/* Tablo içeriği */}
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.sicilNo}</TableCell>
                <TableCell>{user.ad}</TableCell>
                <TableCell>{user.soyad}</TableCell>
                <TableCell>{user.unvan}</TableCell>
                <TableCell>{user.mevcutAdliye}</TableCell>
                <TableCell>{formatDate(user.iseBaslamaTarihi)}</TableCell>
                <TableCell>{calculateHizmetSuresi(user.iseBaslamaTarihi)}</TableCell>
                <TableCell>{user.isAdmin ? 'Evet' : 'Hayır'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsers;