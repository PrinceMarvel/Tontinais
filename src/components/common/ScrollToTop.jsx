/**
 * @file ScrollToTop.jsx
 * @description Réinitialise automatiquement le défilement (scroll) au sommet de la page à chaque changement d'itinéraire.
 * Respecte les standards d'ergonomie Web pour les applications monopages (SPA).
 * @module components/common/ScrollToTop
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Réinitialise immédiatement le défilement vertical et horizontal de la fenêtre
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Fallback pour compatibilité accrue sur navigateurs mobiles (iOS Safari / Android Chrome)
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

