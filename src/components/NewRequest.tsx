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
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../styles/NewRequest.css';

const adliyeler = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
  "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
  "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta",
  "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir"
];

const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    talepEdilenAdliye: '',
    aciklama: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
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
        navigate('/dashboard/requests');
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

      {/* Kullanıcı Bilgileri */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personel Bilgileri
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Ad Soyad</Typography>
              <Typography variant="body1">{user?.ad} {user?.soyad}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Sicil Numarası</Typography>
              <Typography variant="body1">{user?.sicilNo}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Unvan</Typography>
              <Typography variant="body1">{user?.unvan}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Mevcut Adliye</Typography>
              <Typography variant="body1">{user?.mevcutAdliye}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

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

              <FormControl fullWidth required>
                <InputLabel id="talepEdilenAdliye-label">Talep Edilen Adliye</InputLabel>
                <Select
                  labelId="talepEdilenAdliye-label"
                  name="talepEdilenAdliye"
                  value={formData.talepEdilenAdliye}
                  onChange={handleChange}
                  label="Talep Edilen Adliye"
                >
                  {adliyeler.map((adliye) => (
                    <MenuItem key={adliye} value={adliye}>
                      {adliye}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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