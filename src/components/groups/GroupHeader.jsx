/**
 * @file GroupHeader.jsx
 * @description Composant d'en-tête pour la vue détaillée d'une tontine (métriques, code et QR code).
 * @module components/groups/GroupHeader
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, QrCode } from 'lucide-react';

export default function GroupHeader({
  group,
  members = [],
  onCopyCode,
  copied,
  showQrModal,
  setShowQrModal
}) {
  const { t } = useTranslation();

  if (!group) return null;

  const activeMembersCount = members.filter((m) => m.statut === 'ACTIF').length;
  const totalPot = (group.montantCotisation || 0) * (group.nombreMaxMembres || 0);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '28px', marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-primary)' }}>{group.nom}</h1>
            <span className="badge badge-success">{group.statut || 'ACTIF'}</span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '680px' }}>
            {group.description || 'Tontine solidaire et collaborative.'}
          </p>
        </div>

        {/* Bloc Code d'invitation et QR Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)'
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Code :</span>
            <strong style={{ color: 'var(--color-secondary-light)', letterSpacing: '0.05em' }}>
              {group.codeInvitation}
            </strong>
            <button
              type="button"
              onClick={onCopyCode}
              title={t('groups.copyCode')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
            </button>
          </div>

          {group.qrCodeUrl && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowQrModal(!showQrModal)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <QrCode size={16} />
              <span>QR Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Encart d'affichage du QR Code */}
      {showQrModal && group.qrCodeUrl && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <img
            src={group.qrCodeUrl}
            alt="QR Code d'invitation"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: 'var(--radius-sm)',
              background: '#ffffff',
              padding: '8px'
            }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            {t('groups.shareQr')}
          </span>
        </div>
      )}

      {/* Grille des métriques financières */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          padding: '16px',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Cotisation unitaire</div>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-secondary-light)' }}>
            {group.montantCotisation?.toLocaleString()} {group.devise}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Périodicité</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {group.frequence}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Capacité participants</div>
          <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {activeMembersCount} / {group.nombreMaxMembres}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Cagnotte totale par cycle</div>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-accent)' }}>
            {totalPot.toLocaleString()} {group.devise}
          </div>
        </div>
      </div>
    </div>
  );
}
