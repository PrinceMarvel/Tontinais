/**
 * @file CountryPhoneInput.jsx
 * @description Sélecteur universel de pays et saisie ergonomique de numéro de téléphone officiel.
 * @module components/common/CountryPhoneInput
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Smartphone } from 'lucide-react';
import FlagIcon from './FlagIcon';
import {
  COUNTRIES,
  detectCountryFromPhone,
  cleanLocalNumber,
  validatePhoneNumber
} from '../../data/countries';

export default function CountryPhoneInput({
  value = '',
  onChange,
  disabled = false,
  required = false,
  id = 'telephone',
  placeholder
}) {
  const [selectedCountry, setSelectedCountry] = useState(() => detectCountryFromPhone(value));
  const [localNumber, setLocalNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Synchronisation lors du chargement initial ou mise à jour externe
  useEffect(() => {
    if (value && typeof value === 'string') {
      const country = detectCountryFromPhone(value);
      setSelectedCountry(country);
      if (value.startsWith(country.dialCode)) {
        setLocalNumber(value.slice(country.dialCode.length));
      } else {
        setLocalNumber(cleanLocalNumber(value));
      }
    }
  }, []);

  // Filtrage des pays par nom ou indicatif
  const filteredCountries = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.dialCode.includes(term) ||
        c.code.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(false);
    setSearchTerm('');
    const full = country.dialCode + cleanLocalNumber(localNumber);
    if (onChange) {
      onChange({ target: { name: id, value: full } }, { country, localNumber: cleanLocalNumber(localNumber), fullNumber: full });
    }
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value;
    const cleaned = cleanLocalNumber(raw);
    setLocalNumber(cleaned);
    const full = selectedCountry.dialCode + cleaned;
    if (onChange) {
      onChange({ target: { name: id, value: full } }, { country: selectedCountry, localNumber: cleaned, fullNumber: full });
    }
  };

  const validation = validatePhoneNumber(selectedCountry.dialCode, localNumber, selectedCountry);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Ligne de saisie avec bouton pays et champ texte */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${localNumber && !validation.valid ? 'var(--color-danger)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-bg-surface)',
          overflow: 'hidden',
          transition: 'var(--transition-fast)'
        }}
      >
        {/* Bouton de sélection d'indicatif avec drapeau */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            borderRight: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            flexShrink: 0
          }}
          aria-label="Sélectionner le pays"
        >
          <FlagIcon countryCode={selectedCountry.code} size={18} />
          <span style={{ color: 'var(--color-secondary-light)', fontSize: '0.85rem' }}>{selectedCountry.dialCode}</span>
          <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        {/* Saisie du numéro local */}
        <input
          id={id}
          name={id}
          type="tel"
          disabled={disabled}
          required={required}
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={placeholder || `ex : ${selectedCountry.example}`}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 14px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />

        {/* Indicateur de validation */}
        {localNumber && (
          <div style={{ display: 'grid', placeItems: 'center', padding: '0 12px', flexShrink: 0 }}>
            {validation.valid ? (
              <Check size={18} style={{ color: 'var(--color-success)' }} />
            ) : (
              <span style={{ fontSize: '0.72rem', color: 'var(--color-danger)', fontWeight: '600' }}>Incomplet</span>
            )}
          </div>
        )}
      </div>

      {/* Libellé d'aide contextuel avec format attendu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>
          {selectedCountry.name} ({selectedCountry.minDigits} chiffres)
        </span>
        <span style={{ color: 'var(--color-secondary-light)', fontFamily: 'monospace' }}>
          Format : {selectedCountry.dialCode} {selectedCountry.example}
        </span>
      </div>

      {/* Modale / Drawer de recherche de pays */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'var(--backdrop-blur)',
            display: 'grid',
            placeItems: 'center',
            padding: '16px'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '460px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              gap: '14px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête de la modale */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={18} color="var(--color-secondary-light)" />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                  Choisir votre pays
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Barre de recherche rapide */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-dark)',
                border: '1px solid var(--color-border)'
              }}
            >
              <Search size={16} color="var(--color-text-secondary)" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher par nom ou indicatif (+225, Bénin...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Liste scrollable des pays */}
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '50vh', paddingRight: '4px' }}>
              {filteredCountries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  Aucun pays trouvé pour &quot;{searchTerm}&quot;.
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = selectedCountry.code === country.code;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isSelected ? 'rgba(79, 209, 197, 0.12)' : 'transparent',
                        border: isSelected ? '1px solid var(--color-secondary-light)' : '1px solid transparent',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FlagIcon countryCode={country.code} size={20} />
                        <div>
                          <div style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem' }}>
                            {country.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            Ex : {country.example}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: '700', color: 'var(--color-secondary-light)', fontSize: '0.88rem' }}>
                        {country.dialCode}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

