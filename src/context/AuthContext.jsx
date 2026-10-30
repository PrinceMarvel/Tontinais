/**
 * @file AuthContext.jsx
 * @description Contexte d'authentification globale React pour l'application TontiNaïs.
 * @module context/AuthContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { storeTokens, clearStoredTokens, getStoredTokens } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tontinais_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => getStoredTokens().token);
  const [loading, setLoading] = useState(true);

  // Synchronisation du profil utilisateur au montage si un jeton existe
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const { token: currentToken } = getStoredTokens();
      if (!currentToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (isMounted && response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('tontinais_user', JSON.stringify(response.user));
        }
      } catch (err) {
        console.warn('Session expirée ou invalide :', err.message);
        if (isMounted) {
          clearStoredTokens();
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Connecte l'utilisateur avec ses identifiants.
   * @param {string} email Adresse e-mail.
   * @param {string} motDePasse Mot de passe en clair.
   */
  const login = useCallback(async (email, motDePasse) => {
    const response = await api.post('/auth/login', { email, motDePasse });
    if (response.success) {
      storeTokens(response.token, response.refreshToken);
      localStorage.setItem('tontinais_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }, []);

  /**
   * Enregistre un nouvel utilisateur.
   * @param {Object} userData Données du profil d'inscription.
   */
  const register = useCallback(async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.success) {
      storeTokens(response.token, response.refreshToken);
      localStorage.setItem('tontinais_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }, []);

  /**
   * Déconnecte l'utilisateur et nettoie le stockage local.
   */
  const logout = useCallback(async () => {
    const { refreshToken } = getStoredTokens();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.warn('Erreur lors de la déconnexion distante :', err.message);
    } finally {
      clearStoredTokens();
      setUser(null);
      setToken(null);
    }
  }, []);

  /**
   * Met à jour les données du profil dans le contexte et le stockage.
   * @param {Object} updatedFields Données mises à jour.
   */
  const updateUserData = useCallback((updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem('tontinais_user', JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    role: user?.role || 'MEMBRE',
    login,
    register,
    logout,
    updateUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d\'un AuthProvider.');
  }
  return context;
};

export default AuthContext;
