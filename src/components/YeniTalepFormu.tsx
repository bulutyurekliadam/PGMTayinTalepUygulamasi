import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const YeniTalepFormu = () => {
  const { user } = useAuth();
  const [talepEdilenAdliye, setTalepEdilenAdliye] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5032/api/tayin/talep-olustur', {
        sicilNo: user?.sicilNo,
        talepEdilenAdliye,
        aciklama
      });

      setSnackbar({
        open: true,
        message: 'Tayin talebiniz başarıyla oluşturuldu.',
        severity: 'success'
      });

      // Form alanlarını temizle
      setTalepEdilenAdliye('');
      setAciklama('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Tayin talebi oluşturulurken bir hata oluştu.',
        severity: 'error'
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Yeni Tayin Talebi Oluştur
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Talep Edilen Adliye"
          value={talepEdilenAdliye}
          onChange={(e) => setTalepEdilenAdliye(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Açıklama"
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          required
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Talebi Oluştur
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default YeniTalepFormu; 