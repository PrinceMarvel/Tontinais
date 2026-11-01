/**
 * @file GroupSimulationCard.jsx
 * @description Composant modulaire de simulation financière d'une tontine en temps réel.
 * @module components/groups/GroupSimulationCard
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Calendar, ShieldCheck } from 'lucide-react';

export default function GroupSimulationCard({
  nombreMaxMembres = 10,
  montantCotisation = 10000,
  devise = 'XAF',
  frequence = 'MENSUEL'
}) {
  const { t } = useTranslation();
  const membresNum = Number(nombreMaxMembres) || 0;
  const montantNum = Number(montantCotisation) || 0;
  const totalCagnotte = membresNum * montantNum;

  const frequenceMap = {
    MENSUEL: t('groups.frequencyMonthly'),
    BI_MENSUEL: t('groups.frequencyBiweekly'),
    HEBDOMADAIRE: t('groups.frequencyWeekly')
  };
  const frequenceLabel = frequenceMap[frequence] || t('groups.frequencyMonthly');

  return (
    <div
      style={{
        padding: '22px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(49, 151, 149, 0.12) 0%, rgba(26, 54, 93, 0.28) 100%)',
        border: '1px solid rgba(79, 209, 197, 0.3)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(79, 209, 197, 0.18)',
              color: 'var(--color-secondary-light)',
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('groups.potSimulation')}
            </span>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              {membresNum} {t('common.members')} × {montantNum.toLocaleString()} {devise}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
            {t('groups.totalPotLabel')}
          </span>
          <span
            style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              fontFamily: 'var(--font-family-headings)',
              color: 'var(--color-secondary-light)',
              letterSpacing: '-0.02em'
            }}
          >
            {totalCagnotte.toLocaleString()} {devise}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <Users size={16} style={{ color: 'var(--color-secondary-light)' }} />
          <span>{membresNum} {t('groups.totalCyclesLabel') || 'tours prévus'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <Calendar size={16} style={{ color: 'var(--color-accent)' }} />
          <span>{frequenceLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
          <span>100% Mobile Money direct</span>
        </div>
      </div>
    </div>
  );
}
