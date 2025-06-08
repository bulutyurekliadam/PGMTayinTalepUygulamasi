import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Profile from './components/Profile';
import Requests from './components/Requests';
import NewRequest from './components/NewRequest';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route bileşeni
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin Route bileşeni
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard>
                  <Home />
                </Dashboard>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <Dashboard>
                  <Profile />
                </Dashboard>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/requests" element={
              <ProtectedRoute>
                <Dashboard>
                  <Requests />
                </Dashboard>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/new-request" element={
              <ProtectedRoute>
                <Dashboard>
                  <NewRequest />
                </Dashboard>
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute>
                <Dashboard>
                  <Home />
                </Dashboard>
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
