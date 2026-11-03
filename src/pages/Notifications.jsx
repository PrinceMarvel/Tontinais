/**
 * @file Notifications.jsx
 * @description Page principale du Centre de Notifications et Alertes financières in-app.
 * @module pages/Notifications
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  CheckCheck,
  Coins,
  Trophy,
  Clock,
  UserCheck,
  Info,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api';
import Skeleton from '../components/common/Skeleton';

export default function Notifications() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications?limit=50');
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Erreur chargement notifications :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id, lien) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, lu: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (lien) navigate(lien);
    } catch (err) {
      console.error('Erreur marquage notification :', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur marquage global :', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'PAIEMENT_RECU':
        return <Coins size={20} style={{ color: 'var(--color-success)' }} />;
      case 'TOUR_GAGNE':
        return <Trophy size={20} style={{ color: 'var(--color-accent)' }} />;
      case 'COTISATION_RAPPEL':
        return <Clock size={20} style={{ color: 'var(--color-warning)' }} />;
      case 'ADHESION_VALIDEE':
        return <UserCheck size={20} style={{ color: 'var(--color-secondary-light)' }} />;
      default:
        return <Info size={20} style={{ color: 'var(--color-info)' }} />;
    }
  };

  const filteredNotifications = filter === 'UNREAD'
    ? notifications.filter((n) => !n.lu)
    : notifications;

  return (
    <div style={{ maxWidth: '860px', margin: '32px auto', padding: '0 20px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '36px 32px' }}>
        {/* En-tête de la page */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="stepper-btn"
              title="Retour"
              style={{ width: '40px', height: '40px' }}
            >
              <ArrowLeft size={18} />
            </button>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
                display: 'grid',
                placeItems: 'center',
                color: '#ffffff'
              }}
            >
              <Bell size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.65rem', color: 'var(--color-text-primary)' }}>
                  Centre de Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
                Suivi de vos activités financières, rappels de tours et adhésions
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={actionLoading}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <CheckCheck size={16} />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {/* Barre d'onglets de filtrage */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`chip-btn ${filter === 'ALL' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Toutes ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('UNREAD')}
            className={`chip-btn ${filter === 'UNREAD' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Non lues ({unreadCount})
          </button>
        </div>

        {/* Liste des notifications */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Skeleton height={80} count={4} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(49, 151, 149, 0.12)',
                color: 'var(--color-secondary-light)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Bell size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Aucune notification
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {filter === 'UNREAD'
                ? 'Toutes vos notifications ont été lues avec succès.'
                : 'Vous n\'avez reçu aucune notification pour le moment.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.lu && handleMarkAsRead(n._id, n.lien)}
                className="glass-card"
                style={{
                  padding: '18px 20px',
                  backgroundColor: n.lu ? 'rgba(30, 41, 59, 0.4)' : 'rgba(49, 151, 149, 0.12)',
                  borderColor: n.lu ? 'var(--color-border)' : 'rgba(79, 209, 197, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--color-border)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}
                >
                  {getNotificationIcon(n.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                      {n.titre}
                    </h3>
                    {!n.lu && (
                      <span
                        style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-secondary-light)',
                          boxShadow: '0 0 8px var(--color-secondary-light)',
                          flexShrink: 0
                        }}
                      />
                    )}
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', margin: '6px 0 10px', lineHeight: '1.45' }}>
                    {n.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                    {n.lien && (
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-secondary-light)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: '600'
                        }}
                      >
                        Consulter <ArrowRight size={14} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

