import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme } from '@mui/material';
import { GavelRounded, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        mb: 3,
        backgroundColor: theme.palette.primary.main,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GavelRounded sx={{ 
            mr: 2, 
            fontSize: '2rem',
            color: theme.palette.primary.contrastText 
          }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.contrastText
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Button 
          color="inherit" 
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 500
          }}
        >
          Çıkış Yap
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 