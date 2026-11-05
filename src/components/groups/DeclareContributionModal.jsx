/**
 * @file DeclareContributionModal.jsx
 * @description Modale de sélection d'opérateur Mobile Money redirigeant vers le guichet de validation de code PIN.
 * @module components/groups/DeclareContributionModal
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Smartphone, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import WalletCheckoutModal from './WalletCheckoutModal';
import CountryPhoneInput from '../common/CountryPhoneInput';
import { detectCountryFromPhone, WALLET_CONFIG, validatePhoneNumber } from '../../data/countries';

export default function DeclareContributionModal({
  isOpen,
  onClose,
  groupId,
  group,
  onContributionSuccess
}) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [tourNumber, setTourNumber] = useState(1);
  const [phone, setPhone] = useState(user?.telephone || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkoutSession, setCheckoutSession] = useState(null);

  const currentCountry = detectCountryFromPhone(phone);
  const availableWallets = (currentCountry.wallets || []).map((id) => WALLET_CONFIG[id]).filter(Boolean);
  const [operator, setOperator] = useState(() => availableWallets[0]?.id || 'ORANGE_MONEY');

  useEffect(() => {
    if (availableWallets.length > 0 && !availableWallets.some((w) => w.id === operator)) {
      setOperator(availableWallets[0].id);
    }
  }, [currentCountry.code]);

  if (!isOpen) return null;

  const montant = group?.montantCotisation || 0;
  const devise = group?.devise || 'XAF';

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone.trim()) {
      setErrorMessage(t('contributions.modalPhoneRequired'));
      return;
    }

    const local = phone.startsWith(currentCountry.dialCode) ? phone.slice(currentCountry.dialCode.length) : phone;
    const check = validatePhoneNumber(currentCountry.dialCode, local, currentCountry);
    if (!check.valid) {
      setErrorMessage(check.error || 'Numéro de téléphone non valide pour ce pays.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/contributions', {
        groupId,
        tourNumber,
        montant,
        walletProvider: operator,
        walletPhone: phone.trim()
      });

      if (res.success && res.checkoutSession) {
        // Redirection immédiate vers le guichet de paiement de l'opérateur
        setCheckoutSession(res.checkoutSession);
      } else {
        throw new Error(res.error || t('errors.generic'));
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  // Si la session de guichet est ouverte, affichage du portail officiel de l'opérateur
  if (checkoutSession) {
    return (
      <WalletCheckoutModal
        isOpen={true}
        sessionData={checkoutSession}
        onClose={() => {
          setCheckoutSession(null);
          onClose();
        }}
        onPaymentSuccess={() => {
          setCheckoutSession(null);
          if (onContributionSuccess) onContributionSuccess();
          onClose();
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'var(--backdrop-blur)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 200,
        padding: '20px'
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          position: 'relative',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer'
          }}
          aria-label={t('common.cancel')}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary))',
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <Smartphone size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text-primary)' }}>
              {t('contributions.modalTitle')}
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {group?.nom}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-danger)',
              fontSize: '0.85rem',
              marginTop: '16px'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '18px' }}>
          {/* Montant & Tour */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="label">{t('contributions.modalAmountLabel')}</label>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--color-border)',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: 'var(--color-secondary-light)'
                }}
              >
                {montant.toLocaleString()} {devise}
              </div>
            </div>

            <div>
              <label className="label">{t('contributions.modalTourLabel')}</label>
              <input
                type="number"
                min="1"
                max="100"
                className="input"
                value={tourNumber}
                onChange={(e) => setTourNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Numéro de téléphone Mobile Money avec indicatif pays */}
          <div>
            <label className="label">{t('contributions.modalPhoneLabel')}</label>
            <CountryPhoneInput
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro Mobile Money du compte"
              required
            />
          </div>

          {/* Choix du portefeuille lié au pays */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="label" style={{ margin: 0 }}>{t('contributions.modalWalletLabel')}</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-light)', fontWeight: '600' }}>
                {currentCountry.flag} {currentCountry.name}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {availableWallets.map((op) => {
                const isSelected = operator === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setOperator(op.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? `2px solid ${op.color}` : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(49, 151, 149, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '0.86rem', fontWeight: isSelected ? '700' : '500', color: '#fff' }}>
                      {op.name}
                    </span>
                    <span
                      style={{
                        backgroundColor: op.color,
                        color: op.textColor || '#fff',
                        fontWeight: '800',
                        fontSize: '0.68rem',
                        padding: '2px 5px',
                        borderRadius: '4px'
                      }}
                    >
                      {op.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '180px' }}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('contributions.modalConnecting')}</span>
                </>
              ) : (
                <>
                  <span>{t('contributions.modalSubmit')}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
