/**
 * @file AdminUsersTable.jsx
 * @description Back-Office utilisateurs : suivi temps réel des nouveaux inscrits et attribution des rôles.
 * @module components/admin/AdminUsersTable
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  Filter,
  Shield,
  Phone,
  Mail,
  RefreshCw,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const AVAILABLE_ROLES = [
  { value: 'MEMBRE', label: 'Membre épargnant' },
  { value: 'CHEF_DE_TONTINE', label: 'Chef de tontine' },
  { value: 'MODERATEUR_FINANCIER', label: 'Modérateur financier' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' }
];

export default function AdminUsersTable({ users = [], onUserUpdated }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onUserUpdated) return;
    setIsRefreshing(true);
    await onUserUpdated();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      setErrorMessage('');

      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.success && onUserUpdated) {
        onUserUpdated();
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const now = new Date();
  const isRecent = (dateStr) => dateStr ? ((now - new Date(dateStr)) / 36e5) < 48 : false;

  const recentCount = users.filter((u) => isRecent(u.createdAt)).length;

  const formatDate = (dateStr) => !dateStr ? 'Date inconnue' : new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.nom && u.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.prenom && u.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.telephone && u.telephone.includes(searchTerm));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-danger)',
            fontSize: '0.9rem'
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cartes KPI rapides Back-Office */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(79, 209, 197, 0.15)', display: 'grid', placeItems: 'center', color: 'var(--color-secondary-light)' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('admin.totalRegistered')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{users.length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.18)', display: 'grid', placeItems: 'center', color: 'var(--color-success)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('admin.new48h')}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-success)' }}>+{recentCount}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleRefresh}
            title={t('admin.refresh')}
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{t('admin.refresh')}</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtre */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--color-text-secondary)" />
          <input
            type="text"
            placeholder="Rechercher par nom, e-mail ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              fontSize: '0.88rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--color-text-secondary)" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              fontSize: '0.88rem'
            }}
          >
            <option value="ALL">Tous les rôles ({users.length})</option>
            {AVAILABLE_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label} ({users.filter((u) => u.role === r.value).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs : Cartes mobile & Tableau bureau */}
      <div className="glass-card" style={{ padding: 'clamp(12px, 3vw, 20px)' }}>
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-secondary)' }}>
            <Users size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '0.95rem' }}>{t('admin.noUsersFound')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map((user) => {
              const isUpdating = updatingUserId === user._id;
              const isNew = isRecent(user.createdAt);
              const initials = `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() || 'U';

              return (
                <div
                  key={user._id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isNew ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isNew ? 'rgba(16, 185, 129, 0.35)' : 'var(--color-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  {/* Identité utilisateur */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 'min(100%, 200px)' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isNew
                          ? 'linear-gradient(135deg, var(--color-success), #059669)'
                          : 'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary))',
                        color: '#ffffff',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        flexShrink: 0
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>
                          {user.prenom} {user.nom}
                        </span>
                        {isNew && (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            Nouveau
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Inscrit le {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées de contact */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    {user.telephone && (
                      <a
                        href={`tel:${user.telephone}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary-light)' }}
                        title="Appeler directement"
                      >
                        <Phone size={14} />
                        <span>{user.telephone}</span>
                      </a>
                    )}
                    {user.email && (
                      <a
                        href={`mailto:${user.email}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}
                        title="Envoyer un e-mail"
                      >
                        <Mail size={14} />
                        <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Rôle et actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <select
                      value={user.role}
                      disabled={isUpdating}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-dark)',
                        color: user.role === 'SUPER_ADMIN' ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {AVAILABLE_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    {user.role === 'SUPER_ADMIN' && <Shield size={16} color="var(--color-accent)" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
