import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  SupervisorAccount as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const drawerWidth = 240;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    }
  };

  const userMenuItems = [
    { text: 'Ana Sayfa', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Profilim', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Taleplerim', icon: <DescriptionIcon />, path: '/dashboard/requests' },
    { text: 'Yeni Talep', icon: <AddIcon />, path: '/dashboard/new-request' },
  ];

  const adminMenuItems = [
    { text: 'Yönetim Paneli', icon: <AdminIcon />, path: '/admin' },
    { text: 'Tüm Talepler', icon: <DescriptionIcon />, path: '/admin/requests' },
    { text: 'Profilim', icon: <PersonIcon />, path: '/admin/profile' },
  ];

  const menuItems = user?.isAdmin ? adminMenuItems : userMenuItems;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Adalet Bakanlığı Tayin Sistemi
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Çıkış Yap" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Dashboard; 