/**
 * @file BottomNav.jsx
 * @description Barre de navigation mobile native pour smartphone (< 768px).
 * Ergonomie tactile épurée sans néon artificiel, fidèle aux standards iOS/Android FinTech.
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
      gap: '3px',
      flex: 1,
      minWidth: 0,
      height: '100%',
      color: active ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
      textDecoration: 'none',
      transition: 'var(--transition-fast)',
      position: 'relative',
      padding: '6px 2px'
    };
  };

  const activeDot = (
    <span
      style={{
        position: 'absolute',
        bottom: '4px',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-secondary-light)'
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
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        zIndex: 90,
        backgroundColor: 'rgba(10, 14, 23, 0.96)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '62px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.45)'
      }}
    >
      {/* 1. Tableau de bord */}
      <Link to="/dashboard" style={navItemStyle('/dashboard')}>
        <LayoutDashboard size={20} strokeWidth={isActive('/dashboard') ? 2.4 : 1.8} />
        <span style={{ fontSize: '0.67rem', fontWeight: isActive('/dashboard') ? 600 : 500, letterSpacing: '0.1px' }}>
          {t('nav.dashboard')}
        </span>
        {isActive('/dashboard') && activeDot}
      </Link>

      {/* 2. Créer une tontine (Chef ou Super Admin) */}
      {(role === 'CHEF_DE_TONTINE' || role === 'SUPER_ADMIN') && (
        <Link to="/groups/create" style={navItemStyle('/groups/create')}>
          <PlusCircle size={20} strokeWidth={isActive('/groups/create') ? 2.4 : 1.8} />
          <span style={{ fontSize: '0.67rem', fontWeight: isActive('/groups/create') ? 600 : 500, letterSpacing: '0.1px' }}>
            {t('nav.createShort')}
          </span>
          {isActive('/groups/create') && activeDot}
        </Link>
      )}

      {/* 3. Rejoindre avec code */}
      <Link to="/groups/join" style={navItemStyle('/groups/join')}>
        <KeyRound size={20} strokeWidth={isActive('/groups/join') ? 2.4 : 1.8} />
        <span style={{ fontSize: '0.67rem', fontWeight: isActive('/groups/join') ? 600 : 500, letterSpacing: '0.1px' }}>
          {t('nav.joinShort')}
        </span>
        {isActive('/groups/join') && activeDot}
      </Link>

      {/* 4. Administration (Super Admin uniquement) */}
      {role === 'SUPER_ADMIN' && (
        <Link to="/admin" style={navItemStyle('/admin')}>
          <ShieldAlert size={20} strokeWidth={isActive('/admin') ? 2.4 : 1.8} color="var(--color-accent)" />
          <span style={{ fontSize: '0.67rem', fontWeight: isActive('/admin') ? 600 : 500, letterSpacing: '0.1px', color: 'var(--color-accent)' }}>
            {t('nav.adminShort')}
          </span>
          {isActive('/admin') && (
            <span style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
          )}
        </Link>
      )}

      {/* 5. Mon Profil */}
      <Link to="/profile" style={navItemStyle('/profile')}>
        <User size={20} strokeWidth={isActive('/profile') ? 2.4 : 1.8} />
        <span style={{ fontSize: '0.67rem', fontWeight: isActive('/profile') ? 600 : 500, letterSpacing: '0.1px' }}>
          {t('nav.profileShort')}
        </span>
        {isActive('/profile') && activeDot}
      </Link>
    </nav>
  );
}
