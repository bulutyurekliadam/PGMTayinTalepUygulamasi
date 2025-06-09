import React from 'react';
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
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.primary.main,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(8px)',
        background: 'rgba(25, 118, 210, 0.95)',
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        minHeight: '64px',
        px: { xs: 2, sm: 4 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2
        }}>
          <GavelRounded sx={{ 
            fontSize: '2.5rem',
            color: '#fff',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            transform: 'rotate(-15deg)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(0deg)',
            }
          }} />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Button 
          color="inherit" 
          onClick={handleLogout}
          startIcon={
            <ExitToAppIcon sx={{ 
              fontSize: '1.5rem',
              transition: 'transform 0.2s ease',
            }} />
          }
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              '& .MuiSvgIcon-root': {
                transform: 'translateX(4px)',
              }
            },
            transition: 'all 0.2s ease',
            borderRadius: '12px',
            padding: '8px 20px',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Çıkış Yap
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 