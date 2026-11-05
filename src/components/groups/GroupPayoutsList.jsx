/**
 * @file GroupPayoutsList.jsx
 * @description Composant modulaire affichant le planning des tours et le déclencheur de distribution directe Mobile Money.
 * @module components/groups/GroupPayoutsList
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Gift,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlayCircle,
  AlertCircle,
  Smartphone,
  Send,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

export default function GroupPayoutsList({ payouts = [], isChef, groupId, devise = 'XAF', onPayoutsUpdated }) {
  const { t } = useTranslation();
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionPayoutId, setActionPayoutId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerateSchedule = async () => {
    try {
      setLoadingAction(true);
      setErrorMessage('');
      const res = await api.post(`/payouts/group/${groupId}/generate`);
      if (res.success && onPayoutsUpdated) {
        onPayoutsUpdated();
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDistributeWallet = async (payout) => {
    const benefName = `${payout.beneficiaire?.prenom || ''} ${payout.beneficiaire?.nom || ''}`.trim();
    const benefPhone = payout.beneficiaire?.telephone || '';
    const amount = payout.montantTotal?.toLocaleString() || '0';

    const confirmMsg = t('payouts.confirmDistribute', {
      amount,
      currency: devise,
      name: benefName,
      phone: benefPhone
    });
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionPayoutId(payout._id);
      setErrorMessage('');
      setSuccessMessage('');

      const res = await api.put(`/payouts/${payout._id}/distribute`, {
        walletProvider: payout.walletProvider || 'ORANGE_MONEY',
        walletPhone: benefPhone
      });

      if (res.success) {
        setSuccessMessage(res.message || t('payouts.distributed'));
        if (onPayoutsUpdated) onPayoutsUpdated();
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setActionPayoutId(null);
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'DISTRIBUE':
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} />
            <span>{t('payouts.distributed')}</span>
          </span>
        );
      case 'BLOQUE':
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} />
            <span>{t('payouts.blocked')}</span>
          </span>
        );
      case 'EN_COURS':
        return (
          <span className="badge badge-info">
            <Clock size={12} />
            <span>{t('payouts.ongoing')}</span>
          </span>
        );
      case 'PLANIFIE':
      default:
        return (
          <span className="badge badge-warning">
            <Clock size={12} />
            <span>{t('payouts.planned')}</span>
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

      {successMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: 'rgba(49, 151, 149, 0.15)',
            border: '1px solid var(--color-secondary-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-secondary-light)',
            fontSize: '0.9rem'
          }}
        >
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="glass-card" style={{ padding: 'clamp(14px, 3vw, 20px)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={22} color="var(--color-accent)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', margin: 0 }}>
              {t('payouts.title')} ({payouts.length})
            </h3>
          </div>

          {isChef && payouts.length === 0 && (
            <button
              type="button"
              className="btn btn-accent"
              disabled={loadingAction}
              onClick={handleGenerateSchedule}
              style={{ fontSize: '0.85rem' }}
            >
              <PlayCircle size={16} />
              <span>{t('groups.generateSchedule')}</span>
            </button>
          )}
        </div>

        {payouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-text-secondary)' }}>
            <Gift size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '0.95rem' }}>{t('groups.noPayouts')}</p>
            {isChef && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                {t('groups.noPayoutsChef')}
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {payouts.map((payout) => {
              const benef = payout.beneficiaire || {};
              const isProcessing = actionPayoutId === payout._id;

              return (
                <div
                  key={payout._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(237, 137, 54, 0.15)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--color-accent)',
                        fontWeight: '700',
                        fontSize: '1rem'
                      }}
                    >
                      #{payout.tourNumber}
                    </div>

                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>
                        {benef.prenom
                          ? `${benef.prenom} ${benef.nom}`
                          : t('payouts.beneficiary')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', wordBreak: 'break-word' }}>
                        <Smartphone size={12} />
                        <span>{benef.telephone || '—'}</span>
                        <span>• {t('payouts.expectedDate')} : {new Date(payout.datePrevue).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {payout.transactionReference && (
                        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-secondary-light)', marginTop: '2px' }}>
                          {payout.transactionReference}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-secondary-light)', fontSize: '1.05rem' }}>
                        {payout.montantTotal?.toLocaleString()} {devise}
                      </div>
                      <div>{getStatusBadge(payout.statut)}</div>
                    </div>

                    {isChef && (payout.statut === 'PLANIFIE' || payout.statut === 'EN_COURS') && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={isProcessing}
                        onClick={() => handleDistributeWallet(payout)}
                        style={{ padding: '8px 14px', fontSize: '0.8rem', minWidth: '130px' }}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>{t('groups.transferring')}</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>{t('groups.distributeWallet')}</span>
                          </>
                        )}
                      </button>
                    )}
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
