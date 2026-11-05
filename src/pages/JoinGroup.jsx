/**
 * @file JoinGroup.jsx
 * @description Page d'adhésion à une tontine via scan de QR code ou saisie de code avec redirection immédiate.
 * @module pages/JoinGroup
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyRound, ArrowLeft, AlertCircle, QrCode, Loader2 } from 'lucide-react';
import api from '../services/api';
import QrCodeScanner from '../components/groups/QrCodeScanner';

export default function JoinGroup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [joinMethod, setJoinMethod] = useState('scan'); // 'scan' | 'manual'
  const [codeInvitation, setCodeInvitation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoinWithCode = async (codeToSubmit) => {
    setErrorMessage('');
    const trimmedCode = (codeToSubmit || codeInvitation).trim().toUpperCase();

    if (!trimmedCode) {
      setErrorMessage(t('groups.enterCode'));
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/groups/join', { codeInvitation: trimmedCode });
      if (res.success) {
        const targetGroupId = res.group?._id || res.membership?.group;
        if (targetGroupId) {
          // Redirection directe vers la tontine rejointe
          navigate(`/groups/${targetGroupId}`, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  // Traitement automatique d'un code transmis par paramètre d'URL (?code=XXXXXXXX)
  useEffect(() => {
    const queryCode = searchParams.get('code');
    if (queryCode && queryCode.trim().length === 8) {
      setCodeInvitation(queryCode.trim().toUpperCase());
      setJoinMethod('manual');
      handleJoinWithCode(queryCode.trim().toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleJoinWithCode();
  };

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '36px 28px' }}>
        {/* Navigation retour */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)'
            }}
          >
            <ArrowLeft size={16} />
            <span>{t('groups.backToDashboard')}</span>
          </Link>
        </div>

        {/* Titre et description */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {joinMethod === 'scan' ? <QrCode size={28} /> : <KeyRound size={28} />}
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            {t('groups.joinTitle')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            {joinMethod === 'scan'
              ? t('groups.scanSubtitle')
              : t('groups.enterCode')}
          </p>
        </div>

        {/* Sélecteur de méthode : Scanner QR vs Saisie manuelle */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            backgroundColor: 'var(--color-bg-surface)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setJoinMethod('scan');
            }}
            className={`btn ${joinMethod === 'scan' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
          >
            <QrCode size={16} />
            <span>{t('groups.scanTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setJoinMethod('manual');
            }}
            className={`btn ${joinMethod === 'manual' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
          >
            <KeyRound size={16} />
            <span>{t('groups.manualTab')}</span>
          </button>
        </div>

        {/* Message d'erreur */}
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
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Indicateur de chargement pendant l'adhésion */}
        {loading && (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Loader2 size={32} className="animate-spin" color="var(--color-secondary-light)" />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
              {t('groups.joiningInProgress')}
            </p>
          </div>
        )}

        {/* Mode 1 : Lecteur de QR Code interactif */}
        {!loading && joinMethod === 'scan' && (
          <QrCodeScanner onScanSuccess={(code) => handleJoinWithCode(code)} />
        )}

        {/* Mode 2 : Formulaire classique de saisie du code */}
        {!loading && joinMethod === 'manual' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label
                htmlFor="codeInvitation"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {t('groups.inviteCode')}
              </label>
              <input
                id="codeInvitation"
                name="codeInvitation"
                type="text"
                maxLength={8}
                value={codeInvitation}
                onChange={(e) => setCodeInvitation(e.target.value.toUpperCase())}
                placeholder="Ex : 9B3F4A1C"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  letterSpacing: '0.15em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-secondary-light)',
                  outline: 'none'
                }}
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !codeInvitation.trim()}
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              <KeyRound size={18} />
              <span>{loading ? t('common.loading') : t('groups.submitJoin')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
