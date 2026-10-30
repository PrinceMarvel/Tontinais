/**
 * @file i18n.js
 * @description Configuration centralisée de l'internationalisation (i18n) pour TontiNaïs.
 * @module config/i18n
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';

// Récupération de la langue sauvegardée ou français par défaut
const savedLanguage = localStorage.getItem('tontinais_language') || 'fr';

const resources = {
  fr: {
    translation: frTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false // React gère nativement la protection XSS
    }
  });

// Synchronisation avec l'attribut HTML lang et persistance du choix
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('tontinais_language', lng);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

// Initialisation de la balise HTML lang dès le chargement
if (typeof document !== 'undefined') {
  document.documentElement.lang = savedLanguage;
}

export default i18n;
