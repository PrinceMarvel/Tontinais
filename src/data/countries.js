/**
 * @file countries.js
 * @description Référentiel des pays, indicatifs téléphoniques officiels et portefeuilles Mobile Money associés.
 * @module data/countries
 */

export const COUNTRIES = [
  { code: 'CI', name: 'Côte d’Ivoire', dialCode: '+225', flag: '🇨🇮', minDigits: 10, maxDigits: 10, example: '0701020304', wallets: ['WAVE', 'ORANGE_MONEY', 'MTN_MOMO', 'MOOV'] },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', minDigits: 9, maxDigits: 9, example: '771234567', wallets: ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY'] },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯', minDigits: 8, maxDigits: 10, example: '97123456', wallets: ['MTN_MOMO', 'MOOV', 'WAVE'] },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', minDigits: 9, maxDigits: 9, example: '691234567', wallets: ['MTN_MOMO', 'ORANGE_MONEY'] },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', minDigits: 8, maxDigits: 8, example: '90123456', wallets: ['TMONEY', 'MOOV'] },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', minDigits: 8, maxDigits: 8, example: '70123456', wallets: ['ORANGE_MONEY', 'MOOV'] },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', minDigits: 8, maxDigits: 8, example: '70123456', wallets: ['ORANGE_MONEY', 'MOOV', 'WAVE'] },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳', minDigits: 9, maxDigits: 9, example: '620123456', wallets: ['ORANGE_MONEY', 'MTN_MOMO'] },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', minDigits: 8, maxDigits: 8, example: '90123456', wallets: ['AIRTEL_MONEY', 'MOOV', 'ORANGE_MONEY'] },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', minDigits: 7, maxDigits: 8, example: '77123456', wallets: ['AIRTEL_MONEY', 'MOOV'] },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬', minDigits: 9, maxDigits: 9, example: '061234567', wallets: ['MTN_MOMO', 'AIRTEL_MONEY'] },
  { code: 'CD', name: 'RD Congo', dialCode: '+243', flag: '🇨🇩', minDigits: 9, maxDigits: 9, example: '811234567', wallets: ['MPESA', 'ORANGE_MONEY', 'AIRTEL_MONEY'] },
  { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩', minDigits: 8, maxDigits: 8, example: '66123456', wallets: ['AIRTEL_MONEY', 'MOOV'] },
  { code: 'CF', name: 'Centrafrique', dialCode: '+236', flag: '🇨🇫', minDigits: 8, maxDigits: 8, example: '75123456', wallets: ['ORANGE_MONEY', 'AIRTEL_MONEY'] },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬', minDigits: 9, maxDigits: 9, example: '341234567', wallets: ['ORANGE_MONEY', 'AIRTEL_MONEY', 'MOOV'] },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', minDigits: 9, maxDigits: 9, example: '781234567', wallets: ['MTN_MOMO', 'AIRTEL_MONEY'] },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', minDigits: 9, maxDigits: 9, example: '712345678', wallets: ['MPESA', 'AIRTEL_MONEY'] },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', minDigits: 9, maxDigits: 9, example: '241234567', wallets: ['MTN_MOMO', 'AIRTEL_MONEY', 'WAVE'] },
  { code: 'NG', name: 'Nigéria', dialCode: '+234', flag: '🇳🇬', minDigits: 10, maxDigits: 10, example: '8021234567', wallets: ['MTN_MOMO', 'AIRTEL_MONEY'] },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦', minDigits: 9, maxDigits: 9, example: '612345678', wallets: ['ORANGE_MONEY', 'CARTE_BANCAIRE'] },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿', minDigits: 9, maxDigits: 9, example: '551234567', wallets: ['CARTE_BANCAIRE'] },
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳', minDigits: 8, maxDigits: 8, example: '20123456', wallets: ['CARTE_BANCAIRE'] },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 9, example: '612345678', wallets: ['CARTE_BANCAIRE'] },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪', minDigits: 9, maxDigits: 9, example: '470123456', wallets: ['CARTE_BANCAIRE'] },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭', minDigits: 9, maxDigits: 9, example: '781234567', wallets: ['CARTE_BANCAIRE'] },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸', minDigits: 10, maxDigits: 10, example: '2025550123', wallets: ['CARTE_BANCAIRE'] },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', minDigits: 10, maxDigits: 10, example: '4165550123', wallets: ['CARTE_BANCAIRE'] },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧', minDigits: 10, maxDigits: 10, example: '7911123456', wallets: ['CARTE_BANCAIRE'] }
];

export const WALLET_CONFIG = {
  WAVE: { id: 'WAVE', name: 'Wave', color: '#1dc4ff', textColor: '#ffffff', badge: 'Wave' },
  ORANGE_MONEY: { id: 'ORANGE_MONEY', name: 'Orange Money', color: '#ff7900', textColor: '#ffffff', badge: 'OM' },
  MTN_MOMO: { id: 'MTN_MOMO', name: 'MTN MoMo', color: '#ffcc00', textColor: '#000000', badge: 'MoMo' },
  MOOV: { id: 'MOOV', name: 'Moov Money', color: '#0066b2', textColor: '#ffffff', badge: 'Moov' },
  AIRTEL_MONEY: { id: 'AIRTEL_MONEY', name: 'Airtel Money', color: '#e60000', textColor: '#ffffff', badge: 'Airtel' },
  MPESA: { id: 'MPESA', name: 'M-Pesa', color: '#00a651', textColor: '#ffffff', badge: 'M-Pesa' },
  FREE_MONEY: { id: 'FREE_MONEY', name: 'Free Money', color: '#e10028', textColor: '#ffffff', badge: 'Free' },
  TMONEY: { id: 'TMONEY', name: 'T-Money', color: '#0088cc', textColor: '#ffffff', badge: 'T-Money' },
  CARTE_BANCAIRE: { id: 'CARTE_BANCAIRE', name: 'Carte Bancaire / Visa', color: '#2b4c7e', textColor: '#ffffff', badge: 'Carte' }
};

export const findCountryByCode = (code) => {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
};

export const findCountryByDialCode = (dialCode) => {
  return COUNTRIES.find((c) => c.dialCode === dialCode) || COUNTRIES[0];
};

export const detectCountryFromPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return COUNTRIES[0];
  const cleaned = phone.trim();
  // Trier par indicatifs les plus longs en premier pour éviter les faux positifs (ex: +225 avant +22)
  const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
  const found = sorted.find((c) => cleaned.startsWith(c.dialCode));
  return found || COUNTRIES[0];
};

export const cleanLocalNumber = (raw) => {
  if (!raw) return '';
  return raw.replace(/[^\d]/g, '');
};

export const validatePhoneNumber = (dialCode, localNumber, country) => {
  const digits = cleanLocalNumber(localNumber);
  if (!digits) return { valid: false, error: 'Numéro requis.' };
  if (country) {
    if (digits.length < country.minDigits) {
      return { valid: false, error: `${digits.length}/${country.minDigits} chiffres (${country.name})` };
    }
    if (digits.length > country.maxDigits) {
      return { valid: false, error: `Trop long (max ${country.maxDigits} chiffres pour ${country.name})` };
    }
  } else if (digits.length < 6 || digits.length > 14) {
    return { valid: false, error: 'Longueur de numéro non valide.' };
  }
  return { valid: true, error: null, formatted: `${dialCode}${digits}` };
};

