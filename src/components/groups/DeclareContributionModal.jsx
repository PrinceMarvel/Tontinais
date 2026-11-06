/**
 * @file DeclareContributionModal.jsx
 * @description Modale moderne et ultra-responsive de paiement direct par Mobile Money.
 * @module components/groups/DeclareContributionModal
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Smartphone, AlertCircle, ArrowRight, Loader2, Shield } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import WalletCheckoutModal from './WalletCheckoutModal';
import CountryPhoneInput from '../common/CountryPhoneInput';
import { detectCountryFromPhone, WALLET_CONFIG, validatePhoneNumber } from '../../data/countries';

export default function DeclareContributionModal({ isOpen, onClose, groupId, group, onContributionSuccess }) {
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
    if (!phone.trim()) { setErrorMessage(t('contributions.modalPhoneRequired')); return; }
    const local = phone.startsWith(currentCountry.dialCode) ? phone.slice(currentCountry.dialCode.length) : phone;
    const check = validatePhoneNumber(currentCountry.dialCode, local, currentCountry);
    if (!check.valid) { setErrorMessage(check.error || 'Numéro non valide.'); return; }

    try {
      setLoading(true);
      const res = await api.post('/contributions', { groupId, tourNumber, montant, walletProvider: operator, walletPhone: phone.trim() });
      if (res.success && res.checkoutSession) {
        setCheckoutSession({ ...res.checkoutSession, walletConfig: WALLET_CONFIG[operator] || {} });
      } else {
        throw new Error(res.error || t('errors.generic'));
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (checkoutSession) {
    return (
      <WalletCheckoutModal
        isOpen={true}
        sessionData={checkoutSession}
        onClose={() => {
          setCheckoutSession(null);
          if (onContributionSuccess) onContributionSuccess();
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
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 15, 25, 0.88)', backdropFilter: 'blur(14px)', display: 'grid', placeItems: 'center', zIndex: 200, padding: 'clamp(10px, 3vw, 20px)' }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '92vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: 'linear-gradient(180deg, rgba(26, 34, 53, 0.98) 0%, rgba(15, 23, 42, 0.99) 100%)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(49, 151, 149, 0.12)', padding: 'clamp(18px, 4.5vw, 26px)', position: 'relative' }}>
        
        {/* Bouton fermeture */}
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--color-text-secondary)', display: 'grid', placeItems: 'center', cursor: 'pointer' }} aria-label={t('common.cancel')}>
          <X size={16} />
        </button>

        {/* En-tête moderne */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary))', display: 'grid', placeItems: 'center', boxShadow: '0 4px 14px rgba(49, 151, 149, 0.35)', flexShrink: 0 }}>
            <Smartphone size={22} color="#fff" />
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingRight: '28px' }}>
            <h2 style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)', fontWeight: '800', margin: 0, color: 'var(--color-text-primary)' }}>
              {t('contributions.modalTitle')}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group?.nom}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-light)', fontWeight: '600' }}>• {t('contributions.modalActiveTontine')}</span>
            </div>
          </div>
        </div>

        {/* Hero Card : Montant & Tour */}
        <div style={{ background: 'linear-gradient(135deg, rgba(49, 151, 149, 0.16) 0%, rgba(30, 41, 59, 0.7) 100%)', border: '1px solid rgba(49, 151, 149, 0.35)', borderRadius: '14px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('contributions.modalAmountLabel')}</span>
            <div style={{ fontSize: 'clamp(1.35rem, 3.8vw, 1.7rem)', fontWeight: '800', color: 'var(--color-secondary-light)', marginTop: '2px', letterSpacing: '-0.5px' }}>
              {montant.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{devise}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>{t('contributions.modalTourLabel')}</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '4px 8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginRight: '4px' }}>{t('contributions.modalRoundPrefix')}</span>
              <input type="number" min="1" max="100" value={tourNumber} onChange={(e) => setTourNumber(e.target.value)} style={{ width: '38px', background: 'transparent', border: 'none', color: 'var(--color-secondary-light)', fontSize: '0.95rem', fontWeight: '800', textAlign: 'center', outline: 'none' }} required />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--color-danger)', borderRadius: '10px', color: 'var(--color-danger)', fontSize: '0.84rem', marginBottom: '14px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Saisie téléphone */}
          <div>
            <label className="label" style={{ fontSize: '0.84rem', fontWeight: '700', marginBottom: '6px' }}>{t('contributions.modalPhoneLabel')}</label>
            <CountryPhoneInput id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('contributions.modalPhonePlaceholder')} required />
          </div>

          {/* Choix portefeuilles */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="label" style={{ margin: 0, fontSize: '0.84rem', fontWeight: '700' }}>{t('contributions.modalWalletLabel')}</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-light)', fontWeight: '600' }}>{currentCountry.flag} {currentCountry.name}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {availableWallets.map((op) => {
                const isSelected = operator === op.id;
                return (
                  <button key={op.id} type="button" onClick={() => setOperator(op.id)} style={{ padding: '10px 12px', borderRadius: '10px', border: isSelected ? `2px solid ${op.color}` : '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 27, 45, 0.6)', boxShadow: isSelected ? `0 0 14px ${op.color}33` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isSelected ? op.color : 'rgba(255,255,255,0.2)' }} />
                      <span style={{ fontSize: '0.84rem', fontWeight: isSelected ? '700' : '500', color: '#fff' }}>{op.name}</span>
                    </div>
                    <span style={{ backgroundColor: op.color, color: op.textColor || '#fff', fontWeight: '800', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px' }}>{op.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note de sécurité */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <Shield size={14} color="var(--color-secondary-light)" />
            <span>{t('contributions.modalSecurityHint')}</span>
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading} style={{ flex: '1 1 auto', minWidth: '100px', borderRadius: '10px', padding: '11px 16px' }}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: '2 1 auto', minWidth: '170px', borderRadius: '10px', padding: '11px 18px', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary))', boxShadow: '0 4px 16px rgba(49, 151, 149, 0.35)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
