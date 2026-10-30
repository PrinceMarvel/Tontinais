/**
 * @file AdminDashboard.jsx
 * @description Tableau de bord d'administration centrale, KPIs système et supervision des utilisateurs et tontines.
 * @module pages/AdminDashboard
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  Users,
  Building,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import AdminGroupsTable from '../components/admin/AdminGroupsTable';

export default function AdminDashboard() {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalUtilisateurs: 0,
    totalGroupes: 0,
    totalCotisations: 0,
    cotisationsEnAttente: 0,
    totalPayoutsDistribues: 0
  });

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const [statsRes, usersRes, groupsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/groups')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (groupsRes.success) setGroups(groupsRes.groups || []);
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return (
    <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 20px' }}>
      {/* En-tête de la page */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff'
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-primary)' }}>
              Administration Centrale
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Supervision de la plateforme, gestion des rôles et contrôle des flux financiers.
            </p>
          </div>
        </div>
      </div>

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
            marginBottom: '20px'
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cartes KPI Globales */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--color-info)'
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Utilisateurs</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {stats.totalUtilisateurs}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(49, 151, 149, 0.15)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--color-secondary-light)'
              }}
            >
              <Building size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tontines créées</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {stats.totalGroupes}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--color-success)'
              }}
            >
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cotisations réglées</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {stats.totalCotisations}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--color-warning)'
              }}
            >
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>En attente de validation</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-warning)' }}>
                {stats.cotisationsEnAttente}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: activeTab === 'users' ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'users' ? '2px solid var(--color-secondary-light)' : '2px solid transparent'
          }}
        >
          <Users size={18} />
          <span>Gestion des Utilisateurs ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('groups')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: activeTab === 'groups' ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
            borderBottom: activeTab === 'groups' ? '2px solid var(--color-secondary-light)' : '2px solid transparent'
          }}
        >
          <Building size={18} />
          <span>Supervision des Tontines ({groups.length})</span>
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          {t('common.loading')}
        </div>
      ) : activeTab === 'users' ? (
        <AdminUsersTable users={users} onUserUpdated={fetchAdminData} />
      ) : (
        <AdminGroupsTable groups={groups} />
      )}
    </div>
  );
}
