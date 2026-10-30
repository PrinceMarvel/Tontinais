/**
 * @file GroupContributionsList.jsx
 * @description Composant modulaire affichant la traçabilité des cotisations 100% directes Mobile Money.
 * @module components/groups/GroupContributionsList
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

const OPERATOR_COLORS = {
  ORANGE_MONEY: { label: 'Orange Money', bg: 'rgba(255, 121, 0, 0.15)', border: '#ff7900', color: '#ff9433' },
  MTN_MOMO: { label: 'MTN MoMo', bg: 'rgba(255, 204, 0, 0.15)', border: '#ffcc00', color: '#ffd633' },
  WAVE: { label: 'Wave', bg: 'rgba(29, 196, 255, 0.15)', border: '#1dc4ff', color: '#52d3ff' },
  MOOV: { label: 'Moov', bg: 'rgba(0, 102, 178, 0.15)', border: '#0066b2', color: '#3399ff' }
};

export default function GroupContributionsList({
  contributions = [],
  isChef,
  groupId,
  devise = 'XAF',
  onContributionUpdated
}) {
  const { t } = useTranslation();
  const [filterStatut, setFilterStatut] = useState('ALL');

  const filtered = contributions.filter((c) => {
    if (filterStatut === 'ALL') return true;
    return c.statut === filterStatut;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'PAYE':
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} />
            <span>Payé (Opérateur)</span>
          </span>
        );
      case 'EN_ATTENTE_USSD':
        return (
          <span className="badge badge-warning">
            <Clock size={12} />
            <span>En attente PIN</span>
          </span>
        );
      case 'ECHOUE':
        return (
          <span className="badge badge-danger">
            <AlertCircle size={12} />
            <span>Échec débit</span>
          </span>
        );
      default:
        return <span className="badge badge-info">{statut}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Barre de filtre */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
          <Filter size={16} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Filtrer par statut :</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PAYE', 'EN_ATTENTE_USSD', 'ECHOUE'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatut(st)}
              className={filterStatut === st ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              {st === 'ALL' ? 'Toutes' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des cotisations directes */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <CreditCard size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '0.95rem' }}>Aucune cotisation enregistrée pour ce filtre.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((item) => {
            const opConfig = OPERATOR_COLORS[item.walletProvider] || {
              label: item.walletProvider || 'Mobile Money',
              bg: 'rgba(255, 255, 255, 0.05)',
              border: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            };

            return (
              <div
                key={item._id}
                className="glass-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                {/* Membre et Tour */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(49, 151, 149, 0.2)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: '700',
                      color: 'var(--color-secondary-light)'
                    }}
                  >
                    {item.user?.prenom ? item.user.prenom[0].toUpperCase() : 'M'}
                  </div>

                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                      {item.user?.prenom} {item.user?.nom}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                        Tour n°{item.tourNumber}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {item.datePaiement ? new Date(item.datePaiement).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opérateur Wallet & Référence */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: opConfig.bg,
                      border: `1px solid ${opConfig.border}`,
                      color: opConfig.color
                    }}
                  >
                    <Smartphone size={12} />
                    <span>{opConfig.label} ({item.walletPhone})</span>
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {item.referenceTransaction}
                  </span>
                </div>

                {/* Montant & Statut */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--color-secondary-light)' }}>
                      {item.montant?.toLocaleString()} {devise}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '2px' }}>
                      <ShieldCheck size={13} color="var(--color-secondary-light)" />
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Certifié</span>
                    </div>
                  </div>

                  <div>{getStatusBadge(item.statut)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
