/**
 * @file CreateGroup.jsx
 * @description Page de création d'un nouveau groupe de tontine collaborative avec simulation financière en temps réel.
 * @module pages/CreateGroup
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import GroupCreatedCard from '../components/GroupCreatedCard';
import GroupSimulationCard from '../components/groups/GroupSimulationCard';

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
      [name]: name === 'montantCotisation' || name === 'nombreMaxMembres' || name === 'dureeGraceJours'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.nom.trim()) {
      setErrorMessage(t('errors.requiredFields'));
      return;
    }

    if (formData.montantCotisation <= 0) {
      setErrorMessage(t('groups.contributionAmount') + ' doit être supérieur à zéro.');
      return;
    }

    if (formData.nombreMaxMembres < 2 || formData.nombreMaxMembres > 100) {
      setErrorMessage(t('groups.maxMembers') + ' doit être compris entre 2 et 100.');
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
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 20px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '36px 32px' }}>
        {/* En-tête du formulaire */}
        <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--color-border)', paddingBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                display: 'grid',
                placeItems: 'center',
                color: '#ffffff'
              }}
            >
              <PlusCircle size={22} />
            </div>
            <h1 style={{ fontSize: '1.7rem', color: 'var(--color-text-primary)' }}>
              {t('groups.createTitle')}
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            {t('groups.createSubtitle')}
          </p>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(229, 62, 62, 0.15)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Nom du groupe */}
          <div className="form-group">
            <label className="form-label" htmlFor="nom">
              {t('groups.groupName')} *
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

          {/* Description et règles */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              {t('groups.groupDescription')}
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('groups.descriptionPlaceholder')}
              maxLength={500}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Paramètres financiers : Montant, Devise, Fréquence */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="montantCotisation">
                {t('groups.contributionAmount')} *
              </label>
              <input
                id="montantCotisation"
                name="montantCotisation"
                type="number"
                min="100"
                step="100"
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
              <select id="devise" name="devise" className="form-input" value={formData.devise} onChange={handleChange}>
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
              <select id="frequence" name="frequence" className="form-input" value={formData.frequence} onChange={handleChange}>
                <option value="MENSUEL">{t('groups.frequencyMonthly')}</option>
                <option value="BI_MENSUEL">{t('groups.frequencyBiweekly')}</option>
                <option value="HEBDOMADAIRE">{t('groups.frequencyWeekly')}</option>
              </select>
            </div>
          </div>

          {/* Paramètres d'organisation : Membres, Date, Délai de grâce */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="nombreMaxMembres">
                {t('groups.maxMembers')} (2 - 100) *
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
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dateDemarrage">
                {t('groups.startDate')} *
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
                {t('groups.graceDays')} (0 - 7)
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

          {/* Simulateur de cagnotte en temps réel modulaire */}
          <GroupSimulationCard
            nombreMaxMembres={formData.nombreMaxMembres}
            montantCotisation={formData.montantCotisation}
            devise={formData.devise}
          />

          {/* Actions du formulaire */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '180px' }}
            >
              {loading ? t('common.loading') : t('groups.submitCreate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
