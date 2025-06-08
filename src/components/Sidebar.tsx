import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Adalet Bakanlığı<br />Tayin Sistemi</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <i className="fas fa-home"></i>
          <span>Ana Sayfa</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <i className="fas fa-user"></i>
          <span>Profilim</span>
        </NavLink>
        <NavLink to="/requests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <i className="fas fa-list"></i>
          <span>Taleplerim</span>
        </NavLink>
        <NavLink to="/new-request" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <i className="fas fa-plus"></i>
          <span>Yeni Talep</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar; 