/**
 * @file GroupMembersList.jsx
 * @description Composant modulaire affichant la liste des participants et la validation d'adhésion en un clic.
 * @module components/groups/GroupMembersList
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

export default function GroupMembersList({ members, isChef, groupId, onMemberUpdated }) {
  const { t } = useTranslation();
  const [processingId, setProcessingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleValidation = async (membershipId, action) => {
    try {
      setProcessingId(membershipId);
      setErrorMessage('');

      const res = await api.put(`/groups/${groupId}/members/${membershipId}/validate`, {
        action
      });

      if (res.success && onMemberUpdated) {
        onMemberUpdated();
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setProcessingId(null);
    }
  };

  const activeMembers = members.filter((m) => m.statut === 'ACTIF');
  const pendingMembers = members.filter((m) => m.statut === 'EN_ATTENTE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
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

      {/* Demandes en attente (visibles pour le Chef de Tontine) */}
      {isChef && pendingMembers.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: '20px',
            border: '1px solid var(--color-warning)',
            backgroundColor: 'rgba(245, 158, 11, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Clock size={20} color="var(--color-warning)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
              Demandes d&apos;adhésion en attente ({pendingMembers.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingMembers.map((membership) => {
              const u = membership.user || {};
              const isBusy = processingId === membership._id;

              return (
                <div
                  key={membership._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {u.prenom} {u.nom}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      {u.telephone && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {u.telephone}
                        </span>
                      )}
                      {u.email && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {u.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={isBusy}
                      onClick={() => handleValidation(membership._id, 'APPROUVER')}
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    >
                      <UserCheck size={14} />
                      <span>{t('common.validate')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled={isBusy}
                      onClick={() => handleValidation(membership._id, 'REJETER')}
                      style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--color-danger)' }}
                    >
                      <UserX size={14} />
                      <span>{t('common.reject')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des participants actifs */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--color-secondary-light)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>
              Participants actifs ({activeMembers.length})
            </h3>
          </div>
        </div>

        {activeMembers.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
            Aucun membre actif dans cette tontine pour l&apos;instant.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {activeMembers.map((membership) => {
              const u = membership.user || {};
              const isChefMember = membership.roleDansGroupe === 'CHEF_DE_TONTINE';

              return (
                <div
                  key={membership._id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                        {u.prenom} {u.nom}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {u.telephone || u.email}
                      </div>
                    </div>

                    {isChefMember ? (
                      <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                        <Shield size={12} />
                        <span>Chef</span>
                      </span>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        Actif
                      </span>
                    )}
                  </div>

                  {membership.rangTour > 0 && (
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg-hover)',
                        fontSize: '0.8rem',
                        color: 'var(--color-secondary-light)',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{t('dashboard.myTurn')} :</span>
                      <strong>Tour n°{membership.rangTour}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
