import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
      const response = await api.post('/auth/register', formData);
      console.log('Kayıt başarılı:', response.data);
      navigate('/login');
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      setError(error.response?.data || 'Kayıt sırasında bir hata oluştu');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const adliyeler = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta",
    "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir"
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">
          Kayıt Ol
        </Typography>
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
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/login" variant="body2">
              Zaten hesabınız var mı? Giriş yapın
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 