/**
 * @file InstallAppButton.jsx
 * @description Bouton de téléchargement et d'installation PWA native sur smartphone (Android & iOS).
 * Intègre la capture du prompt natif et le guidage pas-à-pas pour Safari iOS.
 * @module components/common/InstallAppButton
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, CheckCircle2, Share, PlusSquare, Check, X, Smartphone } from 'lucide-react';

export default function InstallAppButton({ onInstalled, className = '', style = {} }) {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // Vérifie si l'application est déjà lancée en mode natif autonome
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Détection de l'écosystème Apple (iOS Safari)
    const userAgent = window.navigator.userAgent || '';
    const isAppleDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIos(isAppleDevice);

    // Écoute de l'événement d'installation PWA sur Android / Chromium
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      if (onInstalled) onInstalled();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstalled]);

  const handleInstallClick = async () => {
    if (isStandalone) return;

    // Sur iPhone / iPad, afficher les instructions Safari
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    // Sur Android / Chrome, déclencher l'installation native
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsStandalone(true);
        if (onInstalled) onInstalled();
      }
      setDeferredPrompt(null);
    } else {
      // Fallback si l'événement n'a pas encore été capturé
      setShowIosModal(true);
    }
  };

  if (isStandalone) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: 'var(--color-success)',
          fontSize: '0.82rem',
          fontWeight: '600',
          ...style
        }}
      >
        <CheckCircle2 size={16} />
        <span>{t('nav.appInstalled')}</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`btn ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          padding: '11px 16px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(13, 148, 136, 0.14)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          color: 'var(--color-secondary-light)',
          fontSize: '0.88rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
          ...style
        }}
      >
        <Download size={18} strokeWidth={2.2} />
        <span>{t('nav.installApp')}</span>
      </button>

      {/* Modale d'instructions d'installation sur iPhone / Safari */}
      {showIosModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(10, 14, 23, 0.85)',
            backdropFilter: 'var(--backdrop-blur)',
            display: 'grid',
            placeItems: 'center',
            padding: '16px'
          }}
          onClick={() => setShowIosModal(false)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              maxWidth: '380px',
              width: '100%',
              padding: '24px 20px',
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '4px'
              }}
              aria-label={t('common.cancel')}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(13, 148, 136, 0.12)',
                  border: '1px solid rgba(20, 184, 166, 0.25)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--color-secondary-light)'
                }}
              >
                <Smartphone size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-text-primary)' }}>
                {t('nav.iosInstallTitle')}
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
              {t('nav.iosInstallDesc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Share size={14} color="var(--color-secondary-light)" />
                </div>
                <span style={{ lineHeight: 1.4 }}>1. {t('nav.iosInstallStep1')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <PlusSquare size={14} color="var(--color-secondary-light)" />
                </div>
                <span style={{ lineHeight: 1.4 }}>2. {t('nav.iosInstallStep2')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Check size={14} color="var(--color-success)" />
                </div>
                <span style={{ lineHeight: 1.4 }}>3. {t('nav.iosInstallStep3')}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowIosModal(false)}
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

