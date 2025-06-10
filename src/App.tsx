import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AdminDashboard from './components/AdminDashboard';
import AllRequests from './components/AllRequests';

// Protected Route bileşeni
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Route bileşeni
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.isAdmin) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
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
            
            {/* Normal kullanıcı rotaları */}
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

            {/* Admin rotaları */}
            <Route path="/admin" element={
              <AdminRoute>
                <Dashboard>
                  <AdminDashboard />
                </Dashboard>
              </AdminRoute>
            } />
            <Route path="/admin/requests" element={
              <AdminRoute>
                <Dashboard>
                  <AllRequests />
                </Dashboard>
              </AdminRoute>
            } />
            <Route path="/admin/profile" element={
              <AdminRoute>
                <Dashboard>
                  <Profile />
                </Dashboard>
              </AdminRoute>
            } />

            {/* Varsayılan yönlendirme */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
