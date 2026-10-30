/**
 * @file JoinGroup.jsx
 * @description Page d'adhésion à une tontine via code d'invitation ou QR code.
 * @module pages/JoinGroup
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import api from '../services/api';

export default function JoinGroup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [codeInvitation, setCodeInvitation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedCode = codeInvitation.trim().toUpperCase();
    if (!trimmedCode) {
      setErrorMessage(t('groups.enterCode'));
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/groups/join', { codeInvitation: trimmedCode });
      if (res.success) {
        setSuccessInfo({
          message: res.message || 'Votre demande d\'adhésion a été transmise au Chef de Tontine.',
          group: res.group
        });
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            <KeyRound size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            {t('groups.joinTitle')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            {t('groups.enterCode')}
          </p>
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

        {/* Succès après soumission */}
        {successInfo ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 16px',
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px',
                color: 'var(--color-success)'
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--color-text-primary)' }}>
              Demande enregistrée !
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
              {successInfo.message}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                <Users size={16} />
                <span>{t('groups.backToDashboard')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Formulaire de saisie du code */
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
