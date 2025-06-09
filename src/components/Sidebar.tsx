import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';
import { ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Ana Sayfa', path: '/dashboard' },
    { text: 'Profilim', path: '/profile' },
    { text: 'Taleplerim', path: '/requests' },
    { text: 'Yeni Talep', path: '/new-request' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Adalet Bakanlığı<br />Tayin Sistemi</h3>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <ListItem
            component="div"
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            <NavLink to={item.path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <i className="fas fa-home"></i>
              <span>{item.text}</span>
            </NavLink>
          </ListItem>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 