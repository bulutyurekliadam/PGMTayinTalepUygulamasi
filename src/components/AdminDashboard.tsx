import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';
import api from '../services/api';

interface TayinTalebi {
  id: number;
  basvuruTarihi: string;
  talepEdilenAdliye: string;
  aciklama: string;
  talepDurumu: string;
  personel: {
    sicilNo: string;
    ad: string;
    soyad: string;
    unvan: string;
    mevcutAdliye: string;
  };
  isOnaylandi: boolean;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 48,
    marginRight: theme.spacing(1),
  },
}));

const AdminDashboard = () => {
  const [tayinTalepleri, setTayinTalepleri] = useState<TayinTalebi[]>([]);
  const [selectedTalep, setSelectedTalep] = useState<TayinTalebi | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [degerlendirmeNotu, setDegerlendirmeNotu] = useState('');
  const [stats, setStats] = useState({
    bekleyen: 0,
    onaylanan: 0,
    reddedilen: 0
  });

  useEffect(() => {
    fetchTayinTalepleri();
  }, []);

  const fetchTayinTalepleri = async () => {
    try {
      const response = await api.get('/tayin/all');
      const talepler: TayinTalebi[] = response.data;
      
      const yeniStats = {
        bekleyen: 0,
        onaylanan: 0,
        reddedilen: 0
      };

      talepler.forEach(talep => {
        if (talep.talepDurumu === 'Beklemede') {
          yeniStats.bekleyen++;
        } else if (talep.isOnaylandi) {
          yeniStats.onaylanan++;
        } else {
          yeniStats.reddedilen++;
        }
      });

      setStats(yeniStats);
      setTayinTalepleri(talepler);
    } catch (error) {
      console.error('Tayin talepleri yüklenirken hata oluştu:', error);
    }
  };

  const handleDegerlendirmeSubmit = async (onay: boolean) => {
    if (!selectedTalep) return;

    try {
      await api.put(`/tayin/${selectedTalep.id}/degerlendirme`, {
        talepDurumu: onay ? 'Onaylandı' : 'Reddedildi',
        degerlendirmeNotu: degerlendirmeNotu,
        isOnaylandi: onay
      });
      setDialogOpen(false);
      setDegerlendirmeNotu('');
      fetchTayinTalepleri();
    } catch (error) {
      console.error('Değerlendirme kaydedilirken hata:', error);
      alert('Değerlendirme kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Yönetim Paneli
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, 1fr)'
        },
        gap: 4
      }}>
        <Box>
          <StyledPaper elevation={3}>
            <IconWrapper>
              <HourglassEmptyIcon sx={{ color: 'warning.main' }} />
              <Typography variant="h3">{stats.bekleyen}</Typography>
            </IconWrapper>
            <Typography variant="h6" align="center">
              Bekleyen Talepler
            </Typography>
          </StyledPaper>
        </Box>
        <Box>
          <StyledPaper elevation={3}>
            <IconWrapper>
              <CheckCircleIcon sx={{ color: 'success.main' }} />
              <Typography variant="h3">{stats.onaylanan}</Typography>
            </IconWrapper>
            <Typography variant="h6" align="center">
              Onaylanan Talepler
            </Typography>
          </StyledPaper>
        </Box>
        <Box>
          <StyledPaper elevation={3}>
            <IconWrapper>
              <CancelIcon sx={{ color: 'error.main' }} />
              <Typography variant="h3">{stats.reddedilen}</Typography>
            </IconWrapper>
            <Typography variant="h6" align="center">
              Reddedilen Talepler
            </Typography>
          </StyledPaper>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sicil No</TableCell>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>Unvan</TableCell>
              <TableCell>Mevcut Adliye</TableCell>
              <TableCell>Talep Edilen Adliye</TableCell>
              <TableCell>Başvuru Tarihi</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tayinTalepleri.map((talep) => (
              <TableRow key={talep.id}>
                <TableCell>{talep.personel.sicilNo}</TableCell>
                <TableCell>{`${talep.personel.ad} ${talep.personel.soyad}`}</TableCell>
                <TableCell>{talep.personel.unvan}</TableCell>
                <TableCell>{talep.personel.mevcutAdliye}</TableCell>
                <TableCell>{talep.talepEdilenAdliye}</TableCell>
                <TableCell>{new Date(talep.basvuruTarihi).toLocaleDateString('tr-TR')}</TableCell>
                <TableCell>{talep.talepDurumu}</TableCell>
                <TableCell>
                  {talep.talepDurumu === 'Beklemede' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedTalep(talep);
                        setDialogOpen(true);
                      }}
                    >
                      Değerlendir
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Tayin Talebi Değerlendirme</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Talep Edilen Adliye:</strong> {selectedTalep?.talepEdilenAdliye}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Açıklama:</strong> {selectedTalep?.aciklama}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Değerlendirme Notu"
            multiline
            rows={4}
            value={degerlendirmeNotu}
            onChange={(e) => setDegerlendirmeNotu(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            İptal
          </Button>
          <Button onClick={() => handleDegerlendirmeSubmit(false)} color="error">
            Reddet
          </Button>
          <Button onClick={() => handleDegerlendirmeSubmit(true)} color="primary">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AdminDashboard; 