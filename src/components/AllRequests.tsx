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
  Chip,
  styled
} from '@mui/material';
import api from '../services/api';
import { format } from 'date-fns';

interface TayinTalebi {
  id: number;
  basvuruTarihi: string;
  talepEdilenAdliye: string;
  aciklama: string;
  talepDurumu: string;
  degerlendirmeNotu?: string;
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

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  '&.beklemede': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  '&.onaylandi': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  '&.reddedildi': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
}));

const AllRequests = () => {
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

  const handleTalepDetay = (talep: TayinTalebi) => {
    setSelectedTalep(talep);
    setDegerlendirmeNotu('');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTalep(null);
    setDegerlendirmeNotu('');
  };

  const handleTalepDegerlendirme = async (onay: boolean) => {
    if (!selectedTalep) return;

    try {
      await api.put(`/tayin/${selectedTalep.id}/degerlendirme`, {
        talepDurumu: onay ? 'Onaylandı' : 'Reddedildi',
        degerlendirmeNotu,
        isOnaylandi: onay
      });
      
      await fetchTayinTalepleri();
      handleDialogClose();
    } catch (error) {
      console.error('Talep değerlendirme işlemi başarısız:', error);
    }
  };

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

  const getDurumText = (durum: string, isOnaylandi: boolean) => {
    if (durum === 'Beklemede') {
      return 'Beklemede';
    } else if (isOnaylandi) {
      return 'Onaylandı';
    } else {
      return 'Reddedildi';
    }
  };

  const getDurumClassName = (durum: string, isOnaylandi: boolean) => {
    if (durum === 'Beklemede') {
      return 'beklemede';
    } else if (isOnaylandi) {
      return 'onaylandi';
    } else {
      return 'reddedildi';
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Tüm Tayin Talepleri
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Başvuru Tarihi</TableCell>
              <TableCell>Personel</TableCell>
              <TableCell>Mevcut Adliye</TableCell>
              <TableCell>Talep Edilen Adliye</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tayinTalepleri.map((talep) => (
              <TableRow key={talep.id}>
                <TableCell>{formatDateTime(talep.basvuruTarihi)}</TableCell>
                <TableCell>
                  {talep.personel.sicilNo} - {talep.personel.ad} {talep.personel.soyad}
                  <br />
                  <Typography variant="caption" color="textSecondary">
                    {talep.personel.unvan}
                  </Typography>
                </TableCell>
                <TableCell>{talep.personel.mevcutAdliye}</TableCell>
                <TableCell>{talep.talepEdilenAdliye}</TableCell>
                <TableCell>
                  <StyledChip
                    label={getDurumText(talep.talepDurumu, talep.isOnaylandi)}
                    className={getDurumClassName(talep.talepDurumu, talep.isOnaylandi)}
                  />
                </TableCell>
                <TableCell>
                  {talep.talepDurumu === 'Beklemede' && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleTalepDetay(talep)}
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

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        {selectedTalep && (
          <>
            <DialogTitle>
              Tayin Talebi Detayı - {selectedTalep.personel.ad} {selectedTalep.personel.soyad}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Sicil No
                </Typography>
                <Typography>{selectedTalep.personel.sicilNo}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Unvan
                </Typography>
                <Typography>{selectedTalep.personel.unvan}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Mevcut Adliye
                </Typography>
                <Typography>{selectedTalep.personel.mevcutAdliye}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Talep Edilen Adliye
                </Typography>
                <Typography>{selectedTalep.talepEdilenAdliye}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Talep Açıklaması
                </Typography>
                <Typography>{selectedTalep.aciklama}</Typography>
              </Box>
              {selectedTalep.talepDurumu === 'Beklemede' && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Değerlendirme Notu"
                  value={degerlendirmeNotu}
                  onChange={(e) => setDegerlendirmeNotu(e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
              {selectedTalep.degerlendirmeNotu && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Değerlendirme Notu
                  </Typography>
                  <Typography>{selectedTalep.degerlendirmeNotu}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Kapat</Button>
              {selectedTalep.talepDurumu === 'Beklemede' && (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleTalepDegerlendirme(false)}
                  >
                    Reddet
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleTalepDegerlendirme(true)}
                  >
                    Onayla
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </StyledContainer>
  );
};

export default AllRequests; 