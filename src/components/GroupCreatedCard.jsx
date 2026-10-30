/**
 * @file GroupCreatedCard.jsx
 * @description Carte de confirmation post-création avec affichage du code d'invitation et QR Code.
 * @module components/GroupCreatedCard
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';

export default function GroupCreatedCard({ group }) {
  const { t } = useTranslation();
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!group?.codeInvitation) return;
    try {
      await navigator.clipboard.writeText(group.codeInvitation);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch {
      // Échec de la copie sécurisée dans le presse-papier
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '36px 28px', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(56, 178, 172, 0.15)',
            color: 'var(--color-primary-light)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 20px'
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '1.7rem', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          {t('groups.successCreatedTitle')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '28px', fontSize: '0.95rem' }}>
          {t('groups.successCreatedSubtitle')}
        </p>

        {/* Affichage du code d'invitation avec copie */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
            {t('groups.inviteCode')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '1.8rem',
                fontWeight: '700',
                letterSpacing: '4px',
                color: 'var(--color-secondary-light)'
              }}
            >
              {group.codeInvitation}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              title={t('groups.copyCode')}
            >
              {codeCopied ? <Check size={16} style={{ color: 'var(--color-success)' }} /> : <Copy size={16} />}
              <span>{codeCopied ? t('groups.codeCopied') : t('groups.copyCode')}</span>
            </button>
          </div>
        </div>

        {/* Affichage du QR Code généré par le backend */}
        {group.qrCodeUrl && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              {t('groups.shareQr')}
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: '12px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <img
                src={group.qrCodeUrl}
                alt={`QR Code ${group.nom}`}
                style={{ width: '160px', height: '160px', display: 'block' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <span>{t('groups.backToDashboard')}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
