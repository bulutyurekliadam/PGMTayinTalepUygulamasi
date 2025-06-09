import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
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
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid component="div" item xs={12} sm={6} md={3} key={card.title}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: card.color,
              minHeight: 120
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                {card.title}
              </Typography>
              <Typography variant="h4" component="div">
                {card.value}
              </Typography>
            </Box>
            <Box sx={{ ml: 2 }}>{card.icon}</Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards; 