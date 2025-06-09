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
import { format, differenceInYears, differenceInMonths } from 'date-fns';
import { tr } from 'date-fns/locale/tr';

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

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const formatDate = (dateString: string | null) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy');
    } catch (error) {
      console.error('Tarih formatlanırken hata:', error);
      return dateString || '-';
    }
  };

  const calculateHizmetSuresi = (iseBaslamaTarihi: string) => {
    try {
      if (!iseBaslamaTarihi) return '-';
      const startDate = new Date(iseBaslamaTarihi);
      const today = new Date();
      const years = differenceInYears(today, startDate);
      const months = differenceInMonths(today, startDate) % 12;
      
      if (years === 0) {
        return `${months} ay`;
      }
      return `${years} yıl ${months} ay`;
    } catch (error) {
      console.error('Hizmet süresi hesaplanırken hata:', error);
      return '-';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Oturum bulunamadı');
          setLoading(false);
          return;
        }

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
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Kullanıcı Listesi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
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