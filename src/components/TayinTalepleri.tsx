// Gerekli React ve Material-UI bileşenlerinin import edilmesi
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

// Tayin talebi için TypeScript interface tanımı
interface TayinTalebi {
  id: number;                               // Talep ID'si
  talepEdilenAdliye: string;               // Talep edilen adliye bilgisi
  basvuruTarihi: string;                   // Başvuru tarihi
  aciklama: string;                        // Talep açıklaması
  talepDurumu: string;                     // Talebin durumu (Beklemede, Değerlendirildi vb.)
  degerlendirilmeTarihi: string | null;    // Değerlendirilme tarihi (varsa)
  degerlendirmeNotu: string | null;        // Değerlendirme notu (varsa)
  isOnaylandi: boolean;                    // Talebin onaylanma durumu
}

// Tarih formatlamak için yardımcı fonksiyon
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    // Tarihi gün, ay, yıl formatında döndürür (örn: 2 Haziran 2025)
    date: date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    // Saati saat:dakika formatında döndürür (örn: 14:30)
    time: date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

// Tayin Talepleri ana bileşeni
const TayinTalepleri = () => {
  // State tanımlamaları
  const [talepler, setTalepler] = useState<TayinTalebi[]>([]); // Tayin taleplerini tutan state
  const { user } = useAuth(); // Kullanıcı bilgilerini AuthContext'ten alma

  // Tayin taleplerini API'den çekme
  useEffect(() => {
    const fetchTalepler = async () => {
      try {
        const response = await axios.get(`http://localhost:5032/api/tayin/taleplerim/${user?.sicilNo}`);
        setTalepler(response.data);
      } catch (error) {
        console.error('Talepler yüklenirken hata oluştu:', error);
      }
    };

    // Kullanıcı sicil no varsa talepleri getir
    if (user?.sicilNo) {
      fetchTalepler();
    }
  }, [user?.sicilNo]); // Sicil no değiştiğinde useEffect tekrar çalışır

  // Talebin durumuna göre chip rengi belirleme
  const getDurumRengi = (durum: string, isOnaylandi: boolean) => {
    if (durum === 'Değerlendirildi') {
      return isOnaylandi ? 'success' : 'error'; // Onaylandıysa yeşil, reddedildiyse kırmızı
    }
    return 'warning'; // Beklemedeyse sarı
  };

  // Bileşen render'ı
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Tayin Taleplerim
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          {/* Tablo başlıkları */}
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
          {/* Tablo içeriği */}
          <TableBody>
            {talepler.map((talep) => {
              // Başvuru ve değerlendirme tarihlerini formatlama
              const basvuruTarih = formatDate(talep.basvuruTarihi);
              const degerlendirilmeTarih = talep.degerlendirilmeTarihi ? formatDate(talep.degerlendirilmeTarihi) : null;
              
              return (
                <TableRow key={talep.id}>
                  <TableCell>#{talep.id}</TableCell>
                  <TableCell>
                    {/* Durumu gösteren chip bileşeni */}
                    <Chip
                      label={talep.talepDurumu}
                      color={getDurumRengi(talep.talepDurumu, talep.isOnaylandi)}
                    />
                  </TableCell>
                  <TableCell>{user?.ad} {user?.soyad}</TableCell>
                  <TableCell>{user?.mevcutAdliye}</TableCell>
                  <TableCell>{talep.talepEdilenAdliye}</TableCell>
                  {/* Başvuru tarihi ve saati */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{basvuruTarih.date}</Typography>
                      <Typography variant="caption" color="textSecondary">{basvuruTarih.time}</Typography>
                    </Box>
                  </TableCell>
                  {/* Değerlendirme tarihi ve saati (varsa) */}
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