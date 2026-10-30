/**
 * @file Navbar.jsx
 * @description Barre de navigation responsive avec logo officiel TontiNaïs, alertes et gestion des rôles.
 * @module components/Navbar
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  PlusCircle,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';
import Logo from './Logo';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const roleLabel =
    role === 'SUPER_ADMIN'
      ? 'Super Admin'
      : role === 'CHEF_DE_TONTINE'
      ? t('auth.roleLeader')
      : t('auth.roleMember');

  const navLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: isActive(path) ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
    textDecoration: 'none'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 20px'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo & Branding Officiel */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          style={{ textDecoration: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Logo size={36} showText={true} />
        </Link>

        {/* Navigation Bureau */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '20px' }} className="desktop-nav">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                <LayoutDashboard size={16} />
                <span>{t('nav.dashboard')}</span>
              </Link>

              {(role === 'CHEF_DE_TONTINE' || role === 'SUPER_ADMIN') && (
                <Link to="/groups/create" style={navLinkStyle('/groups/create')}>
                  <PlusCircle size={16} />
                  <span>{t('nav.createGroup')}</span>
                </Link>
              )}

              <Link to="/groups/join" style={navLinkStyle('/groups/join')}>
                <KeyRound size={16} />
                <span>{t('nav.joinGroup')}</span>
              </Link>

              {role === 'SUPER_ADMIN' && (
                <Link to="/admin" style={navLinkStyle('/admin')}>
                  <ShieldAlert size={16} color="var(--color-accent)" />
                  <span style={{ color: 'var(--color-accent)' }}>Administration</span>
                </Link>
              )}
            </>
          ) : (
            <Link to="/" style={navLinkStyle('/')}>
              {t('nav.home')}
            </Link>
          )}
        </nav>

        {/* Profil et actions utilisateur */}
        <div style={{ display: 'none', alignItems: 'center', gap: '14px' }} className="desktop-actions">
          <LanguageSelector />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <NotificationBell />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                  {user?.prenom} {user?.nom}
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '1px 6px', marginTop: '2px' }}>
                  {roleLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                title={t('nav.logout')}
              >
                <LogOut size={15} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <LogIn size={15} />
                <span>{t('nav.login')}</span>
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <UserPlus size={15} />
                <span>{t('nav.register')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Bouton Hamburger pour mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mobile-toggle">
          {isAuthenticated && <NotificationBell />}
          <LanguageSelector />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '6px' }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu déroulant Mobile */}
      {mobileMenuOpen && (
        <div
          className="glass-card animate-fade-in"
          style={{
            margin: '0 -20px',
            padding: '16px 20px',
            borderTop: '1px solid var(--color-border)',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {isAuthenticated ? (
            <>
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.prenom} {user?.nom}</div>
                <div className="badge badge-info" style={{ marginTop: '4px' }}>{roleLabel}</div>
              </div>

              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle('/dashboard')}>
                <LayoutDashboard size={18} />
                <span>{t('nav.dashboard')}</span>
              </Link>

              {(role === 'CHEF_DE_TONTINE' || role === 'SUPER_ADMIN') && (
                <Link to="/groups/create" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle('/groups/create')}>
                  <PlusCircle size={18} />
                  <span>{t('nav.createGroup')}</span>
                </Link>
              )}

              <Link to="/groups/join" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle('/groups/join')}>
                <KeyRound size={18} />
                <span>{t('nav.joinGroup')}</span>
              </Link>

              {role === 'SUPER_ADMIN' && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle('/admin')}>
                  <ShieldAlert size={18} color="var(--color-accent)" />
                  <span style={{ color: 'var(--color-accent)' }}>Administration</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '8px' }}
              >
                <LogOut size={16} />
                <span>{t('nav.logout')}</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline">
                <LogIn size={16} />
                <span>{t('nav.login')}</span>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                <UserPlus size={16} />
                <span>{t('nav.register')}</span>
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
