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
  Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
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
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

const TayinTalepleri = () => {
  const [talepler, setTalepler] = useState<TayinTalebi[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTalepler = async () => {
      try {
        const response = await axios.get(`http://localhost:5032/api/tayin/taleplerim/${user?.sicilNo}`);
        setTalepler(response.data);
      } catch (error) {
        console.error('Talepler yüklenirken hata oluştu:', error);
      }
    };

    if (user?.sicilNo) {
      fetchTalepler();
    }
  }, [user?.sicilNo]);

  const getDurumRengi = (durum: string, isOnaylandi: boolean) => {
    if (durum === 'Değerlendirildi') {
      return isOnaylandi ? 'success' : 'error';
    }
    return 'warning';
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Tayin Taleplerim
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Talep ID</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Personel</TableCell>
              <TableCell>Mevcut Adliye</TableCell>
              <TableCell>Talep Edilen Adliye</TableCell>
              <TableCell>Oluşturulma Tarihi</TableCell>
              <TableCell>İşlenme Tarihi</TableCell>
              <TableCell>Gerekçe</TableCell>
              <TableCell>İşlem Notları</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {talepler.map((talep) => {
              const basvuruTarih = formatDate(talep.basvuruTarihi);
              const degerlendirilmeTarih = talep.degerlendirilmeTarihi ? formatDate(talep.degerlendirilmeTarihi) : null;
              
              return (
                <TableRow key={talep.id}>
                  <TableCell>#{talep.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={talep.talepDurumu}
                      color={getDurumRengi(talep.talepDurumu, talep.isOnaylandi)}
                    />
                  </TableCell>
                  <TableCell>{user?.ad} {user?.soyad}</TableCell>
                  <TableCell>{user?.mevcutAdliye}</TableCell>
                  <TableCell>{talep.talepEdilenAdliye}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{basvuruTarih.date}</Typography>
                      <Typography variant="caption" color="textSecondary">{basvuruTarih.time}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {degerlendirilmeTarih ? (
                      <Box>
                        <Typography variant="body2">{degerlendirilmeTarih.date}</Typography>
                        <Typography variant="caption" color="textSecondary">{degerlendirilmeTarih.time}</Typography>
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{talep.aciklama}</TableCell>
                  <TableCell>{talep.degerlendirmeNotu || '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TayinTalepleri; 