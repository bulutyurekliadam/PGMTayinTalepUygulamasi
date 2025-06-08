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
}

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const AdminDashboard = () => {
  const [tayinTalepleri, setTayinTalepleri] = useState<TayinTalebi[]>([]);
  const [selectedTalep, setSelectedTalep] = useState<TayinTalebi | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [degerlendirmeNotu, setDegerlendirmeNotu] = useState('');

  useEffect(() => {
    fetchTayinTalepleri();
  }, []);

  const fetchTayinTalepleri = async () => {
    try {
      const response = await api.get('/tayin/all');
      setTayinTalepleri(response.data);
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
        Tayin Talepleri Yönetimi
      </Typography>
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