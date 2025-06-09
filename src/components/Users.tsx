import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import styled from '@emotion/styled';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StyledContainer = styled.div`
  padding: 20px;
`;

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

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchUsers();
    } else {
      setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
      setLoading(false);
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/Users');
      if (response.data) {
        setUsers(response.data);
      } else {
        setError('Kullanıcı verisi bulunamadı.');
      }
    } catch (error: any) {
      console.error('Kullanıcılar getirilirken hata:', error);
      setError(error.response?.data?.message || 'Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Geçersiz tarih');
      }
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Tarih formatlanırken hata:', error);
      return 'Geçersiz Tarih';
    }
  };

  const calculateServiceTime = (startDate: string) => {
    try {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new Error('Geçersiz tarih');
      }
      
      const now = new Date();
      const diffInYears = now.getFullYear() - start.getFullYear();
      const diffInMonths = now.getMonth() - start.getMonth();
      
      let years = diffInYears;
      let months = diffInMonths;
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      if (years < 0 || (years === 0 && months < 0)) {
        throw new Error('Gelecek tarih');
      }
      
      return `${years} yıl ${months} ay`;
    } catch (error) {
      console.error('Hizmet süresi hesaplanırken hata:', error);
      return 'Hesaplanamadı';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Kullanıcılar
      </Typography>
      {users.length === 0 ? (
        <Alert severity="info">Henüz kayıtlı kullanıcı bulunmamaktadır.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sicil No</TableCell>
                <TableCell>Ad Soyad</TableCell>
                <TableCell>Unvan</TableCell>
                <TableCell>Mevcut Adliye</TableCell>
                <TableCell>İşe Başlama Tarihi</TableCell>
                <TableCell>Hizmet Süresi</TableCell>
                <TableCell>Yetki</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.sicilNo || '-'}</TableCell>
                  <TableCell>{`${user.ad || ''} ${user.soyad || ''}`}</TableCell>
                  <TableCell>{user.unvan || '-'}</TableCell>
                  <TableCell>{user.mevcutAdliye || '-'}</TableCell>
                  <TableCell>{formatDate(user.iseBaslamaTarihi)}</TableCell>
                  <TableCell>{calculateServiceTime(user.iseBaslamaTarihi)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isAdmin ? "Admin" : "Kullanıcı"}
                      color={user.isAdmin ? "primary" : "default"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </StyledContainer>
  );
};

export default Users; 