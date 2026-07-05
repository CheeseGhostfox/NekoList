import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserPlus, ScanLine, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();
  return (
    <div className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        end
      >
        <Users size={24} />
        <span>{t('contacts')}</span>
      </NavLink>
      <NavLink 
        to="/add" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <UserPlus size={24} />
        <span>{t('add')}</span>
      </NavLink>
      <NavLink 
        to="/scan" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <ScanLine size={24} />
        <span>{t('scan')}</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <UserCircle size={24} />
        <span>{t('profile')}</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
