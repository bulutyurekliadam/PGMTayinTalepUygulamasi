import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface TayinTalebi {
  id: number;
  talepEdilenAdliye: string;
  basvuruTarihi: string;
  talepDurumu: string;
  aciklama?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [adliyeler, setAdliyeler] = useState<string[]>([]);
  const [tayinTalepleri, setTayinTalepleri] = useState<TayinTalebi[]>([]);
  const [yeniTalep, setYeniTalep] = useState({
    talepEdilenAdliye: '',
    aciklama: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdliyeler();
    fetchTayinTalepleri();
  }, []);

  const fetchAdliyeler = async () => {
    try {
      const response = await api.get('/tayin/adliyeler');
      setAdliyeler(response.data);
    } catch (error) {
      console.error('Adliyeler yüklenirken hata oluştu:', error);
    }
  };

  const fetchTayinTalepleri = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tayin/my');
      setTayinTalepleri(response.data);
    } catch (error: any) {
      console.error('Tayin talepleri yüklenirken hata oluştu:', error);
      const errorMessage = error.response?.data?.message || 'Tayin talepleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTayinTalebi = async () => {
    try {
      if (!yeniTalep.talepEdilenAdliye) {
        alert('Lütfen talep edilecek adliyeyi seçin.');
        return;
      }

      const response = await api.post('/tayin', {
        talepEdilenAdliye: yeniTalep.talepEdilenAdliye,
        aciklama: yeniTalep.aciklama,
      });

      setYeniTalep({ talepEdilenAdliye: '', aciklama: '' });
      await fetchTayinTalepleri();
      alert('Tayin talebi başarıyla oluşturuldu.');
    } catch (error: any) {
      console.error('Tayin talebi oluşturma hatası:', error);
      alert(error.response?.data || 'Tayin talebi oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personel Tayin Talep Sistemi
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Personel Bilgileri
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Typography>Ad Soyad: {user?.ad} {user?.soyad}</Typography>
            <Typography>Sicil No: {user?.sicilNo}</Typography>
            <Typography>Unvan: {user?.unvan}</Typography>
            <Typography>Mevcut Adliye: {user?.mevcutAdliye}</Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Yeni Tayin Talebi
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Talep Edilen Adliye</InputLabel>
              <Select
                value={yeniTalep.talepEdilenAdliye}
                label="Talep Edilen Adliye"
                onChange={(e) => setYeniTalep({ ...yeniTalep, talepEdilenAdliye: e.target.value })}
              >
                {adliyeler.map((adliye) => (
                  <MenuItem key={adliye} value={adliye}>
                    {adliye}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Açıklama"
              multiline
              rows={4}
              value={yeniTalep.aciklama}
              onChange={(e) => setYeniTalep({ ...yeniTalep, aciklama: e.target.value })}
            />
            <Button
              variant="contained"
              onClick={handleTayinTalebi}
              disabled={!yeniTalep.talepEdilenAdliye}
            >
              Tayin Talebi Oluştur
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tayin Talepleri
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Başvuru Tarihi</TableCell>
                  <TableCell>Talep Edilen Adliye</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Açıklama</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tayinTalepleri.map((talep) => (
                  <TableRow key={talep.id}>
                    <TableCell>{new Date(talep.basvuruTarihi).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>{talep.talepEdilenAdliye}</TableCell>
                    <TableCell>{talep.talepDurumu}</TableCell>
                    <TableCell>{talep.aciklama}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard; 