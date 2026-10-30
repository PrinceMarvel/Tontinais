/**
 * @file Profile.jsx
 * @description Page de gestion du profil utilisateur et modification sécurisée du mot de passe.
 * @module pages/Profile
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const fieldInputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-primary)',
  fontSize: '0.9rem'
};

const fieldLabelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  marginBottom: '6px',
  color: 'var(--color-text-secondary)',
  fontWeight: '500'
};

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUserData, role } = useAuth();

  const [profileForm, setProfileForm] = useState({ nom: '', prenom: '', telephone: '' });
  const [passwordForm, setPasswordForm] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmNouveauMotDePasse: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setProfileSuccess('');

    try {
      setLoadingProfile(true);
      const res = await api.put('/users/profile', profileForm);
      if (res.success && res.user) {
        updateUserData(res.user);
        setProfileSuccess('Vos coordonnées ont été mises à jour avec succès.');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setPasswordSuccess('');

    if (passwordForm.nouveauMotDePasse.length < 8) {
      setErrorMessage('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (passwordForm.nouveauMotDePasse !== passwordForm.confirmNouveauMotDePasse) {
      setErrorMessage(t('errors.passwordMismatch'));
      return;
    }

    try {
      setLoadingPassword(true);
      const res = await api.put('/users/update-password', {
        ancienMotDePasse: passwordForm.ancienMotDePasse,
        nouveauMotDePasse: passwordForm.nouveauMotDePasse
      });

      if (res.success) {
        setPasswordSuccess('Votre mot de passe a été modifié avec succès.');
        setPasswordForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmNouveauMotDePasse: '' });
        setTimeout(() => setPasswordSuccess(''), 3000);
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoadingPassword(false);
    }
  };

  const roleLabel =
    role === 'SUPER_ADMIN'
      ? 'Super Admin'
      : role === 'CHEF_DE_TONTINE'
      ? t('auth.roleLeader')
      : t('auth.roleMember');

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 20px' }}>
      {/* En-tête profil */}
      <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary))', display: 'grid', placeItems: 'center', color: '#ffffff', fontSize: '1.4rem', fontWeight: '700' }}>
            {user?.prenom?.[0] || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>{user?.prenom} {user?.nom}</h1>
              <span className="badge badge-info">{roleLabel}</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>{user?.email} &bull; Compte actif</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)', marginBottom: '20px', fontSize: '0.9rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulaire Coordonnées Personnelles */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-text-primary)' }}>Informations personnelles</h2>
        {profileSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: 'var(--color-success)', marginBottom: '16px', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} />
            <span>{profileSuccess}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={fieldLabelStyle}>{t('auth.firstNameLabel')}</label>
              <input type="text" value={profileForm.prenom} onChange={(e) => setProfileForm({ ...profileForm, prenom: e.target.value })} style={fieldInputStyle} required />
            </div>
            <div>
              <label style={fieldLabelStyle}>{t('auth.lastNameLabel')}</label>
              <input type="text" value={profileForm.nom} onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })} style={fieldInputStyle} required />
            </div>
          </div>

          <div>
            <label style={fieldLabelStyle}>{t('auth.phoneLabel')}</label>
            <input type="text" value={profileForm.telephone} onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })} style={fieldInputStyle} />
          </div>

          <button type="submit" className="btn btn-secondary" disabled={loadingProfile} style={{ alignSelf: 'flex-start', padding: '10px 18px', fontSize: '0.9rem' }}>
            <Save size={16} />
            <span>{loadingProfile ? t('common.loading') : 'Enregistrer mes informations'}</span>
          </button>
        </form>
      </div>

      {/* Formulaire Modification Mot de passe */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-text-primary)' }}>Sécurité &amp; Mot de passe</h2>
        {passwordSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: 'var(--color-success)', marginBottom: '16px', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={fieldLabelStyle}>Ancien mot de passe</label>
            <input type="password" value={passwordForm.ancienMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, ancienMotDePasse: e.target.value })} style={fieldInputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={fieldLabelStyle}>Nouveau mot de passe (min. 8 car.)</label>
              <input type="password" value={passwordForm.nouveauMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, nouveauMotDePasse: e.target.value })} style={fieldInputStyle} required />
            </div>
            <div>
              <label style={fieldLabelStyle}>Confirmer le mot de passe</label>
              <input type="password" value={passwordForm.confirmNouveauMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, confirmNouveauMotDePasse: e.target.value })} style={fieldInputStyle} required />
            </div>
          </div>

          <button type="submit" className="btn btn-outline" disabled={loadingPassword} style={{ alignSelf: 'flex-start', padding: '10px 18px', fontSize: '0.9rem' }}>
            <Lock size={16} />
            <span>{loadingPassword ? t('common.loading') : 'Mettre à jour mon mot de passe'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
