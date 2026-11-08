/**
 * @file api.js
 * @description Client HTTP sécurisé et résilient pour communiquer avec l'API RESTful TontiNaïs.
 * Gère les timeouts sur réseau mobile lent, l'état hors-ligne et la résolution dynamique d'adresse IP.
 * @module services/api
 */

/**
 * Résout dynamiquement l'URL de l'API pour les tests sur smartphone via Wi-Fi/point d'accès.
 * @returns {string} URL de base de l'API.
 */
const getBaseApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:5001/api`;
    }
  }
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getBaseApiUrl();
const DEFAULT_TIMEOUT_MS = 12000; // 12 secondes adaptées aux réseaux 3G/4G

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
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal
    });
    clearTimeout(timer);

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
    console.warn('Erreur rafraîchissement jeton :', err.message);
  }

  clearStoredTokens();
  return null;
};

/**
 * Exécute une requête HTTP avec gestion automatique des en-têtes, jetons et timeout réseau.
 * @param {string} endpoint Chemin relatif de l'API (ex: '/auth/login').
 * @param {RequestInit & { timeoutMs?: number }} [options={}] Options fetch standard.
 * @param {boolean} [isRetry=false] Indique s'il s'agit d'une nouvelle tentative.
 * @returns {Promise<any>} Données JSON retournées par l'API.
 */
export const request = async (endpoint, options = {}, isRetry = false) => {
  // Détection proactive de l'état hors-ligne sur smartphone
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Aucune connexion Internet détectée. Activez vos données mobiles ou le Wi-Fi.');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const { token } = getStoredTokens();

  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error("Délai d'attente dépassé (connexion mobile lente). Vérifiez votre réseau.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

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
