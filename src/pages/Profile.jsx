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
import CountryPhoneInput from '../components/common/CountryPhoneInput';

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
        setProfileSuccess(t('profile.successInfo'));
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
      setErrorMessage(t('profile.passwordMinLength'));
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
        setPasswordSuccess(t('profile.successPassword'));
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
      ? t('auth.roleSuperAdmin')
      : role === 'CHEF_DE_TONTINE'
      ? t('auth.roleLeader')
      : t('auth.roleMember');

  return (
    <div style={{ width: '100%', maxWidth: '760px', margin: 'clamp(14px, 3vh, 28px) auto', padding: '0 clamp(10px, 3.5vw, 20px)', boxSizing: 'border-box' }}>
      {/* En-tête profil */}
      <div className="glass-card animate-fade-in" style={{ padding: 'clamp(14px, 4vw, 22px)', marginBottom: 'clamp(14px, 3vh, 20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-secondary))', display: 'grid', placeItems: 'center', color: '#ffffff', fontSize: '1.35rem', fontWeight: '700', flexShrink: 0 }}>
            {user?.prenom?.[0] || 'U'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.45rem)', margin: 0, color: 'var(--color-text-primary)' }}>
                {user?.prenom} {user?.nom}
              </h1>
              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{roleLabel}</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', marginTop: '4px', marginBotton: 0, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {user?.email} &bull; {t('profile.activeAccount')}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)', marginBottom: '16px', fontSize: '0.88rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulaire Coordonnées Personnelles */}
      <div className="glass-card" style={{ padding: 'clamp(14px, 4vw, 22px)', marginBottom: 'clamp(14px, 3vh, 20px)' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '14px', color: 'var(--color-text-primary)' }}>{t('profile.personalInfoTitle')}</h2>
        {profileSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: 'var(--color-success)', marginBottom: '14px', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{profileSuccess}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
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
            <CountryPhoneInput
              id="telephone"
              value={profileForm.telephone}
              onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-secondary" disabled={loadingProfile} style={{ alignSelf: 'flex-start', padding: '10px 18px', fontSize: '0.88rem' }}>
            <Save size={16} />
            <span>{loadingProfile ? t('common.loading') : t('profile.saveInfo')}</span>
          </button>
        </form>
      </div>

      {/* Formulaire Modification Mot de passe */}
      <div className="glass-card" style={{ padding: 'clamp(14px, 4vw, 22px)' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '14px', color: 'var(--color-text-primary)' }}>{t('profile.securityTitle')}</h2>
        {passwordSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: 'var(--color-success)', marginBottom: '14px', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={fieldLabelStyle}>{t('profile.currentPassword')}</label>
            <input type="password" value={passwordForm.ancienMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, ancienMotDePasse: e.target.value })} style={fieldInputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div>
              <label style={fieldLabelStyle}>{t('profile.newPassword')}</label>
              <input type="password" value={passwordForm.nouveauMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, nouveauMotDePasse: e.target.value })} style={fieldInputStyle} required />
            </div>
            <div>
              <label style={fieldLabelStyle}>{t('profile.confirmPassword')}</label>
              <input type="password" value={passwordForm.confirmNouveauMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, confirmNouveauMotDePasse: e.target.value })} style={fieldInputStyle} required />
            </div>
          </div>

          <button type="submit" className="btn btn-outline" disabled={loadingPassword} style={{ alignSelf: 'flex-start', padding: '10px 18px', fontSize: '0.88rem' }}>
            <Lock size={16} />
            <span>{loadingPassword ? t('common.loading') : t('profile.updatePassword')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
