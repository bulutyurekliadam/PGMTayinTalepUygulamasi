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
  Grid,
  ContainerProps
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import api from '../services/api';
import { GavelRounded } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tr } from 'date-fns/locale';

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

interface FormValues {
  sicilNo: string;
  password: string;
  ad: string;
  soyad: string;
  unvan: string;
  mevcutAdliye: string;
  iseBaslamaTarihi: Date | null;
}

const validationSchema = yup.object({
  sicilNo: yup
    .string()
    .required('Sicil no zorunludur'),
  password: yup
    .string()
    .required('Şifre zorunludur')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter (@$!%*?&) içermelidir'
    ),
  ad: yup.string().required('Ad zorunludur'),
  soyad: yup.string().required('Soyad zorunludur'),
  unvan: yup.string().required('Ünvan zorunludur'),
  mevcutAdliye: yup.string().required('Mevcut adliye zorunludur'),
  iseBaslamaTarihi: yup.date().nullable().required('İşe başlama tarihi zorunludur'),
});

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const formik = useFormik<FormValues>({
    initialValues: {
      sicilNo: '',
      password: '',
      ad: '',
      soyad: '',
      unvan: '',
      mevcutAdliye: '',
      iseBaslamaTarihi: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formattedData = {
          ...values,
          iseBaslamaTarihi: values.iseBaslamaTarihi ? values.iseBaslamaTarihi.toISOString() : null
        };
        
        const response = await api.post('/auth/register', formattedData);
        console.log('Kayıt başarılı:', response.data);
        navigate('/login');
      } catch (error: any) {
        console.error('Kayıt hatası:', error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError('Kayıt sırasında bir hata oluştu');
        }
      }
    },
  });

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
    <StyledContainer component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <GavelRounded />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Kayıt Ol
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <StyledGrid>
            <GridItem>
              <TextField
                required
                fullWidth
                id="sicilNo"
                label="Sicil No"
                name="sicilNo"
                autoComplete="sicilNo"
                value={formik.values.sicilNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sicilNo && Boolean(formik.errors.sicilNo)}
                helperText={formik.touched.sicilNo && formik.errors.sicilNo}
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
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={
                  (formik.touched.password && formik.errors.password) ||
                  'Şifre en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter (@$!%*?&) içermelidir'
                }
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
                value={formik.values.ad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ad && Boolean(formik.errors.ad)}
                helperText={formik.touched.ad && formik.errors.ad}
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
                value={formik.values.soyad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.soyad && Boolean(formik.errors.soyad)}
                helperText={formik.touched.soyad && formik.errors.soyad}
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
                value={formik.values.unvan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.unvan && Boolean(formik.errors.unvan)}
                helperText={formik.touched.unvan && formik.errors.unvan}
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
                value={formik.values.mevcutAdliye}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mevcutAdliye && Boolean(formik.errors.mevcutAdliye)}
                helperText={formik.touched.mevcutAdliye && formik.errors.mevcutAdliye}
              >
                {adliyeler.map((adliye) => (
                  <MenuItem key={adliye} value={adliye}>
                    {adliye}
                  </MenuItem>
                ))}
              </TextField>
            </GridItem>
            <GridItem>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                <DatePicker
                  label="İşe Başlama Tarihi"
                  value={formik.values.iseBaslamaTarihi}
                  onChange={(newValue: Date | null) => {
                    formik.setFieldValue('iseBaslamaTarihi', newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: formik.touched.iseBaslamaTarihi && Boolean(formik.errors.iseBaslamaTarihi),
                      helperText: formik.touched.iseBaslamaTarihi && formik.errors.iseBaslamaTarihi?.toString()
                    }
                  }}
                />
              </LocalizationProvider>
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
    </StyledContainer>
  );
} 