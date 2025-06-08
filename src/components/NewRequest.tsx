import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../services/api';
import '../styles/NewRequest.css';

const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    talepEdilenAdliye: '',
    aciklama: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/tayin', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/taleplerim');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Talep oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-request-container">
      <Typography variant="h4" gutterBottom>
        Yeni Tayin Talebi
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success">
                  Tayin talebiniz başarıyla oluşturuldu. Taleplerim sayfasına yönlendiriliyorsunuz...
                </Alert>
              )}

              <TextField
                label="Talep Edilen Adliye"
                name="talepEdilenAdliye"
                value={formData.talepEdilenAdliye}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Açıklama"
                name="aciklama"
                value={formData.aciklama}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={4}
                helperText="Tayin talebinizin gerekçesini detaylı bir şekilde açıklayınız."
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Talebi Oluştur'
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRequest; 