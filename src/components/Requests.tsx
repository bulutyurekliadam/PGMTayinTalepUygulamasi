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
import api from '../services/api';
import '../styles/Requests.css';

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
        console.error('Talepler yüklenirken hata oluştu:', error);
      }
    };

    fetchTalepler();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const getDurumChipColor = (durum: string, isOnaylandi: boolean) => {
    if (durum === 'Değerlendirildi') {
      return isOnaylandi ? 'success' : 'error';
    }
    return 'warning';
  };

  return (
    <div className="requests-container">
      <Typography variant="h4" gutterBottom>
        Taleplerim
      </Typography>
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Talep Edilen Adliye</TableCell>
                  <TableCell>Başvuru Tarihi</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Değerlendirme</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {talepler.map((talep) => (
                  <TableRow key={talep.id}>
                    <TableCell>{talep.talepEdilenAdliye}</TableCell>
                    <TableCell>{formatDate(talep.basvuruTarihi)}</TableCell>
                    <TableCell>{talep.aciklama}</TableCell>
                    <TableCell>
                      <Chip 
                        label={talep.talepDurumu}
                        color={getDurumChipColor(talep.talepDurumu, talep.isOnaylandi)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {talep.degerlendirilmeTarihi ? (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(talep.degerlendirilmeTarihi)}
                          </Typography>
                          <Typography variant="body2">
                            {talep.degerlendirmeNotu}
                          </Typography>
                        </>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Requests; 