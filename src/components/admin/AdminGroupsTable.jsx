/**
 * @file AdminGroupsTable.jsx
 * @description Composant modulaire listant l'ensemble des tontines créées pour la supervision globale.
 * @module components/admin/AdminGroupsTable
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminGroupsTable({ groups = [] }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter((g) => {
    const chef = g.chefDeTontine || {};
    const matchesSearch =
      (g.nom && g.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (g.codeInvitation && g.codeInvitation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (chef.nom && chef.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (chef.prenom && chef.prenom.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Barre de recherche */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Search size={18} color="var(--color-text-secondary)" />
        <input
          type="text"
          placeholder="Rechercher par nom de tontine, code ou Chef..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '0.85rem'
          }}
        />
      </div>

      {/* Tableau des groupes */}
      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              <th style={{ padding: '10px 12px' }}>Tontine</th>
              <th style={{ padding: '10px 12px' }}>Chef de Tontine</th>
              <th style={{ padding: '10px 12px' }}>Paramètres</th>
              <th style={{ padding: '10px 12px' }}>Statut</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-secondary)' }}>
                  Aucune tontine enregistrée.
                </td>
              </tr>
            ) : (
              filteredGroups.map((group) => {
                const chef = group.chefDeTontine || {};

                return (
                  <tr
                    key={group._id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                        {group.nom}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-light)' }}>
                        Code : <strong>{group.codeInvitation}</strong>
                      </div>
                    </td>

                    <td style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>
                      <div>{chef.prenom ? `${chef.prenom} ${chef.nom}` : 'Chef non assigné'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {chef.email}
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>
                        {group.montantCotisation?.toLocaleString()} {group.devise}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {group.frequence} &bull; Max {group.nombreMaxMembres} pers.
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        {group.statut || 'ACTIF'}
                      </span>
                    </td>

                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <Link
                        to={`/groups/${group._id}`}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <span>Détails</span>
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
