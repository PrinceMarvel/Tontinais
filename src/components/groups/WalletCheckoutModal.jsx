/**
 * @file WalletCheckoutModal.jsx
 * @description Guichet et tableau de bord de validation de paiement direct Mobile Money.
 * Simule le portail officiel de l'opérateur sélectionné (Orange Money, MTN MoMo, Wave, Moov).
 * @module components/groups/WalletCheckoutModal
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Smartphone } from 'lucide-react';
import api from '../../services/api';

const THEMES = {
  ORANGE_MONEY: {
    name: 'Orange Money Web Payment',
    primary: '#ff7900',
    headerBg: '#1e1e1e',
    textColor: '#ffffff',
    accentColor: '#ff7900',
    instruction: 'Veuillez saisir votre code secret Orange Money à 4 chiffres pour autoriser le prélèvement.'
  },
  MTN_MOMO: {
    name: 'MTN Mobile Money Gateway',
    primary: '#ffcc00',
    headerBg: '#ffcc00',
    textColor: '#000000',
    accentColor: '#000000',
    instruction: 'Veuillez saisir votre code PIN secret MTN MoMo à 4 ou 5 chiffres pour confirmer.'
  },
  WAVE: {
    name: 'Wave Digital Checkout',
    primary: '#1dc4ff',
    headerBg: '#0b192c',
    textColor: '#ffffff',
    accentColor: '#1dc4ff',
    instruction: 'Saisissez votre code secret Wave pour valider instantanément le transfert sans frais.'
  },
  MOOV: {
    name: 'Moov Money Portal',
    primary: '#0066b2',
    headerBg: '#00284d',
    textColor: '#ffffff',
    accentColor: '#0066b2',
    instruction: 'Entrez le mot de passe secret de votre portefeuille Moov Money.'
  }
};

export default function WalletCheckoutModal({
  isOpen,
  onClose,
  sessionData,
  onPaymentSuccess
}) {
  const [pinCode, setPinCode] = useState('');
  const [step, setStep] = useState('AUTHENTICATION'); // 'AUTHENTICATION' | 'PROCESSING' | 'SUCCESS'
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen || !sessionData) return null;

  const { contributionId, reference, operator, phone, amount, currency, groupName, tourNumber } = sessionData;
  const theme = THEMES[operator] || THEMES.ORANGE_MONEY;

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!pinCode || pinCode.trim().length < 4) {
      setErrorMessage('Veuillez saisir un code PIN secret valide (4 chiffres minimum).');
      return;
    }

    try {
      setStep('PROCESSING');
      setErrorMessage('');

      // Appel de confirmation vers l'API backend TontiNaïs
      const res = await api.post(`/contributions/${contributionId}/confirm`, {
        pinCode: pinCode.trim()
      });

      if (res.success) {
        setReceiptData({
          transactionId: res.transactionId || reference,
          date: res.datePaiement || new Date().toISOString()
        });
        setStep('SUCCESS');
        setTimeout(() => {
          if (onPaymentSuccess) onPaymentSuccess();
          onClose();
        }, 2500);
      }
    } catch (err) {
      setStep('AUTHENTICATION');
      setErrorMessage(err.message || 'La transaction a été rejetée par le portefeuille.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 250,
        padding: '20px'
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* En-tête officiel du portefeuille */}
        <div
          style={{
            backgroundColor: theme.headerBg,
            color: theme.textColor,
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `2px solid ${theme.primary}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={20} />
            <span style={{ fontWeight: '800', fontSize: '0.95rem', letterSpacing: '0.5px' }}>
              {theme.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', opacity: 0.85 }}>
            <Lock size={12} />
            <span>Sécurisé SSL 256-bit</span>
          </div>
        </div>

        {/* Corps de la passerelle */}
        <div style={{ padding: '24px' }}>
          {step === 'AUTHENTICATION' && (
            <form onSubmit={handleConfirmPayment}>
              {/* Récapitulatif de la transaction */}
              <div
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Marchand</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    TontiNaïs ({groupName})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Tour &amp; Compte</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                    Tour n°{tourNumber} • {phone}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Montant total</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: theme.primary }}>
                    {amount?.toLocaleString()} {currency}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid var(--color-danger)',
                    borderRadius: '8px',
                    color: 'var(--color-danger)',
                    fontSize: '0.85rem',
                    marginBottom: '16px'
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Saisie du Code Secret / Mot de passe */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                  Code secret PIN du portefeuille
                </label>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0 0 10px' }}>
                  {theme.instruction}
                </p>

                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    maxLength={8}
                    autoFocus
                    placeholder="••••"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '1.5rem',
                      letterSpacing: '8px',
                      textAlign: 'center',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: `2px solid ${pinCode.length >= 4 ? theme.primary : 'var(--color-border)'}`,
                      borderRadius: '10px',
                      color: '#ffffff',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '12px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Annuler</span>
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    backgroundColor: theme.primary,
                    color: theme.textColor,
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>Confirmer &amp; Payer</span>
                </button>
              </div>
            </form>
          )}

          {step === 'PROCESSING' && (
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
              <Loader2 size={46} color={theme.primary} className="animate-spin" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.15rem', margin: '0 0 8px', color: '#fff' }}>
                Communication avec le serveur {operator}...
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Vérification du code PIN et sécurisation du transfert en cours.
              </p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <CheckCircle2 size={54} color="var(--color-secondary-light)" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontSize: '1.25rem', margin: '0 0 6px', color: '#fff' }}>
                Paiement approuvé par l&apos;opérateur !
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>
                Votre compte {phone} a été débité de {amount?.toLocaleString()} {currency}.
              </p>
              <div
                style={{
                  backgroundColor: 'rgba(49, 151, 149, 0.15)',
                  border: '1px solid var(--color-secondary-light)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  display: 'inline-block',
                  color: 'var(--color-secondary-light)'
                }}
              >
                Réf : {receiptData?.transactionId}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '16px' }}>
                Redirection automatique vers votre tontine en cours...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

