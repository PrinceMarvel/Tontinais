/**
 * @file Login.jsx
 * @description Page de connexion sécurisée avec intégration du Design System et logo officiel.
 * @module pages/Login
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const destination = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !motDePasse) {
      setErrorMessage(t('errors.requiredFields'));
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), motDePasse);
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px 16px'
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 28px'
        }}
      >
        {/* En-tête de carte avec Logo Officiel et Sélecteur de Langue */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px'
          }}
        >
          <Logo size={36} showText={true} />
          <LanguageSelector />
        </div>

        <h1
          style={{
            fontSize: '1.6rem',
            marginBottom: '8px',
            color: 'var(--color-text-primary)'
          }}
        >
          {t('auth.loginTitle')}
        </h1>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '24px'
          }}
        >
          {t('auth.loginSubtitle')}
        </p>

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
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label htmlFor="email" className="label">
              {t('auth.emailLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />
              <input
                id="email"
                type="email"
                className="input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="motDePasse" className="label">
              {t('auth.passwordLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />
              <input
                id="motDePasse"
                type="password"
                className="input"
                style={{ paddingLeft: '40px' }}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <LogIn size={18} />
            <span>{loading ? t('common.loading') : t('auth.submitLogin')}</span>
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)'
          }}
        >
          <span>{t('auth.noAccount')} </span>
          <Link
            to="/register"
            style={{
              color: 'var(--color-secondary-light)',
              fontWeight: '600'
            }}
          >
            {t('auth.submitRegister')}
          </Link>
        </div>
      </div>
    </div>
  );
}
