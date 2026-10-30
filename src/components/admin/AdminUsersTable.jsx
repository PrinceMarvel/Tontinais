/**
 * @file AdminUsersTable.jsx
 * @description Composant modulaire affichant la gestion des utilisateurs et l'attribution des rôles administrateurs.
 * @module components/admin/AdminUsersTable
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  Filter,
  Shield,
  UserCheck,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              fontSize: '0.85rem'
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
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">Tous les rôles</option>
            {AVAILABLE_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              <th style={{ padding: '10px 12px' }}>Utilisateur</th>
              <th style={{ padding: '10px 12px' }}>Contact</th>
              <th style={{ padding: '10px 12px' }}>Rôle Système</th>
              <th style={{ padding: '10px 12px' }}>Inscription</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-secondary)' }}>
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isUpdating = updatingUserId === user._id;

                return (
                  <tr
                    key={user._id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.9rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                        {user.prenom} {user.nom}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        ID: {user._id.slice(-6)}
                      </div>
                    </td>

                    <td style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>
                      <div>{user.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {user.telephone || 'Non renseigné'}
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={user.role}
                          disabled={isUpdating}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg-surface)',
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
                        {user.role === 'SUPER_ADMIN' && <Shield size={14} color="var(--color-accent)" />}
                      </div>
                    </td>

                    <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
