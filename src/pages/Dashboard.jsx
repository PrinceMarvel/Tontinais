/**
 * @file Dashboard.jsx
 * @description Tableau de bord principal présentant les tontines actives et indicateurs financiers avec Skeleton Loaders.
 * @module pages/Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Wallet,
  Calendar,
  PlusCircle,
  Key,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { SkeletonCard, SkeletonKPI } from '../components/common/Skeleton';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await api.get('/groups');
      if (data.success && Array.isArray(data.groups)) {
        setGroups(data.groups);
      }
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const activeGroupsCount = groups.filter((g) => g.membershipStatus === 'ACTIF').length;
  const totalCotisations = groups.reduce((acc, g) => acc + (g.montantCotisation || 0), 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* En-tête de bienvenue */}
      <div className="glass-card animate-fade-in" style={{ padding: '28px 24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              {t('dashboard.welcome')}, {user?.prenom} !
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              {t('dashboard.welcomeSubtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(role === 'CHEF_DE_TONTINE' || role === 'SUPER_ADMIN') && (
              <Link to="/groups/create" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                <PlusCircle size={16} />
                <span>{t('nav.createGroup')}</span>
              </Link>
            )}
            <Link to="/groups/join" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <Key size={16} />
              <span>{t('nav.joinGroup')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cartes KPI Financières avec Squelettes animés au chargement */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {loading ? (
          <>
            <SkeletonKPI />
            <SkeletonKPI />
            <SkeletonKPI />
          </>
        ) : (
          <>
            <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'rgba(49, 151, 149, 0.16)', display: 'grid', placeItems: 'center', color: 'var(--color-secondary-light)', border: '1px solid rgba(79, 209, 197, 0.25)' }}>
                <Users size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{t('dashboard.kpiActiveGroups')}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>{activeGroupsCount}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'rgba(237, 137, 54, 0.16)', display: 'grid', placeItems: 'center', color: 'var(--color-accent)', border: '1px solid rgba(237, 137, 54, 0.25)' }}>
                <Wallet size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{t('dashboard.kpiTotalSavings')}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>{totalCotisations.toLocaleString()} XAF</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.16)', display: 'grid', placeItems: 'center', color: 'var(--color-info)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                <Calendar size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{t('dashboard.kpiNextRound')}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>{activeGroupsCount > 0 ? t('dashboard.statusActive') : '-'}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Titre de section */}
      <h2 style={{ fontSize: '1.3rem', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
        {t('dashboard.myGroupsTitle')}
      </h2>

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)', marginBottom: '20px' }}>
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : groups.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(49, 151, 149, 0.12)', display: 'grid', placeItems: 'center', color: 'var(--color-secondary-light)', marginBottom: '8px' }}>
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>{t('dashboard.noGroupsTitle')}</h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', fontSize: '0.9rem' }}>{t('dashboard.noGroupsSubtitle')}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(role === 'CHEF_DE_TONTINE' || role === 'SUPER_ADMIN') && (
              <Link to="/groups/create" className="btn btn-primary">
                <PlusCircle size={16} />
                <span>{t('dashboard.createFirstGroup')}</span>
              </Link>
            )}
            <Link to="/groups/join" className="btn btn-secondary">
              <Key size={16} />
              <span>{t('dashboard.joinWithCode')}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {groups.map((group) => {
            const isActif = group.membershipStatus === 'ACTIF';
            return (
              <div key={group._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)' }}>{group.nom}</h3>
                    <span className={`badge ${isActif ? 'badge-success' : 'badge-warning'}`}>
                      {isActif ? t('dashboard.statusActive') : t('dashboard.statusPending')}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '16px' }}>
                    {group.description || t('home.heroSubtitle')}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t('common.amount')}</div>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-secondary-light)' }}>
                        {group.montantCotisation?.toLocaleString()} {group.devise}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t('groups.frequency')}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{group.frequence}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Code : <strong style={{ color: 'var(--color-text-primary)' }}>{group.codeInvitation}</strong>
                  </span>
                  <Link to={`/groups/${group._id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <span>{t('dashboard.viewDetails')}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
