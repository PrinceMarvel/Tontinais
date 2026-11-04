/**
 * @file CreateGroup.jsx
 * @description Page de création d'un groupe de tontine orchestrée sous forme de Wizard guidé interactif.
 * @module pages/CreateGroup
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PlusCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Coins,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import GroupCreatedCard from '../components/GroupCreatedCard';
import { StepIdentity, StepFinancial, StepGovernance } from '../components/groups/CreateGroupSteps';
import '../components/groups/CreateGroup.css';

const STEPS = [
  { id: 1, labelKey: 'groups.sectionIdentity', icon: Sparkles },
  { id: 2, labelKey: 'groups.sectionFinancial', icon: Coins },
  { id: 3, labelKey: 'groups.sectionGovernance', icon: ShieldCheck }
];

export default function CreateGroup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
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

  const validateCurrentStep = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!formData.nom.trim()) {
        setErrorMessage(t('errors.requiredFields'));
        return false;
      }
    }
    if (currentStep === 2) {
      if (formData.montantCotisation <= 0) {
        setErrorMessage(`${t('groups.contributionAmount')} doit être supérieur à zéro.`);
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.nombreMaxMembres < 2 || formData.nombreMaxMembres > 100) {
        setErrorMessage(`${t('groups.maxMembers')} doit être compris entre 2 et 100.`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
    }
  };

  const handlePrev = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

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

  // Largeur dynamique de la barre de progression
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="create-group-container">
      <div className="glass-card animate-fade-in create-group-card">
        {/* En-tête avec Stepper guidé */}
        <div className="create-group-header">
          <h1>{t('groups.createTitle')}</h1>
          <p>{t('groups.createSubtitle')}</p>
        </div>

        {/* Barre de progression Stepper */}
        <div className="wizard-stepper">
          <div className="wizard-progress-bar" style={{ width: `calc(${progressPercent}% * 0.88)` }} />
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const IconComponent = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                className={`wizard-step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (step.id < currentStep || validateCurrentStep()) {
                    setCurrentStep(step.id);
                  }
                }}
              >
                <div className="wizard-step-circle">
                  {isCompleted ? <CheckCircle2 size={20} /> : <IconComponent size={18} />}
                </div>
                <span className="wizard-step-label">{t(step.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Badge d'étape actif sur smartphone pour une lisibilité sans débordement */}
        <div className="wizard-mobile-step-badge">
          <span>
            {t('groups.stepIndicator', { current: currentStep, total: STEPS.length })} :{' '}
            <strong>{t(STEPS[currentStep - 1].labelKey)}</strong>
          </span>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-danger)',
              marginBottom: '24px',
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

        <form onSubmit={handleSubmit}>
          {/* Contenu de l'étape active */}
          <div style={{ minHeight: '340px' }}>
            {currentStep === 1 && (
              <StepIdentity formData={formData} handleChange={handleChange} />
            )}
            {currentStep === 2 && (
              <StepFinancial formData={formData} handleChange={handleChange} setFormData={setFormData} />
            )}
            {currentStep === 3 && (
              <StepGovernance formData={formData} handleChange={handleChange} setFormData={setFormData} />
            )}
          </div>

          {/* Barre d'action de navigation */}
          <div className="create-group-actions">
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
                disabled={loading}
              >
                <ArrowLeft size={16} />
                <span>{t('common.cancel')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-secondary"
                disabled={loading}
              >
                <ArrowLeft size={16} />
                <span>{t('common.previous')}</span>
              </button>
            )}

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                <span>{t('common.continue')}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))'
                }}
              >
                {loading ? (
                  <span>{t('common.loading')}</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>{t('groups.submitCreate')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
