import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import axios from 'axios';

interface TayinTalebi {
  id: number;
  talepEdilenAdliye: string;
  basvuruTarihi: string;
  aciklama: string;
  talepDurumu: string;
  degerlendirilmeTarihi: string | null;
  degerlendirmeNotu: string | null;
  isOnaylandi: boolean;
  sicilNo: string;
  ad: string;
  soyad: string;
  unvan: string;
  mevcutAdliye: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const AdminTayinTalepleri = () => {
  const [talepler, setTalepler] = useState<TayinTalebi[]>([]);
  const [selectedTalep, setSelectedTalep] = useState<TayinTalebi | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [degerlendirmeNotu, setDegerlendirmeNotu] = useState('');
  const [isOnaylandi, setIsOnaylandi] = useState(false);

  useEffect(() => {
    fetchTalepler();
  }, []);

  const fetchTalepler = async () => {
    try {
      const response = await axios.get('http://localhost:5032/api/tayin/talepler');
      setTalepler(response.data);
    } catch (error) {
      console.error('Talepler yüklenirken hata oluştu:', error);
    }
  };

  const handleDegerlendir = (talep: TayinTalebi) => {
    setSelectedTalep(talep);
    setDegerlendirmeNotu('');
    setIsOnaylandi(false);
    setDialogOpen(true);
  };

  const handleDegerlendirmeGonder = async () => {
    if (!selectedTalep) return;

    try {
      await axios.put(`http://localhost:5032/api/tayin/degerlendir/${selectedTalep.id}`, {
        degerlendirmeNotu,
        isOnaylandi
      });
      setDialogOpen(false);
      fetchTalepler();
    } catch (error) {
      console.error('Değerlendirme gönderilirken hata oluştu:', error);
    }
  };

  const getDurumRengi = (durum: string, isOnaylandi: boolean) => {
    if (durum === 'Değerlendirildi') {
      return isOnaylandi ? 'success' : 'error';
    }
    return 'warning';
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Tüm Tayin Talepleri
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
              <TableCell>Açıklama</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Değerlendirilme Tarihi</TableCell>
              <TableCell>Değerlendirme Notu</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {talepler.map((talep) => (
              <TableRow key={talep.id}>
                <TableCell>{talep.sicilNo}</TableCell>
                <TableCell>{`${talep.ad} ${talep.soyad}`}</TableCell>
                <TableCell>{talep.unvan}</TableCell>
                <TableCell>{talep.mevcutAdliye}</TableCell>
                <TableCell>{talep.talepEdilenAdliye}</TableCell>
                <TableCell>{formatDate(talep.basvuruTarihi)}</TableCell>
                <TableCell>{talep.aciklama}</TableCell>
                <TableCell>
                  <Chip
                    label={talep.talepDurumu}
                    color={getDurumRengi(talep.talepDurumu, talep.isOnaylandi)}
                  />
                </TableCell>
                <TableCell>
                  {talep.degerlendirilmeTarihi ? formatDate(talep.degerlendirilmeTarihi) : '-'}
                </TableCell>
                <TableCell>{talep.degerlendirmeNotu || '-'}</TableCell>
                <TableCell>
                  {talep.talepDurumu === 'Beklemede' && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleDegerlendir(talep)}
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
        <DialogTitle>Tayin Talebini Değerlendir</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Değerlendirme Notu"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={degerlendirmeNotu}
            onChange={(e) => setDegerlendirmeNotu(e.target.value)}
          />
          <Button
            variant={isOnaylandi ? 'contained' : 'outlined'}
            color="success"
            onClick={() => setIsOnaylandi(true)}
            sx={{ mt: 2, mr: 1 }}
          >
            Onayla
          </Button>
          <Button
            variant={!isOnaylandi ? 'contained' : 'outlined'}
            color="error"
            onClick={() => setIsOnaylandi(false)}
            sx={{ mt: 2 }}
          >
            Reddet
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>İptal</Button>
          <Button onClick={handleDegerlendirmeGonder} variant="contained">
            Gönder
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminTayinTalepleri; 