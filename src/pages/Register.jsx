/**
 * @file Register.jsx
 * @description Page d'inscription intégrant le Design System unifié et le logo officiel TontiNaïs.
 * @module pages/Register
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmMotDePasse: '',
    role: 'MEMBRE'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const { nom, prenom, email, telephone, motDePasse, confirmMotDePasse, role } = formData;

    if (!nom.trim() || !prenom.trim() || !email.trim() || !telephone.trim() || !motDePasse) {
      setErrorMessage(t('errors.requiredFields'));
      return;
    }

    if (motDePasse.length < 8) {
      setErrorMessage(t('auth.passwordPlaceholder'));
      return;
    }

    if (motDePasse !== confirmMotDePasse) {
      setErrorMessage(t('errors.passwordMismatch'));
      return;
    }

    try {
      setLoading(true);
      await register({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        motDePasse,
        role
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px 16px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '36px 28px' }}>
        {/* En-tête de carte avec Logo Officiel et Sélecteur de Langue */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Logo size={36} showText={true} />
          <LanguageSelector />
        </div>

        <h1 style={{ fontSize: '1.6rem', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
          {t('auth.registerTitle')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
          {t('auth.registerSubtitle')}
        </p>

        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-danger)',
              marginBottom: '20px',
              fontSize: '0.85rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label htmlFor="prenom" className="label">{t('auth.firstNameLabel')}</label>
              <input id="prenom" name="prenom" type="text" className="input" value={formData.prenom} onChange={handleChange} placeholder={t('auth.firstNamePlaceholder')} required />
            </div>
            <div>
              <label htmlFor="nom" className="label">{t('auth.lastNameLabel')}</label>
              <input id="nom" name="nom" type="text" className="input" value={formData.nom} onChange={handleChange} placeholder={t('auth.lastNamePlaceholder')} required />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">{t('auth.emailLabel')}</label>
            <input id="email" name="email" type="email" className="input" value={formData.email} onChange={handleChange} placeholder={t('auth.emailPlaceholder')} required />
          </div>

          <div>
            <label htmlFor="telephone" className="label">{t('auth.phoneLabel')}</label>
            <input id="telephone" name="telephone" type="tel" className="input" value={formData.telephone} onChange={handleChange} placeholder={t('auth.phonePlaceholder')} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label htmlFor="motDePasse" className="label">{t('auth.passwordLabel')}</label>
              <input id="motDePasse" name="motDePasse" type="password" className="input" value={formData.motDePasse} onChange={handleChange} placeholder="8+ caractères" required />
            </div>
            <div>
              <label htmlFor="confirmMotDePasse" className="label">{t('auth.confirmPasswordLabel')}</label>
              <input id="confirmMotDePasse" name="confirmMotDePasse" type="password" className="input" value={formData.confirmMotDePasse} onChange={handleChange} placeholder="Confirmer" required />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="label">{t('auth.roleLabel')}</label>
            <select id="role" name="role" className="input" value={formData.role} onChange={handleChange}>
              <option value="MEMBRE">{t('auth.roleMember')}</option>
              <option value="CHEF_DE_TONTINE">{t('auth.roleLeader')}</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}>
            <UserPlus size={18} />
            <span>{loading ? t('common.loading') : t('auth.submitRegister')}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          <span>{t('auth.alreadyAccount')} </span>
          <Link to="/login" style={{ fontWeight: '600' }}>{t('auth.submitLogin')}</Link>
        </div>
      </div>
    </div>
  );
}
