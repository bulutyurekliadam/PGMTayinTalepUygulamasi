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
  Chip
} from '@mui/material';
import styled from '@emotion/styled';
import api from '../services/api';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar getirilirken hata:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
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
        Kullanıcılar
      </Typography>
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
                <TableCell>{user.sicilNo}</TableCell>
                <TableCell>{user.ad} {user.soyad}</TableCell>
                <TableCell>{user.unvan}</TableCell>
                <TableCell>{user.mevcutAdliye}</TableCell>
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
    </StyledContainer>
  );
};

export default Users; 