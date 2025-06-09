import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const DashboardCards = () => {
  const cards = [
    {
      title: 'Toplam Talepler',
      value: '12',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      color: '#e3f2fd'
    },
    {
      title: 'Onaylanan Talepler',
      value: '5',
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#e8f5e9'
    },
    {
      title: 'Bekleyen Talepler',
      value: '4',
      icon: <PendingIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
      color: '#fff3e0'
    },
    {
      title: 'Reddedilen Talepler',
      value: '3',
      icon: <CloseIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#ffebee'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {cards.map((card) => (
          <Paper
            key={card.title}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: card.color,
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            {card.icon}
            <Typography variant="h6" component="div" sx={{ mt: 2 }}>
              {card.title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 1 }}>
              {card.value}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardCards; 