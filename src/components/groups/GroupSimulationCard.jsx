/**
 * @file GroupSimulationCard.jsx
 * @description Composant modulaire de simulation financière d'une tontine en temps réel.
 * @module components/groups/GroupSimulationCard
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function GroupSimulationCard({
  nombreMaxMembres = 10,
  montantCotisation = 10000,
  devise = 'XAF'
}) {
  const { t } = useTranslation();
  const membresNum = Number(nombreMaxMembres) || 0;
  const montantNum = Number(montantCotisation) || 0;
  const totalCagnotte = membresNum * montantNum;

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(49, 151, 149, 0.1)',
        border: '1px solid rgba(49, 151, 149, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      <div>
        <span
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-primary-light)',
            display: 'block',
            fontWeight: '600'
          }}
        >
          {t('groups.potSimulation')}
        </span>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
          {membresNum} {t('common.members') || 'membres'} × {montantNum.toLocaleString()} {devise}
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
          {t('groups.totalPotLabel')}
        </span>
        <span
          style={{
            fontSize: '1.45rem',
            fontWeight: '800',
            color: 'var(--color-secondary-light)'
          }}
        >
          {totalCagnotte.toLocaleString()} {devise}
        </span>
      </div>
    </div>
  );
}
