/**
 * @file NotificationBell.jsx
 * @description Composant interactif d'alerte et de centre de notifications en temps réel.
 * @module components/NotificationBell
 */

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=8');
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // Ignorer silencieusement si hors ligne ou session fermée
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Rafraîchissement périodique
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, lu: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          padding: '8px',
          display: 'grid',
          placeItems: 'center'
        }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: 'var(--color-danger)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: '800',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="glass-card animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '16px',
            zIndex: 150,
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '10px',
              marginBottom: '12px'
            }}
          >
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-secondary-light)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Aucune notification pour le moment.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.lu && handleMarkAsRead(n._id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: n.lu ? 'rgba(30, 41, 59, 0.3)' : 'rgba(49, 151, 149, 0.12)',
                    border: n.lu ? '1px solid transparent' : '1px solid rgba(49, 151, 149, 0.3)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                      {n.titre}
                    </div>
                    {!n.lu && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary-light)' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

