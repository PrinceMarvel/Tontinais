/**
 * @file LanguageSelector.jsx
 * @description Contrôle segmenté de sélection linguistique (FR / EN) au design FinTech épuré.
 * @module components/LanguageSelector
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import FlagIcon from './common/FlagIcon';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'fr';
  const isFr = currentLang.startsWith('fr');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getButtonStyle = (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: active ? '#ffffff' : 'var(--color-text-secondary)',
    border: active ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
    borderRadius: 'var(--radius-full)',
    padding: '3px 8px',
    cursor: 'pointer',
    fontSize: '0.74rem',
    fontWeight: active ? '600' : '500',
    transition: 'var(--transition-fast)',
    boxShadow: active ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '2px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--color-border)'
      }}
      aria-label={t('common.language')}
    >
      <button
        type="button"
        onClick={() => changeLanguage('fr')}
        style={getButtonStyle(isFr)}
        aria-label="Français"
        aria-pressed={isFr}
      >
        <FlagIcon countryCode="FR" size={13} />
        <span>FR</span>
      </button>

      <button
        type="button"
        onClick={() => changeLanguage('en')}
        style={getButtonStyle(!isFr)}
        aria-label="English"
        aria-pressed={!isFr}
      >
        <FlagIcon countryCode="GB" size={13} />
        <span>EN</span>
      </button>
    </div>
  );
}
