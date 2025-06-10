import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  sicilNo: yup
    .string()
    .required('Sicil numarası gereklidir'),
  password: yup.string().required('Şifre gereklidir'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      sicilNo: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const isAdmin = await login(values.sicilNo, values.password);
        navigate(isAdmin ? '/admin' : '/dashboard');
      } catch (error: any) {
        setError(error.response?.data || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <GavelIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography component="h1" variant="h5">
              Personel Giriş
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="sicilNo"
              name="sicilNo"
              label="Sicil No"
              value={formik.values.sicilNo}
              onChange={formik.handleChange}
              error={formik.touched.sicilNo && Boolean(formik.errors.sicilNo)}
              helperText={formik.touched.sicilNo && formik.errors.sicilNo}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Şifre"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Giriş Yap
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Hesabınız yok mu? Kayıt olun
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 