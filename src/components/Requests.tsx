import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Card, 
  CardContent, 
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
import '../styles/Requests.css';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale/tr';

const StyledChip = styled(Chip)`
  &.beklemede {
    background-color: #ffd700;
    color: #000;
  }
  &.onaylandi {
    background-color: #4caf50;
    color: #fff;
  }
  &.reddedildi {
    background-color: #f44336;
    color: #fff;
  }
`;

interface TayinTalebi {
  id: number;
  talepEdilenAdliye: string;
  basvuruTarihi: string;
  aciklama: string;
  talepDurumu: string;
  degerlendirilmeTarihi?: string;
  degerlendirmeNotu?: string;
  isOnaylandi: boolean;
}

const Requests: React.FC = () => {
  const { user } = useAuth();
  const [talepler, setTalepler] = useState<TayinTalebi[]>([]);

  useEffect(() => {
    const fetchTalepler = async () => {
      try {
        const response = await api.get('/tayin/my');
        setTalepler(response.data);
      } catch (error) {
        console.error('Talepler getirilirken hata:', error);
      }
    };

    fetchTalepler();
  }, []);

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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Taleplerim
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Başvuru Tarihi</TableCell>
                <TableCell>Talep Edilen Adliye</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Değerlendirilme Tarihi</TableCell>
                <TableCell>Değerlendirme Notu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {talepler.map((talep) => (
                <TableRow key={talep.id}>
                  <TableCell>{formatDateTime(talep.basvuruTarihi)}</TableCell>
                  <TableCell>{talep.talepEdilenAdliye}</TableCell>
                  <TableCell>{talep.aciklama}</TableCell>
                  <TableCell>
                    <StyledChip
                      label={getDurumText(talep.talepDurumu, talep.isOnaylandi)}
                      className={getDurumClassName(talep.talepDurumu, talep.isOnaylandi)}
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(talep.degerlendirilmeTarihi)}</TableCell>
                  <TableCell>{talep.degerlendirmeNotu || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Requests; 