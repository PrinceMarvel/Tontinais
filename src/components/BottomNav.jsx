/**
 * @file BottomNav.jsx
 * @description Barre de navigation inférieure mobile (Bottom Navigation Bar) pour une navigation fluide au pouce.
 * Active uniquement sur smartphone et tablette (< 768px) pour les utilisateurs authentifiés.
 * @module components/BottomNav
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  PlusCircle,
  KeyRound,
  User,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { t } = useTranslation();
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  const navItemStyle = (path) => {
    const active = isActive(path);
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      flex: 1,
      height: '100%',
      color: active ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
      textDecoration: 'none',
      transition: 'var(--transition-fast)',
      position: 'relative',
      padding: '6px 0'
    };
  };

  const activeIndicator = (
    <span
      style={{
        position: 'absolute',
        top: '2px',
        width: '24px',
        height: '3px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-secondary-light)',
        boxShadow: '0 0 8px var(--color-secondary-light)'
      }}
    />
  );

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Navigation mobile"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* 1. Tableau de bord */}
      <Link to="/dashboard" style={navItemStyle('/dashboard')}>
        {isActive('/dashboard') && activeIndicator}
        <LayoutDashboard size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: isActive('/dashboard') ? 700 : 500 }}>
          {t('nav.dashboard')}
        </span>
      </Link>

      {/* 2. Créer une tontine (Chef ou Super Admin) */}
      {(role === 'CHEF_DE_TONTINE' || role === 'SUPER_ADMIN') && (
        <Link to="/groups/create" style={navItemStyle('/groups/create')}>
          {isActive('/groups/create') && activeIndicator}
          <PlusCircle size={20} />
          <span style={{ fontSize: '0.72rem', fontWeight: isActive('/groups/create') ? 700 : 500 }}>
            Créer
          </span>
        </Link>
      )}

      {/* 3. Rejoindre avec code */}
      <Link to="/groups/join" style={navItemStyle('/groups/join')}>
        {isActive('/groups/join') && activeIndicator}
        <KeyRound size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: isActive('/groups/join') ? 700 : 500 }}>
          Rejoindre
        </span>
      </Link>

      {/* 4. Administration (Super Admin uniquement) */}
      {role === 'SUPER_ADMIN' && (
        <Link to="/admin" style={navItemStyle('/admin')}>
          {isActive('/admin') && activeIndicator}
          <ShieldAlert size={20} color="var(--color-accent)" />
          <span style={{ fontSize: '0.72rem', fontWeight: isActive('/admin') ? 700 : 500, color: 'var(--color-accent)' }}>
            Admin
          </span>
        </Link>
      )}

      {/* 5. Mon Profil */}
      <Link to="/profile" style={navItemStyle('/profile')}>
        {isActive('/profile') && activeIndicator}
        <User size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: isActive('/profile') ? 700 : 500 }}>
          Profil
        </span>
      </Link>
    </nav>
  );
}

