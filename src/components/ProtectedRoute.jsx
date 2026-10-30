/**
 * @file ProtectedRoute.jsx
 * @description Sentinelle de sécurisation des routes selon l'authentification et les rôles.
 * @module components/ProtectedRoute
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

/**
 * Composant enveloppeur de protection des routes.
 * @param {Object} props
 * @param {React.ReactNode} props.children Composant enfant à afficher.
 * @param {string[]} [props.allowedRoles] Liste des rôles autorisés à accéder à la route.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Affichage d'un indicateur fluide pendant la vérification du jeton
  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-secondary-light)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          {t('common.loading')}
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirection vers la page de connexion si non connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Contrôle des privilèges d'accès si des rôles spécifiques sont requis
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
