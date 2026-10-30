/**
 * @file api.js
 * @description Client HTTP sécurisé pour communiquer avec l'API RESTful TontiNaïs.
 * @module services/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Récupère les jetons d'authentification stockés.
 * @returns {{ token: string | null, refreshToken: string | null }}
 */
export const getStoredTokens = () => ({
  token: localStorage.getItem('tontinais_token'),
  refreshToken: localStorage.getItem('tontinais_refresh_token')
});

/**
 * Enregistre les jetons d'authentification dans le stockage local.
 * @param {string} token Jeton d'accès JWT.
 * @param {string} [refreshToken] Jeton de rafraîchissement JWT.
 */
export const storeTokens = (token, refreshToken) => {
  if (token) localStorage.setItem('tontinais_token', token);
  if (refreshToken) localStorage.setItem('tontinais_refresh_token', refreshToken);
};

/**
 * Supprime les jetons stockés lors de la déconnexion.
 */
export const clearStoredTokens = () => {
  localStorage.removeItem('tontinais_token');
  localStorage.removeItem('tontinais_refresh_token');
  localStorage.removeItem('tontinais_user');
};

/**
 * Tente de renouveler le jeton d'accès via le refresh token.
 * @returns {Promise<string | null>} Nouveau jeton d'accès ou null en cas d'échec.
 */
const refreshAccessToken = async () => {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      clearStoredTokens();
      return null;
    }

    const data = await response.json();
    if (data.success && data.token) {
      storeTokens(data.token, data.refreshToken);
      return data.token;
    }
  } catch (err) {
    console.error('Erreur lors du rafraîchissement du jeton :', err);
  }

  clearStoredTokens();
  return null;
};

/**
 * Exécute une requête HTTP avec gestion automatique des en-têtes et des jetons.
 * @param {string} endpoint Chemin relatif de l'API (ex: '/auth/login').
 * @param {RequestInit} [options={}] Options fetch standard.
 * @param {boolean} [isRetry=false] Indique s'il s'agit d'une nouvelle tentative.
 * @returns {Promise<any>} Données JSON retournées par l'API.
 */
export const request = async (endpoint, options = {}, isRetry = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const { token } = getStoredTokens();

  const headers = {
    ...options.headers
  };

  // Ajout de Content-Type sauf si envoi d'un FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  // Injection du jeton Bearer si présent
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Gestion de l'expiration du jeton (401)
  if (response.status === 401 && !isRetry && !endpoint.includes('/auth/')) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`
      };
      return request(endpoint, { ...options, headers: retryHeaders }, true);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.error || data.message || `Erreur serveur (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options
    }),
  put: (endpoint, body, options) =>
    request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options
    }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
  upload: (endpoint, formData, options) =>
    request(endpoint, { method: 'POST', body: formData, ...options })
};

export default api;
