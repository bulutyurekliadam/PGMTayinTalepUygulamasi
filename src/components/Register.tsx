import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  MenuItem,
  styled,
  Alert,
  Grid
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import api from '../services/api';

const StyledGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: 'repeat(12, 1fr)',
}));

const GridItem = styled('div')<{ sm?: number }>(({ theme, sm }) => ({
  gridColumn: 'span 12',
  [theme.breakpoints.up('sm')]: {
    gridColumn: sm ? `span ${sm}` : 'span 12',
  },
}));

interface RegisterFormData {
  sicilNo: string;
  password: string;
  ad: string;
  soyad: string;
  unvan: string;
  mevcutAdliye: string;
  iseBaslamaTarihi: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<RegisterFormData>({
    sicilNo: '',
    password: '',
    ad: '',
    soyad: '',
    unvan: '',
    mevcutAdliye: '',
    iseBaslamaTarihi: ''
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // IseBaslamaTarihi'ni ISO formatına çevir
      const formattedData = {
        ...formData,
        iseBaslamaTarihi: new Date(formData.iseBaslamaTarihi).toISOString()
      };
      
      const response = await api.post('/auth/register', formattedData);
      console.log('Kayıt başarılı:', response.data);
      navigate('/login');
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      if (error.response?.data?.errors) {
        // Validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else if (error.response?.data) {
        // Single error message
        setError(typeof error.response.data === 'string' ? error.response.data : 'Kayıt sırasında bir hata oluştu');
      } else {
        setError('Kayıt sırasında bir hata oluştu');
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const adliyeler = [
    "Adana Adliyesi", "Adıyaman Adliyesi", "Afyonkarahisar Adliyesi", "Ağrı Adliyesi", "Amasya Adliyesi", "Ankara Adliyesi", "Antalya Adliyesi", "Artvin Adliyesi",
    "Aydın Adliyesi", "Balıkesir Adliyesi", "Bilecik Adliyesi", "Bingöl Adliyesi", "Bitlis Adliyesi", "Bolu Adliyesi", "Burdur Adliyesi", "Bursa Adliyesi",
    "Çanakkale Adliyesi", "Çankırı Adliyesi", "Çorum Adliyesi", "Denizli Adliyesi", "Diyarbakır Adliyesi", "Edirne Adliyesi", "Elazığ Adliyesi", "Erzincan Adliyesi",
    "Erzurum Adliyesi", "Eskişehir Adliyesi", "Gaziantep Adliyesi", "Giresun Adliyesi", "Gümüşhane Adliyesi", "Hakkari Adliyesi", "Hatay Adliyesi", "Isparta Adliyesi",
    "Mersin Adliyesi", "İstanbul Adliyesi", "İzmir Adliyesi", "Kars Adliyesi", "Kastamonu Adliyesi", "Kayseri Adliyesi", "Kırklareli Adliyesi", "Kırşehir Adliyesi",
    "Kocaeli Adliyesi", "Konya Adliyesi", "Kütahya Adliyesi", "Malatya Adliyesi", "Manisa Adliyesi", "Kahramanmaraş Adliyesi", "Mardin Adliyesi", "Muğla Adliyesi",
    "Muş Adliyesi", "Nevşehir Adliyesi", "Niğde Adliyesi", "Ordu Adliyesi", "Rize Adliyesi", "Sakarya Adliyesi", "Samsun Adliyesi", "Siirt Adliyesi",
    "Sinop Adliyesi", "Sivas Adliyesi", "Tekirdağ Adliyesi", "Tokat Adliyesi", "Trabzon Adliyesi", "Tunceli Adliyesi", "Şanlıurfa Adliyesi", "Uşak Adliyesi",
    "Van Adliyesi", "Yozgat Adliyesi", "Zonguldak Adliyesi", "Aksaray Adliyesi", "Bayburt Adliyesi", "Karaman Adliyesi", "Kırıkkale Adliyesi", "Batman Adliyesi",
    "Şırnak Adliyesi", "Bartın Adliyesi", "Ardahan Adliyesi", "Iğdır Adliyesi", "Yalova Adliyesi", "Karabük Adliyesi", "Kilis Adliyesi", "Osmaniye Adliyesi",
    "Düzce Adliyesi"
  ];

  const unvanlar = [
    "Zabıt Katibi",
    "Yazı İşleri Müdürü",
    "Mübaşir",
    "İcra Katibi",
    "İcra Müdürü",
    "İcra Müdür Yardımcısı",
    "Sosyal Çalışmacı",
    "Psikolog",
    "Tercüman",
    "Bilgi İşlem Personeli",
    "Teknisyen",
    "Şoför",
    "Hizmetli"
  ];

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <GavelIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography component="h1" variant="h5">
            Kullanıcı Kaydı
          </Typography>
        </Box>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <StyledGrid>
            <GridItem>
              <TextField
                required
                fullWidth
                id="sicilNo"
                label="Sicil No"
                name="sicilNo"
                autoComplete="sicilNo"
                value={formData.sicilNo}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem>
              <TextField
                required
                fullWidth
                name="password"
                label="Şifre"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem sm={6}>
              <TextField
                required
                fullWidth
                id="ad"
                label="Ad"
                name="ad"
                autoComplete="given-name"
                value={formData.ad}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem sm={6}>
              <TextField
                required
                fullWidth
                id="soyad"
                label="Soyad"
                name="soyad"
                autoComplete="family-name"
                value={formData.soyad}
                onChange={handleChange}
              />
            </GridItem>
            <GridItem>
              <TextField
                select
                required
                fullWidth
                id="unvan"
                label="Ünvan"
                name="unvan"
                value={formData.unvan}
                onChange={handleChange}
              >
                {unvanlar.map((unvan) => (
                  <MenuItem key={unvan} value={unvan}>
                    {unvan}
                  </MenuItem>
                ))}
              </TextField>
            </GridItem>
            <GridItem>
              <TextField
                select
                required
                fullWidth
                id="mevcutAdliye"
                label="Mevcut Adliye"
                name="mevcutAdliye"
                value={formData.mevcutAdliye}
                onChange={handleChange}
              >
                {adliyeler.map((adliye) => (
                  <MenuItem key={adliye} value={adliye}>
                    {adliye}
                  </MenuItem>
                ))}
              </TextField>
            </GridItem>
            <GridItem>
              <TextField
                required
                fullWidth
                id="iseBaslamaTarihi"
                label="İşe Başlama Tarihi"
                name="iseBaslamaTarihi"
                type="date"
                value={formData.iseBaslamaTarihi}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </GridItem>
            <GridItem>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Kayıt Ol
              </Button>
            </GridItem>
          </StyledGrid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/login" variant="body2">
              Zaten hesabınız var mı? Giriş yapın
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 