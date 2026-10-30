/**
 * @file DeclareContributionModal.jsx
 * @description Modale de sélection d'opérateur Mobile Money redirigeant vers le guichet de validation de code PIN.
 * @module components/groups/DeclareContributionModal
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Smartphone, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import WalletCheckoutModal from './WalletCheckoutModal';

const OPERATORS = [
  { id: 'ORANGE_MONEY', name: 'Orange Money', color: '#ff7900', badge: 'OM' },
  { id: 'MTN_MOMO', name: 'MTN Mobile Money', color: '#ffcc00', textColor: '#000', badge: 'MoMo' },
  { id: 'WAVE', name: 'Wave Money', color: '#1dc4ff', badge: 'Wave' },
  { id: 'MOOV', name: 'Moov Money', color: '#0066b2', badge: 'Moov' }
];

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
  const [operator, setOperator] = useState('ORANGE_MONEY');
  const [phone, setPhone] = useState(user?.telephone || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkoutSession, setCheckoutSession] = useState(null);

  if (!isOpen) return null;

  const montant = group?.montantCotisation || 0;
  const devise = group?.devise || 'XAF';

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone.trim()) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone Mobile Money valide.');
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
        throw new Error(res.error || 'Impossible d\'ouvrir la session de paiement.');
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
          aria-label="Fermer"
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
              Cotisation Mobile Money
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
              <label className="label">Montant de la cotisation</label>
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
              <label className="label">Tour concerné</label>
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

          {/* Choix de l'opérateur */}
          <div>
            <label className="label">Sélectionnez votre portefeuille</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {OPERATORS.map((op) => {
                const isSelected = operator === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setOperator(op.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? `2px solid ${op.color}` : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(49, 151, 149, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? '700' : '500', color: '#fff' }}>
                      {op.name}
                    </span>
                    <span
                      style={{
                        backgroundColor: op.color,
                        color: op.textColor || '#fff',
                        fontWeight: '800',
                        fontSize: '0.7rem',
                        padding: '2px 6px',
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

          {/* Numéro de téléphone */}
          <div>
            <label className="label">Numéro de téléphone du compte</label>
            <input
              type="tel"
              className="input"
              placeholder="+237 6XX XX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <small style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
              Vous serez dirigé vers le guichet sécurisé de l&apos;opérateur pour valider avec votre code PIN secret.
            </small>
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '180px' }}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Connexion au guichet...</span>
                </>
              ) : (
                <>
                  <span>Payer sur le Guichet</span>
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
