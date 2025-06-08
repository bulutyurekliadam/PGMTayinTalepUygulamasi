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
                  <TableCell>{new Date(talep.basvuruTarihi).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>{talep.talepEdilenAdliye}</TableCell>
                  <TableCell>{talep.aciklama}</TableCell>
                  <TableCell>
                    <StyledChip
                      label={getDurumText(talep.talepDurumu, talep.isOnaylandi)}
                      className={getDurumClassName(talep.talepDurumu, talep.isOnaylandi)}
                    />
                  </TableCell>
                  <TableCell>
                    {talep.degerlendirilmeTarihi 
                      ? new Date(talep.degerlendirilmeTarihi).toLocaleDateString('tr-TR')
                      : '-'
                    }
                  </TableCell>
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