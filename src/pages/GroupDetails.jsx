/**
 * @file GroupDetails.jsx
 * @description Page détaillée d'une tontine : participants, calendrier des tours et gestion des cotisations.
 * @module pages/GroupDetails
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Users,
  Calendar,
  CreditCard,
  PlusCircle,
  AlertCircle,
  Clock
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

  const fetchGroupData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const groupRes = await api.get(`/groups/${id}`);
      if (groupRes.success) {
        setGroup(groupRes.group);
        setMembers(groupRes.members || []);
      }

      try {
        const payoutsRes = await api.get(`/payouts/group/${id}`);
        if (payoutsRes.success) {
          setPayouts(payoutsRes.payouts || []);
        }
      } catch {
        setPayouts([]);
      }

      try {
        const contribRes = await api.get(`/contributions/group/${id}`);
        if (contribRes.success) {
          setContributions(contribRes.contributions || []);
        }
      } catch {
        setContributions([]);
      }
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

  // Identification robuste de l'utilisateur avec support conjoint de _id et id
  const userId = user?._id ? String(user._id) : user?.id ? String(user.id) : null;

  const chefId = group?.chefDeTontine?._id
    ? String(group.chefDeTontine._id)
    : group?.chefDeTontine
    ? String(group.chefDeTontine)
    : null;

  const isChef =
    !loading &&
    ((!!chefId && !!userId && chefId === userId) ||
      role === 'SUPER_ADMIN');

  const isMemberActive =
    !loading &&
    members.some((m) => {
      const memberId = m.user?._id ? String(m.user._id) : m.user ? String(m.user) : null;
      return !!memberId && !!userId && memberId === userId && m.statut === 'ACTIF';
    });

  const isMemberPending =
    !loading &&
    !isChef &&
    members.some((m) => {
      const memberId = m.user?._id ? String(m.user._id) : m.user ? String(m.user) : null;
      return !!memberId && !!userId && memberId === userId && m.statut === 'EN_ATTENTE';
    });

  // Le bouton cotiser est affiché pour le chef et tout membre actif
  const canDeclareContribution = !loading && (isMemberActive || isChef);

  // Ouverture automatique de la modale si demandée via l'URL (?action=pay)
  useEffect(() => {
    if (searchParams.get('action') === 'pay' && canDeclareContribution) {
      setIsDeclareModalOpen(true);
    }
  }, [searchParams, canDeclareContribution]);

  const tabStyle = (tab) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    color: activeTab === tab ? 'var(--color-secondary-light)' : 'var(--color-text-secondary)',
    borderBottom: activeTab === tab ? '2px solid var(--color-secondary-light)' : '2px solid transparent'
  });

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        {t('common.loading')}
      </div>
    );
  }

  if (errorMessage && !group) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <AlertCircle size={32} color="var(--color-danger)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Erreur</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>{errorMessage}</p>
          <Link to="/dashboard" className="btn btn-primary">
            {t('groups.backToDashboard')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 20px' }}>
      {/* Lien de retour */}
      <div style={{ marginBottom: '18px' }}>
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setActiveTab('members')} style={tabStyle('members')}>
            <Users size={18} />
            <span>{t('groups.tabMembers')} ({members.length})</span>
          </button>

          <button type="button" onClick={() => setActiveTab('payouts')} style={tabStyle('payouts')}>
            <Calendar size={18} />
            <span>{t('groups.tabPayouts')} ({payouts.length})</span>
          </button>

          <button type="button" onClick={() => setActiveTab('contributions')} style={tabStyle('contributions')}>
            <CreditCard size={18} />
            <span>{t('groups.tabContributions')} ({contributions.length})</span>
          </button>
        </div>

        {/* Bouton « Payer ma cotisation » toujours visible pour tout participant éligible */}
        {canDeclareContribution && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsDeclareModalOpen(true)}
            style={{ fontSize: '0.85rem' }}
          >
            <PlusCircle size={16} />
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
    </div>
  );
}
