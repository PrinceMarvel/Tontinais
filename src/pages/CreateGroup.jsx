/**
 * @file CreateGroup.jsx
 * @description Page de création d'un groupe de tontine collaborative avec architecture modulaire et simulation financière.
 * @module pages/CreateGroup
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PlusCircle,
  AlertCircle,
  Sparkles,
  Coins,
  Users,
  Calendar,
  Clock,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api';
import GroupCreatedCard from '../components/GroupCreatedCard';
import GroupSimulationCard from '../components/groups/GroupSimulationCard';

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000];
const QUICK_MEMBERS = [5, 10, 15, 20];

export default function CreateGroup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    montantCotisation: 10000,
    devise: 'XAF',
    frequence: 'MENSUEL',
    dateDemarrage: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    nombreMaxMembres: 10,
    dureeGraceJours: 2
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdGroup, setCreatedGroup] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['montantCotisation', 'nombreMaxMembres', 'dureeGraceJours'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleQuickAmount = (amount) => {
    setFormData((prev) => ({ ...prev, montantCotisation: amount }));
  };

  const handleQuickMembers = (members) => {
    setFormData((prev) => ({ ...prev, nombreMaxMembres: members }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.nom.trim()) {
      setErrorMessage(t('errors.requiredFields'));
      return;
    }

    if (formData.montantCotisation <= 0) {
      setErrorMessage(`${t('groups.contributionAmount')} doit être supérieur à zéro.`);
      return;
    }

    if (formData.nombreMaxMembres < 2 || formData.nombreMaxMembres > 100) {
      setErrorMessage(`${t('groups.maxMembers')} doit être compris entre 2 et 100.`);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/groups', formData);
      if (res.success && res.group) {
        setCreatedGroup(res.group);
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (createdGroup) {
    return <GroupCreatedCard group={createdGroup} />;
  }

  return (
    <div style={{ maxWidth: '860px', margin: '32px auto', padding: '0 20px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '36px 32px' }}>
        {/* En-tête de la page */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--color-text-primary)'
              }}
            >
              <PlusCircle size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>
                {t('groups.createTitle')}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
                {t('groups.createSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Alerte d'erreur */}
        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-danger)',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.92rem'
            }}
          >
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Section 1 : Identité et règles de la tontine */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary-light)' }}>
              <Sparkles size={18} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{t('groups.sectionIdentity')}</h2>
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
                rows={3}
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('groups.descriptionPlaceholder')}
                maxLength={500}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Section 2 : Paramètres financiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary-light)' }}>
              <Coins size={18} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{t('groups.sectionFinancial')}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="montantCotisation">
                  <span>{t('groups.contributionAmount')} <span style={{ color: 'var(--color-accent)' }}>*</span></span>
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
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="devise">
                  {t('groups.currencyLabel')}
                </label>
                <select id="devise" name="devise" className="form-select" value={formData.devise} onChange={handleChange}>
                  <option value="XAF">XAF (FCFA CEMAC)</option>
                  <option value="XOF">XOF (FCFA UEMOA)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="frequence">
                  {t('groups.frequency')}
                </label>
                <select id="frequence" name="frequence" className="form-select" value={formData.frequence} onChange={handleChange}>
                  <option value="MENSUEL">{t('groups.frequencyMonthly')}</option>
                  <option value="BI_MENSUEL">{t('groups.frequencyBiweekly')}</option>
                  <option value="HEBDOMADAIRE">{t('groups.frequencyWeekly')}</option>
                </select>
              </div>
            </div>

            {/* Suggestions rapides de montants */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{t('groups.quickAmounts')}</span>
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAmount(amt)}
                  className={`chip-btn ${formData.montantCotisation === amt ? 'active' : ''}`}
                >
                  {amt.toLocaleString()} {formData.devise}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3 : Calendrier et gouvernance des tours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary-light)' }}>
              <Users size={18} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{t('groups.sectionGovernance')}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="nombreMaxMembres">
                  <span>{t('groups.maxMembers')} (2 - 100) <span style={{ color: 'var(--color-accent)' }}>*</span></span>
                </label>
                <input
                  id="nombreMaxMembres"
                  name="nombreMaxMembres"
                  type="number"
                  min="2"
                  max="100"
                  required
                  className="form-input"
                  value={formData.nombreMaxMembres}
                  onChange={handleChange}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {QUICK_MEMBERS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleQuickMembers(m)}
                      className={`chip-btn ${formData.nombreMaxMembres === m ? 'active' : ''}`}
                    >
                      {m} {t('common.members')}
                    </button>
                  ))}
                </div>
              </div>

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
                <input
                  id="dureeGraceJours"
                  name="dureeGraceJours"
                  type="number"
                  min="0"
                  max="7"
                  className="form-input"
                  value={formData.dureeGraceJours}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Simulateur de cagnotte modulaire */}
          <GroupSimulationCard
            nombreMaxMembres={formData.nombreMaxMembres}
            montantCotisation={formData.montantCotisation}
            devise={formData.devise}
            frequence={formData.frequence}
          />

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              disabled={loading}
            >
              <ArrowLeft size={16} />
              <span>{t('common.cancel')}</span>
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '190px' }}
            >
              {loading ? t('common.loading') : t('groups.submitCreate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
