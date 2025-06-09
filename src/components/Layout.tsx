import React from 'react';
import { Container } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container maxWidth={false} sx={{
      padding: {
        xs: 1,  // extra-small devices
        sm: 2,  // small devices
        md: 3,  // medium devices
        lg: 4   // large devices
      }
    }}>
      {children}
    </Container>
  );
};

export default Layout; 