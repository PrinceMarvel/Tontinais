/**
 * @file CreateGroupSteps.jsx
 * @description Composants modulaires des étapes du Wizard de création de tontine.
 * @module components/groups/CreateGroupSteps
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Coins,
  Calendar,
  Users,
  ShieldCheck,
  Globe2,
  Clock,
  PiggyBank,
  HeartHandshake,
  Briefcase,
  AlertTriangle,
  Minus,
  Plus
} from 'lucide-react';
import GroupSimulationCard from './GroupSimulationCard';

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000];
const QUICK_MEMBERS = [5, 10, 15, 20];
const GRACE_OPTIONS = [0, 1, 2, 3, 5];

const CURRENCIES = [
  { code: 'XAF', label: 'XAF (FCFA CEMAC)', zone: 'Afrique Centrale' },
  { code: 'XOF', label: 'XOF (FCFA UEMOA)', zone: 'Afrique de l\'Ouest' },
  { code: 'EUR', label: 'EUR (€)', zone: 'Zone Euro' },
  { code: 'USD', label: 'USD ($)', zone: 'International' }
];

const FREQUENCIES = [
  {
    code: 'MENSUEL',
    labelKey: 'groups.frequencyMonthly',
    descKey: 'Rythme mensuel régulier (Recommandé)',
    icon: Calendar
  },
  {
    code: 'BI_MENSUEL',
    labelKey: 'groups.frequencyBiweekly',
    descKey: 'Deux versements par mois (Tous les 15 jours)',
    icon: Clock
  },
  {
    code: 'HEBDOMADAIRE',
    labelKey: 'groups.frequencyWeekly',
    descKey: 'Cotisation chaque semaine (Idéal commerce)',
    icon: Coins
  }
];

export function StepIdentity({ formData, handleChange }) {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-secondary-light)' }}>
        <Sparkles size={20} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('groups.sectionIdentity')}</h2>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="nom">
          <span>{t('groups.groupName')} <span style={{ color: 'var(--color-accent)' }}>*</span></span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Max 80 caractères</span>
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          className="form-input"
          value={formData.nom}
          onChange={handleChange}
          placeholder={t('groups.groupNamePlaceholder')}
          maxLength={80}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          <span>{t('groups.groupDescription')}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Optionnel</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder={t('groups.descriptionPlaceholder')}
          maxLength={500}
          style={{ resize: 'vertical' }}
        />
      </div>
    </div>
  );
}

export function StepFinancial({ formData, handleChange, setFormData }) {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-secondary-light)' }}>
        <Coins size={20} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('groups.sectionFinancial')}</h2>
      </div>

      {/* Montant de la cotisation */}
      <div className="form-group">
        <label className="form-label" htmlFor="montantCotisation">
          <span>{t('groups.contributionAmount')} <span style={{ color: 'var(--color-accent)' }}>*</span></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-light)', fontWeight: '700' }}>
            {Number(formData.montantCotisation || 0).toLocaleString()} {formData.devise}
          </span>
        </label>
        <input
          id="montantCotisation"
          name="montantCotisation"
          type="number"
          min="100"
          step="500"
          required
          className="form-input"
          value={formData.montantCotisation}
          onChange={handleChange}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('groups.quickAmounts')}</span>
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, montantCotisation: amt }))}
              className={`chip-btn ${formData.montantCotisation === amt ? 'active' : ''}`}
            >
              {amt.toLocaleString()} {formData.devise}
            </button>
          ))}
        </div>
      </div>

      {/* Sélection de la devise par cartes sombres */}
      <div className="form-group">
        <label className="form-label">
          <span>{t('groups.currencyLabel')}</span>
        </label>
        <div className="select-grid">
          {CURRENCIES.map((c) => {
            const isSelected = formData.devise === c.code;
            return (
              <div
                key={c.code}
                className={`select-card ${isSelected ? 'active' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, devise: c.code }))}
              >
                <div className="select-card-header">
                  <div className="select-card-icon">
                    <Globe2 size={16} />
                  </div>
                  <div className="select-card-radio">
                    {isSelected && <div className="select-card-radio-inner" />}
                  </div>
                </div>
                <span className="select-card-title">{c.label}</span>
                <span className="select-card-desc">{c.zone}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sélection de la fréquence par cartes sombres */}
      <div className="form-group">
        <label className="form-label">
          <span>{t('groups.frequency')}</span>
        </label>
        <div className="select-grid">
          {FREQUENCIES.map((f) => {
            const isSelected = formData.frequence === f.code;
            const IconComponent = f.icon;
            return (
              <div
                key={f.code}
                className={`select-card ${isSelected ? 'active' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, frequence: f.code }))}
              >
                <div className="select-card-header">
                  <div className="select-card-icon">
                    <IconComponent size={16} />
                  </div>
                  <div className="select-card-radio">
                    {isSelected && <div className="select-card-radio-inner" />}
                  </div>
                </div>
                <span className="select-card-title">{t(f.labelKey)}</span>
                <span className="select-card-desc">{f.descKey}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StepGovernance({ formData, handleChange, setFormData }) {
  const { t } = useTranslation();

  const handleMemberChange = (delta) => {
    setFormData((prev) => {
      const nextVal = Math.min(100, Math.max(2, (Number(prev.nombreMaxMembres) || 2) + delta));
      return { ...prev, nombreMaxMembres: nextVal };
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-secondary-light)' }}>
        <ShieldCheck size={20} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('groups.sectionGovernance')}</h2>
      </div>

      {/* Nombre de participants avec contrôle - / + */}
      <div className="form-group">
        <label className="form-label" htmlFor="nombreMaxMembres">
          <span>{t('groups.maxMembers')} (2 - 100) <span style={{ color: 'var(--color-accent)' }}>*</span></span>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div className="member-stepper-control">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => handleMemberChange(-1)}
              disabled={formData.nombreMaxMembres <= 2}
            >
              <Minus size={16} />
            </button>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', minWidth: '40px', textAlign: 'center' }}>
              {formData.nombreMaxMembres}
            </span>
            <button
              type="button"
              className="stepper-btn"
              onClick={() => handleMemberChange(1)}
              disabled={formData.nombreMaxMembres >= 100}
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {QUICK_MEMBERS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, nombreMaxMembres: m }))}
                className={`chip-btn ${formData.nombreMaxMembres === m ? 'active' : ''}`}
              >
                {m} {t('common.members')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date de démarrage et délai de grâce */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="dateDemarrage">
            <span>{t('groups.startDate')} <span style={{ color: 'var(--color-accent)' }}>*</span></span>
          </label>
          <input
            id="dateDemarrage"
            name="dateDemarrage"
            type="date"
            required
            className="form-input"
            value={formData.dateDemarrage}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dureeGraceJours">
            <span>{t('groups.graceDays')} (0 - 7)</span>
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {GRACE_OPTIONS.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, dureeGraceJours: days }))}
                className={`chip-btn ${formData.dureeGraceJours === days ? 'active' : ''}`}
              >
                {days} {t('common.days')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carte de simulation financière intégrée */}
      <GroupSimulationCard
        nombreMaxMembres={formData.nombreMaxMembres}
        montantCotisation={formData.montantCotisation}
        devise={formData.devise}
        frequence={formData.frequence}
      />
    </div>
  );
}

