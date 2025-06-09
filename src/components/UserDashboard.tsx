import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import TayinTalepleri from './TayinTalepleri';
import YeniTalepFormu from './YeniTalepFormu';
import DashboardCards from './DashboardCards';

const UserDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid component="div" item xs={12}>
              <DashboardCards />
            </Grid>
            <Grid component="div" item xs={12}>
              <YeniTalepFormu />
            </Grid>
            <Grid component="div" item xs={12}>
              <TayinTalepleri />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserDashboard; 