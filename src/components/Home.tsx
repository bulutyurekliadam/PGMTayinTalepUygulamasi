import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';
import '../styles/Home.css';
import api from '../services/api';

interface TayinTalebi {
  id: number;
  talepEdilenAdliye: string;
  basvuruTarihi: string;
  talepDurumu: string;
  isOnaylandi?: boolean;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [talepler, setTalepler] = React.useState<TayinTalebi[]>([]);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const fetchTalepler = async () => {
      try {
        const response = await api.get('/tayin/my');
        if (response.data) {
          setTalepler(response.data);
          setError('');
        }
      } catch (error: any) {
        console.error('Talepler getirilirken hata oluştu:', error);
        setError(error.response?.data?.message || 'Talepler getirilirken bir hata oluştu');
        setTalepler([]);
      }
    };

    fetchTalepler();
  }, []);

  const getTalepDurumuSayisi = () => {
    const durum = {
      beklemede: 0,
      onaylandi: 0,
      reddedildi: 0
    };

    talepler.forEach(talep => {
      if (talep.talepDurumu === 'Beklemede') {
        durum.beklemede++;
      } else if (talep.isOnaylandi) {
        durum.onaylandi++;
      } else {
        durum.reddedildi++;
      }
    });

    return durum;
  };

  const durum = getTalepDurumuSayisi();

  return (
    <div className="home-container">
      <Typography variant="h4" gutterBottom>
        Ana Sayfa
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personel Bilgileri
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Ad Soyad
                </Typography>
                <Typography variant="body1">
                  {user?.ad} {user?.soyad}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Sicil Numarası
                </Typography>
                <Typography variant="body1">
                  {user?.sicilNo}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Unvan
                </Typography>
                <Typography variant="body1">
                  {user?.unvan}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Mevcut Adliye
                </Typography>
                <Typography variant="body1">
                  {user?.mevcutAdliye}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" gutterBottom>
        Tayin Talepleri Özeti
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
        <Paper className="status-card waiting">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HourglassEmptyIcon sx={{ color: '#ff9800' }} />
            <Typography variant="h6">{durum.beklemede}</Typography>
          </Box>
          <Typography>Bekleyen Talepler</Typography>
        </Paper>
        <Paper className="status-card approved">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ color: '#4caf50' }} />
            <Typography variant="h6">{durum.onaylandi}</Typography>
          </Box>
          <Typography>Onaylanan Talepler</Typography>
        </Paper>
        <Paper className="status-card rejected">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CancelIcon sx={{ color: '#f44336' }} />
            <Typography variant="h6">{durum.reddedildi}</Typography>
          </Box>
          <Typography>Reddedilen Talepler</Typography>
        </Paper>
      </Box>
    </div>
  );
};

export default Home; 