import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, Typography, Box } from '@mui/material';
import '../styles/Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();

  const calculateServiceTime = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    
    let totalMonths = years * 12 + months;
    const finalYears = Math.floor(totalMonths / 12);
    const finalMonths = totalMonths % 12;

    return `${finalYears} yıl ${finalMonths} ay`;
  };

  return (
    <div className="profile-container">
      <Typography variant="h4" gutterBottom>
        Profilim
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" color="textSecondary">
                Sicil Numarası
              </Typography>
              <Typography variant="h6">{user?.sicilNo}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" color="textSecondary">
                Ad Soyad
              </Typography>
              <Typography variant="h6">{user?.ad} {user?.soyad}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" color="textSecondary">
                Unvan
              </Typography>
              <Typography variant="h6">{user?.unvan}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" color="textSecondary">
                Bağlı Bulunduğu Adliye
              </Typography>
              <Typography variant="h6">{user?.mevcutAdliye}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" color="textSecondary">
                Hizmet Süresi
              </Typography>
              <Typography variant="h6">
                {user?.iseBaslamaTarihi ? calculateServiceTime(user.iseBaslamaTarihi) : '-'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 