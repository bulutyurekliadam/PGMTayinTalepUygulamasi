import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled
} from '@mui/material';
import api from '../services/api';

interface User {
  id: number;
  sicilNo: string;
  ad: string;
  soyad: string;
  unvan: string;
  mevcutAdliye: string;
  iseBaslamaTarihi: string;
  email: string;
  rol: string;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata oluştu:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const calculateServiceTime = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffInYears = now.getFullYear() - start.getFullYear();
    const diffInMonths = now.getMonth() - start.getMonth();
    
    let years = diffInYears;
    let months = diffInMonths;
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return `${years} yıl ${months} ay`;
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Sistem Kullanıcıları
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sicil No</TableCell>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>Unvan</TableCell>
              <TableCell>Adliye</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>İşe Başlama Tarihi</TableCell>
              <TableCell>Hizmet Süresi</TableCell>
              <TableCell>Rol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.sicilNo}</TableCell>
                <TableCell>{`${user.ad} ${user.soyad}`}</TableCell>
                <TableCell>{user.unvan}</TableCell>
                <TableCell>{user.mevcutAdliye}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.iseBaslamaTarihi)}</TableCell>
                <TableCell>{calculateServiceTime(user.iseBaslamaTarihi)}</TableCell>
                <TableCell>{user.rol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledContainer>
  );
};

export default Users; 