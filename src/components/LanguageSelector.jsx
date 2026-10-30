/**
 * @file LanguageSelector.jsx
 * @description Composant sélecteur de langue (Français / Anglais) pour TontiNaïs.
 * @module components/LanguageSelector
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'fr';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)'
      }}
      aria-label={t('common.language')}
    >
      <Globe
        size={16}
        style={{ color: 'var(--color-secondary-light)', flexShrink: 0 }}
      />
      <button
        type="button"
        onClick={() => changeLanguage('fr')}
        style={{
          background: currentLang.startsWith('fr')
            ? 'var(--color-primary-light)'
            : 'transparent',
          color: currentLang.startsWith('fr')
            ? 'var(--color-text-primary)'
            : 'var(--color-text-secondary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '2px 8px',
          fontSize: '0.8rem',
          fontWeight: currentLang.startsWith('fr') ? '700' : '500',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
        aria-pressed={currentLang.startsWith('fr')}
      >
        FR
      </button>
      <span style={{ color: 'var(--color-border)', fontSize: '0.8rem' }}>|</span>
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        style={{
          background: currentLang.startsWith('en')
            ? 'var(--color-primary-light)'
            : 'transparent',
          color: currentLang.startsWith('en')
            ? 'var(--color-text-primary)'
            : 'var(--color-text-secondary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '2px 8px',
          fontSize: '0.8rem',
          fontWeight: currentLang.startsWith('en') ? '700' : '500',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
        aria-pressed={currentLang.startsWith('en')}
      >
        EN
      </button>
    </div>
  );
}
