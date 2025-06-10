import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Divider,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 3, color: 'primary.main' }}>
                Profil Bilgileri
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Ad
                    </Typography>
                    <Typography variant="body1">
                      {user.ad}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Soyad
                    </Typography>
                    <Typography variant="body1">
                      {user.soyad}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Sicil Numarası
                  </Typography>
                  <Typography variant="body1">
                    {user.sicilNo}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Unvan
                  </Typography>
                  <Typography variant="body1">
                    {user.unvan}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Mevcut Adliye
                  </Typography>
                  <Typography variant="body1">
                    {user.mevcutAdliye}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 