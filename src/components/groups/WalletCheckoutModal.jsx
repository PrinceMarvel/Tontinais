/**
 * @file WalletCheckoutModal.jsx
 * @description Guichet Mobile Money connecté aux portefeuilles réels, USSD et validation automatique.
 * @module components/groups/WalletCheckoutModal
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Smartphone, ExternalLink, PhoneCall } from 'lucide-react';
import api from '../../services/api';

const THEMES = {
  ORANGE_MONEY: { name: 'Orange Money', primary: '#ff7900', headerBg: '#1e1e1e', textColor: '#fff', ussd: '#144#', webUrl: 'https://orangemoney.orange.ci', deepLink: 'orange://' },
  MTN_MOMO: { name: 'MTN Mobile Money', primary: '#ffcc00', headerBg: '#ffcc00', textColor: '#000', ussd: '*133#', webUrl: 'https://momo.mtn.com', deepLink: 'mtnmomo://' },
  WAVE: { name: 'Wave Digital', primary: '#1dc4ff', headerBg: '#0b192c', textColor: '#fff', webUrl: 'https://pay.wave.com', deepLink: 'wave://' },
  MOOV: { name: 'Moov Money', primary: '#0066b2', headerBg: '#00284d', textColor: '#fff', ussd: '*155#', webUrl: 'https://moov-africa.com' },
  AIRTEL_MONEY: { name: 'Airtel Money', primary: '#e60000', headerBg: '#2a0000', textColor: '#fff', ussd: '*128#', webUrl: 'https://airtel.africa' },
  MPESA: { name: 'M-Pesa', primary: '#00a651', headerBg: '#002613', textColor: '#fff', ussd: '*334#', webUrl: 'https://safaricom.co.ke/mpesa' },
  FREE_MONEY: { name: 'Free Money', primary: '#e10028', headerBg: '#1f0006', textColor: '#fff', ussd: '*145#', webUrl: 'https://freemoney.sn' },
  TMONEY: { name: 'T-Money', primary: '#0088cc', headerBg: '#001a29', textColor: '#fff', ussd: '*145#', webUrl: 'https://togocom.tg' },
  CARTE_BANCAIRE: { name: 'Carte Bancaire / Visa', primary: '#2b4c7e', headerBg: '#0f172a', textColor: '#fff', webUrl: 'https://checkout.stripe.com' }
};

const flexBetween = { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' };

export default function WalletCheckoutModal({ isOpen, onClose, sessionData, onPaymentSuccess }) {
  const [transactionCode, setTransactionCode] = useState('');
  const [step, setStep] = useState('AUTHENTICATION');
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen || !sessionData) return null;

  const { contributionId, operator, phone, amount, currency, groupName, tourNumber, walletConfig } = sessionData;
  const theme = THEMES[operator] || THEMES.ORANGE_MONEY;
  const ussdCode = walletConfig?.ussd || theme.ussd;
  const appUrl = walletConfig?.deepLink || walletConfig?.webUrl || theme.webUrl;

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    const code = transactionCode.trim();
    if (!code || code.length < 3) {
      setErrorMessage('Veuillez renseigner le code de confirmation ou l’ID de transaction reçu de l’opérateur.');
      return;
    }
    try {
      setStep('PROCESSING');
      setErrorMessage('');
      const res = await api.post(`/contributions/${contributionId}/confirm`, { transactionCode: code });
      if (res.success) {
        setReceiptData({ transactionId: res.transactionId || code, date: res.datePaiement || new Date().toISOString() });
        setStep('SUCCESS');
        setTimeout(() => { if (onPaymentSuccess) onPaymentSuccess(); onClose(); }, 2600);
      } else {
        throw new Error(res.error || 'Erreur lors de la confirmation.');
      }
    } catch (err) {
      setStep('AUTHENTICATION');
      setErrorMessage(err.message || 'La confirmation a échoué. Vérifiez votre code opérateur.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', zIndex: 250, padding: 'clamp(10px, 3vw, 20px)' }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '480px', maxHeight: '92vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)' }}>
        
        {/* En-tête opérateur */}
        <div style={{ backgroundColor: theme.headerBg, color: theme.textColor, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.primary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={20} />
            <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>Guichet {theme.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', opacity: 0.9 }}>
            <Lock size={12} />
            <span>Sécurisé</span>
          </div>
        </div>

        {/* Corps */}
        <div style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
          {step === 'AUTHENTICATION' && (
            <form onSubmit={handleConfirmPayment}>
              {/* Détails cotisation */}
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={flexBetween}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Tontine &amp; Tour</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{groupName} • Tour n°{tourNumber}</span>
                </div>
                <div style={flexBetween}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Compte débité</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>{phone}</span>
                </div>
                <div style={{ ...flexBetween, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', marginBottom: 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Montant cotisation</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: theme.primary }}>{amount?.toLocaleString()} {currency}</span>
                </div>
              </div>

              {/* Message transaction en cours & raccourcis */}
              <div style={{ backgroundColor: 'rgba(49, 151, 149, 0.12)', border: '1px solid var(--color-secondary-light)', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                  <strong>Transaction en cours :</strong> Une demande de versement a été émise vers {theme.name}.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  {ussdCode && (
                    <a href={`tel:${ussdCode.replace(/#/g, '%23')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', textDecoration: 'none', fontSize: '0.78rem', fontWeight: '600', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <PhoneCall size={13} />
                      <span>Composer {ussdCode}</span>
                    </a>
                  )}
                  {appUrl && (
                    <a href={appUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: theme.primary, color: theme.textColor, textDecoration: 'none', fontSize: '0.78rem', fontWeight: '700' }}>
                      <ExternalLink size={13} />
                      <span>Ouvrir l'application {theme.name}</span>
                    </a>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--color-danger)', borderRadius: '8px', color: 'var(--color-danger)', fontSize: '0.82rem', marginBottom: '14px' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Saisie code de confirmation de l'opérateur */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                  Code de confirmation de transaction opérateur
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 8px' }}>
                  Renseignez l'ID ou code reçu par SMS de {theme.name} (ex: TXN-4920, OM821) :
                </p>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="ex : TXN-84920 ou ID SMS reçu"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', fontSize: '1rem', fontWeight: '600', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Boutons d'action responsive */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: '1 1 auto', padding: '10px 14px' }}>
                  <ArrowLeft size={16} />
                  <span>Annuler</span>
                </button>
                <button type="submit" style={{ flex: '2 1 auto', padding: '10px 16px', backgroundColor: theme.primary, color: theme.textColor, border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '800', fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} />
                  <span>Confirmer le paiement</span>
                </button>
              </div>
            </form>
          )}

          {step === 'PROCESSING' && (
            <div style={{ textAlign: 'center', padding: '32px 12px' }}>
              <Loader2 size={44} color={theme.primary} className="animate-spin" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px', color: '#fff' }}>Vérification auprès de {theme.name}...</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>Enregistrement certifié de la transaction et validation du statut payé.</p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div style={{ textAlign: 'center', padding: '20px 8px' }}>
              <CheckCircle2 size={50} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.18)', border: '1px solid var(--color-success)', color: 'var(--color-success)', fontWeight: '800', fontSize: '0.95rem', marginBottom: '12px' }}>
                <span>STATUT : PAYÉ</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px', color: '#fff' }}>Cotisation validée avec succès !</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: '0 0 14px' }}>
                Votre versement de <strong>{amount?.toLocaleString()} {currency}</strong> a été certifié par {theme.name}.
              </p>

              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--color-border)', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', display: 'inline-block', color: 'var(--color-secondary-light)' }}>
                Code Opérateur : {receiptData?.transactionId}
              </div>

              <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: '14px' }}>
                Actualisation automatique de votre tontine en cours...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
