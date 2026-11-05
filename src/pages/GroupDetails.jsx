/**
 * @file GroupDetails.jsx
 * @description Page détaillée d'une tontine : participants, calendrier des tours et gestion des cotisations.
 * @module pages/GroupDetails
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Users,
  Calendar,
  CreditCard,
  PlusCircle,
  AlertCircle,
  Clock,
  Trash2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GroupHeader from '../components/groups/GroupHeader';
import GroupMembersList from '../components/groups/GroupMembersList';
import GroupPayoutsList from '../components/groups/GroupPayoutsList';
import GroupContributionsList from '../components/groups/GroupContributionsList';
import DeclareContributionModal from '../components/groups/DeclareContributionModal';

export default function GroupDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, role } = useAuth();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [activeTab, setActiveTab] = useState('members');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchGroupData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const groupRes = await api.get(`/groups/${id}`);
      if (groupRes.success) {
        setGroup(groupRes.group);
        setMembers(groupRes.members || []);
      }
      const [pRes, cRes] = await Promise.allSettled([
        api.get(`/payouts/group/${id}`),
        api.get(`/contributions/group/${id}`)
      ]);
      setPayouts(pRes.status === 'fulfilled' && pRes.value?.success ? pRes.value.payouts || [] : []);
      setContributions(cRes.status === 'fulfilled' && cRes.value?.success ? cRes.value.contributions || [] : []);
    } catch (err) {
      setErrorMessage(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  const handleCopyCode = () => {
    if (group?.codeInvitation) {
      navigator.clipboard.writeText(group.codeInvitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const userId = user?._id ? String(user._id) : user?.id ? String(user.id) : null;
  const chefId = group?.chefDeTontine?._id ? String(group.chefDeTontine._id) : group?.chefDeTontine ? String(group.chefDeTontine) : null;
  const isChef = !loading && ((!!chefId && !!userId && chefId === userId) || role === 'SUPER_ADMIN');
  const isMemberActive = !loading && members.some((m) => String(m.user?._id || m.user) === userId && m.statut === 'ACTIF');
  const isMemberPending = !loading && !isChef && members.some((m) => String(m.user?._id || m.user) === userId && m.statut === 'EN_ATTENTE');
  const canDeclareContribution = !loading && (isMemberActive || isChef);

  const handleDeleteGroup = async () => {
    try {
      setDeleting(true);
      const res = await api.delete(`/groups/${id}`);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erreur lors de la suppression de la tontine.');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // Ouverture automatique de la modale si demandée via l'URL (?action=pay)
  useEffect(() => {
    if (searchParams.get('action') === 'pay' && canDeclareContribution) {
      setIsDeclareModalOpen(true);
    }
  }, [searchParams, canDeclareContribution]);

  const tabStyle = (tab) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px clamp(6px, 1.5vw, 14px)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 'clamp(0.78rem, 1.8vw, 0.92rem)',
    color: activeTab === tab ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
    borderBottom: activeTab === tab ? '2px solid var(--color-secondary-light)' : '2px solid transparent'
  });

  if (loading) {
    return <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>{t('common.loading')}</div>;
  }

  if (errorMessage && !group) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <AlertCircle size={32} color="var(--color-danger)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>{t('groups.errorTitle') || 'Erreur'}</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>{errorMessage}</p>
          <Link to="/dashboard" className="btn btn-primary">{t('groups.backToDashboard')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', width: '100%', margin: 'clamp(14px, 2.5vh, 28px) auto', padding: '0 clamp(8px, 2.5vw, 16px)', boxSizing: 'border-box' }}>
      {/* Lien de retour et action Chef */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)'
          }}
        >
          <ArrowLeft size={16} />
          <span>{t('groups.backToDashboard')}</span>
        </Link>

        {isChef && (
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-danger)',
              color: 'var(--color-danger)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <Trash2 size={14} />
            <span>Supprimer la tontine</span>
          </button>
        )}
      </div>

      {/* En-tête avec métriques et partage de code */}
      <GroupHeader
        group={group}
        members={members}
        onCopyCode={handleCopyCode}
        copied={copied}
        showQrModal={showQrModal}
        setShowQrModal={setShowQrModal}
      />

      {/* Message explicatif si l'adhésion est en attente de validation par le Chef */}
      {isMemberPending && (
        <div
          className="animate-fade-in"
          style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid var(--color-warning)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-warning)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.9rem'
          }}
        >
          <Clock size={20} />
          <span>{t('groups.pendingApprovalNotice')}</span>
        </div>
      )}

      {/* Barre d'onglets et actions rapides */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '100%' }}>
          <button type="button" onClick={() => setActiveTab('members')} style={tabStyle('members')}>
            <Users size={16} />
            <span>{t('groups.tabMembers')} ({members.length})</span>
          </button>

          <button type="button" onClick={() => setActiveTab('payouts')} style={tabStyle('payouts')}>
            <Calendar size={16} />
            <span>{t('groups.tabPayouts')} ({payouts.length})</span>
          </button>

          <button type="button" onClick={() => setActiveTab('contributions')} style={tabStyle('contributions')}>
            <CreditCard size={16} />
            <span>{t('groups.tabContributions')} ({contributions.length})</span>
          </button>
        </div>

        {/* Bouton « Payer ma cotisation » toujours visible pour tout participant éligible */}
        {canDeclareContribution && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsDeclareModalOpen(true)}
            style={{ fontSize: '0.84rem', padding: '8px 14px' }}
          >
            <PlusCircle size={15} />
            <span>{t('contributions.declarePayment')}</span>
          </button>
        )}
      </div>

      {/* Contenu de l'onglet actif */}
      {activeTab === 'members' && (
        <GroupMembersList
          members={members}
          isChef={isChef}
          groupId={group._id}
          onMemberUpdated={fetchGroupData}
        />
      )}

      {activeTab === 'payouts' && (
        <GroupPayoutsList
          payouts={payouts}
          isChef={isChef}
          groupId={group._id}
          devise={group.devise}
          onPayoutsUpdated={fetchGroupData}
        />
      )}

      {activeTab === 'contributions' && (
        <GroupContributionsList
          contributions={contributions}
          isChef={isChef}
          groupId={group._id}
          devise={group.devise}
          canDeclareContribution={canDeclareContribution}
          onOpenDeclareModal={() => setIsDeclareModalOpen(true)}
          onContributionUpdated={fetchGroupData}
        />
      )}

      {/* Modale de déclaration de cotisation */}
      <DeclareContributionModal
        isOpen={isDeclareModalOpen}
        onClose={() => setIsDeclareModalOpen(false)}
        groupId={group._id}
        group={group}
        onContributionSuccess={fetchGroupData}
      />

      {/* Modale de confirmation de suppression */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'var(--backdrop-blur)', display: 'grid', placeItems: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: '420px', width: '100%', padding: '24px', textAlign: 'center' }}>
            <Trash2 size={36} color="var(--color-danger)" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--color-text-primary)' }}>Supprimer cette tontine ?</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
              Cette action est irréversible. Le groupe &quot;{group.nom}&quot; et ses données seront définitivement effacés.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary" onClick={handleDeleteGroup} disabled={deleting} style={{ background: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                {deleting ? 'Suppression...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
