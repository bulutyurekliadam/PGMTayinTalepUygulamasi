import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography
} from '@mui/material';
import AllRequests from './AllRequests';
import api from '../services/api';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';

interface TalepDurumu {
  beklemede: number;
  onaylandi: number;
  reddedildi: number;
}

const formatDateTime = (dateString: string | undefined | null) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm');
  } catch (error) {
    console.error('Tarih formatlanırken hata:', error);
    return dateString || '-';
  }
};

const AdminDashboard: React.FC = () => {
  const [talepDurumu, setTalepDurumu] = useState<TalepDurumu>({
    beklemede: 0,
    onaylandi: 0,
    reddedildi: 0
  });

  useEffect(() => {
    fetchTalepDurumu();
  }, []);

  const fetchTalepDurumu = async () => {
    try {
      const response = await api.get('/tayin/all');
      const talepler = response.data;
      
      const durum = talepler.reduce((acc: TalepDurumu, talep: any) => {
        if (talep.talepDurumu === 'Beklemede') {
          acc.beklemede++;
        } else if (talep.isOnaylandi) {
          acc.onaylandi++;
        } else {
          acc.reddedildi++;
        }
        return acc;
      }, { beklemede: 0, onaylandi: 0, reddedildi: 0 });

      setTalepDurumu(durum);
    } catch (error) {
      console.error('Talep durumları getirilirken hata:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Yönetim Paneli
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        mb: 4
      }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#fff3e0', height: '100%' }}>
            <HourglassEmptyIcon sx={{ fontSize: 40, color: '#ffd700', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="div" sx={{ color: '#000' }}>
                {talepDurumu.beklemede}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#000' }}>
                Bekleyen Talepler
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#4caf50', height: '100%' }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="div" sx={{ color: '#fff' }}>
                {talepDurumu.onaylandi}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                Onaylanan Talepler
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#f44336', height: '100%' }}>
            <CancelIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="div" sx={{ color: '#fff' }}>
                {talepDurumu.reddedildi}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                Reddedilen Talepler
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <AllRequests />
    </Container>
  );
};

export default AdminDashboard; 