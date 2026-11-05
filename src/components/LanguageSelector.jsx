/**
 * @file LanguageSelector.jsx
 * @description Composant sélecteur de langue (Français / Anglais) pour TontiNaïs.
 * @module components/LanguageSelector
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import FlagIcon from './common/FlagIcon';

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
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: currentLang.startsWith('fr')
            ? 'var(--color-primary-light)'
            : 'transparent',
          color: currentLang.startsWith('fr')
            ? 'var(--color-text-primary)'
            : 'var(--color-text-secondary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '2px 6px',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
        aria-label="Français"
        aria-pressed={currentLang.startsWith('fr')}
      >
        <FlagIcon countryCode="FR" size={13} />
        <span style={{ fontSize: '0.75rem', fontWeight: currentLang.startsWith('fr') ? '700' : '500' }}>FR</span>
      </button>
      <span style={{ color: 'var(--color-border)', fontSize: '0.8rem' }}>|</span>
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: currentLang.startsWith('en')
            ? 'var(--color-primary-light)'
            : 'transparent',
          color: currentLang.startsWith('en')
            ? 'var(--color-text-primary)'
            : 'var(--color-text-secondary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '2px 6px',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
        aria-label="English"
        aria-pressed={currentLang.startsWith('en')}
      >
        <FlagIcon countryCode="GB" size={13} />
        <span style={{ fontSize: '0.75rem', fontWeight: currentLang.startsWith('en') ? '700' : '500' }}>EN</span>
      </button>
    </div>
  );
}
