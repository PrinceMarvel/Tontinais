/**
 * @file NotificationBell.jsx
 * @description Bouton d'alerte cloche avec compteur dynamique redirigeant vers le Centre de Notifications.
 * @module components/NotificationBell
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import api from '../services/api';

export default function NotificationBell() {
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications?limit=1');
      if (res.success) {
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // Ignorer silencieusement si déconnecté ou hors ligne
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const isCurrentPage = location.pathname === '/notifications';

  return (
    <Link
      to="/notifications"
      style={{
        position: 'relative',
        background: isCurrentPage ? 'rgba(79, 209, 197, 0.15)' : 'transparent',
        border: isCurrentPage ? '1px solid var(--color-secondary-light)' : '1px solid transparent',
        borderRadius: 'var(--radius-sm)',
        color: isCurrentPage ? 'var(--color-secondary-light)' : 'var(--color-text-primary)',
        cursor: 'pointer',
        padding: '8px',
        display: 'grid',
        placeItems: 'center',
        textDecoration: 'none',
        transition: 'var(--transition-fast)'
      }}
      title={t('nav.notifications')}
      aria-label={t('nav.notifications')}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: 'var(--color-danger)',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: '800',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
