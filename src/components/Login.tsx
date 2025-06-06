import React from 'react';
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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  sicilNo: yup.string().required('Sicil numarası zorunludur'),
  password: yup.string().required('Şifre zorunludur'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      sicilNo: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.sicilNo, values.password);
        navigate('/');
      } catch (error) {
        alert('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
          <Typography component="h1" variant="h5">
            Personel Giriş
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="sicilNo"
              label="Sicil Numarası"
              name="sicilNo"
              autoComplete="sicilNo"
              autoFocus
              value={formik.values.sicilNo}
              onChange={formik.handleChange}
              error={formik.touched.sicilNo && Boolean(formik.errors.sicilNo)}
              helperText={formik.touched.sicilNo && formik.errors.sicilNo}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
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
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Hesabınız yok mu? Kayıt olun"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 