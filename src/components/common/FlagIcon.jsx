/**
 * @file FlagIcon.jsx
 * @description Drapeaux vectoriels SVG autonomes pour tous les pays officiels de TontiNaïs.
 * Fonctionne 100% hors-ligne sur tous les écrans (Android, iOS, Windows) sans dépendre d'une police émoji.
 * @module components/common/FlagIcon
 */

import React from 'react';

export default function FlagIcon({ countryCode = 'CI', size = 20, style = {}, className = '' }) {
  const code = (countryCode || 'CI').toUpperCase();
  const width = Math.round(size * 1.35);
  const height = size;

  const baseStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '3px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    flexShrink: 0,
    ...style
  };

  const renderFlag = () => {
    switch (code) {
      case 'CI': // Côte d'Ivoire (Orange, Blanc, Vert)
        return (
          <>
            <rect width="16" height="36" fill="#F77F00" />
            <rect x="16" width="16" height="36" fill="#FFFFFF" />
            <rect x="32" width="16" height="36" fill="#009A44" />
          </>
        );
      case 'SN': // Sénégal (Vert, Jaune, Rouge + étoile verte)
        return (
          <>
            <rect width="16" height="36" fill="#00853F" />
            <rect x="16" width="16" height="36" fill="#FDEF42" />
            <rect x="32" width="16" height="36" fill="#E31B23" />
            <polygon points="24,12 26,18 32,18 27,21 29,27 24,23 19,27 21,21 16,18 22,18" fill="#00853F" />
          </>
        );
      case 'BJ': // Bénin (Vert à gauche, Jaune et Rouge à droite)
        return (
          <>
            <rect width="19" height="36" fill="#008751" />
            <rect x="19" width="29" height="18" fill="#FCD116" />
            <rect x="19" y="18" width="29" height="18" fill="#E8112D" />
          </>
        );
      case 'CM': // Cameroun (Vert, Rouge, Jaune + étoile jaune)
        return (
          <>
            <rect width="16" height="36" fill="#007A5E" />
            <rect x="16" width="16" height="36" fill="#CE1126" />
            <rect x="32" width="16" height="36" fill="#FCD116" />
            <polygon points="24,13 25.5,17.5 30,17.5 26.5,20 28,24.5 24,22 20,24.5 21.5,20 18,17.5 22.5,17.5" fill="#FCD116" />
          </>
        );
      case 'TG': // Togo (5 bandes vert/jaune + canton rouge et étoile blanche)
        return (
          <>
            <rect width="48" height="7.2" fill="#006A4E" />
            <rect y="7.2" width="48" height="7.2" fill="#FFCE00" />
            <rect y="14.4" width="48" height="7.2" fill="#006A4E" />
            <rect y="21.6" width="48" height="7.2" fill="#FFCE00" />
            <rect y="28.8" width="48" height="7.2" fill="#006A4E" />
            <rect width="20" height="21.6" fill="#D21034" />
            <polygon points="10,4 12,9 17,9 13,12 15,17 10,14 5,17 7,12 3,9 8,9" fill="#FFFFFF" />
          </>
        );
      case 'BF': // Burkina Faso (Rouge, Vert + étoile jaune)
        return (
          <>
            <rect width="48" height="18" fill="#EF3340" />
            <rect y="18" width="48" height="18" fill="#009739" />
            <polygon points="24,12 26,17 31,17 27,20 29,25 24,22 19,25 21,20 17,17 22,17" fill="#FCD116" />
          </>
        );
      case 'ML': // Mali (Vert, Jaune, Rouge)
        return (
          <>
            <rect width="16" height="36" fill="#14B53A" />
            <rect x="16" width="16" height="36" fill="#FCD116" />
            <rect x="32" width="16" height="36" fill="#CE1126" />
          </>
        );
      case 'GN': // Guinée (Rouge, Jaune, Vert)
        return (
          <>
            <rect width="16" height="36" fill="#CE1126" />
            <rect x="16" width="16" height="36" fill="#FCD116" />
            <rect x="32" width="16" height="36" fill="#009460" />
          </>
        );
      case 'NE': // Niger (Orange, Blanc avec disque orange, Vert)
        return (
          <>
            <rect width="48" height="12" fill="#E05206" />
            <rect y="12" width="48" height="12" fill="#FFFFFF" />
            <rect y="24" width="48" height="12" fill="#0DB02B" />
            <circle cx="24" cy="18" r="4.5" fill="#E05206" />
          </>
        );
      case 'GA': // Gabon (Vert, Jaune, Bleu)
        return (
          <>
            <rect width="48" height="12" fill="#009E60" />
            <rect y="12" width="48" height="12" fill="#FCD116" />
            <rect y="24" width="48" height="12" fill="#3A75C4" />
          </>
        );
      case 'CG': // Congo (Vert et Rouge séparés par bande diagonale jaune)
        return (
          <>
            <polygon points="0,0 28,0 0,28" fill="#009543" />
            <polygon points="28,0 48,0 48,8 20,36 0,36 0,28" fill="#FBDE4A" />
            <polygon points="48,8 48,36 20,36" fill="#DC241F" />
          </>
        );
      case 'CD': // RD Congo (Bleu ciel avec diagonale rouge bordée de jaune et étoile)
        return (
          <>
            <rect width="48" height="36" fill="#007FFF" />
            <polygon points="0,30 38,0 48,0 48,6 10,36 0,36" fill="#FCD116" />
            <polygon points="0,32 42,0 46,0 46,4 6,36 0,36" fill="#CE1126" />
            <polygon points="8,5 9.5,9 14,9 10.5,11.5 12,15.5 8,13 4,15.5 5.5,11.5 2,9 6.5,9" fill="#FCD116" />
          </>
        );
      case 'TD': // Tchad (Bleu, Jaune, Rouge)
        return (
          <>
            <rect width="16" height="36" fill="#00205B" />
            <rect x="16" width="16" height="36" fill="#FFCD00" />
            <rect x="32" width="16" height="36" fill="#C8102E" />
          </>
        );
      case 'CF': // Centrafrique (Bleu, Blanc, Vert, Jaune + bande rouge verticale)
        return (
          <>
            <rect width="48" height="9" fill="#002A86" />
            <rect y="9" width="48" height="9" fill="#FFFFFF" />
            <rect y="18" width="48" height="9" fill="#289728" />
            <rect y="27" width="48" height="9" fill="#FFCE00" />
            <rect x="20" width="8" height="36" fill="#D21034" />
            <polygon points="8,2 9,5 12,5 9.5,7 10.5,10 8,8 5.5,10 6.5,7 4,5 7,5" fill="#FFCE00" />
          </>
        );
      case 'MG': // Madagascar (Blanc vertical à gauche, Rouge et Vert horizontaux)
        return (
          <>
            <rect width="16" height="36" fill="#FFFFFF" />
            <rect x="16" width="32" height="18" fill="#FC3D32" />
            <rect x="16" y="18" width="32" height="18" fill="#007E3A" />
          </>
        );
      case 'RW': // Rwanda (Bleu ciel avec soleil, Jaune, Vert)
        return (
          <>
            <rect width="48" height="18" fill="#20603D" />
            <rect y="18" width="48" height="9" fill="#E5BE01" />
            <rect y="27" width="48" height="9" fill="#00A1DE" />
          </>
        );
      case 'KE': // Kenya (Noir, Rouge avec bordures blanches, Vert)
        return (
          <>
            <rect width="48" height="11" fill="#000000" />
            <rect y="11" width="48" height="2" fill="#FFFFFF" />
            <rect y="13" width="48" height="10" fill="#BB0000" />
            <rect y="23" width="48" height="2" fill="#FFFFFF" />
            <rect y="25" width="48" height="11" fill="#006600" />
          </>
        );
      case 'GH': // Ghana (Rouge, Jaune avec étoile noire, Vert)
        return (
          <>
            <rect width="48" height="12" fill="#EF3340" />
            <rect y="12" width="48" height="12" fill="#FCD116" />
            <rect y="24" width="48" height="12" fill="#009739" />
            <polygon points="24,13 25.5,17.5 30,17.5 26.5,20 28,24.5 24,22 20,24.5 21.5,20 18,17.5 22.5,17.5" fill="#000000" />
          </>
        );
      case 'NG': // Nigéria (Vert, Blanc, Vert)
        return (
          <>
            <rect width="16" height="36" fill="#008751" />
            <rect x="16" width="16" height="36" fill="#FFFFFF" />
            <rect x="32" width="16" height="36" fill="#008751" />
          </>
        );
      case 'MA': // Maroc (Rouge avec pentagramme vert)
        return (
          <>
            <rect width="48" height="36" fill="#C1272D" />
            <polygon points="24,11 27,20 35,20 28.5,24.5 31,33 24,28 17,33 19.5,24.5 13,20 21,20" stroke="#006233" strokeWidth="1.5" fill="none" />
          </>
        );
      case 'DZ': // Algérie (Vert et Blanc avec croissant et étoile rouges)
        return (
          <>
            <rect width="24" height="36" fill="#006233" />
            <rect x="24" width="24" height="36" fill="#FFFFFF" />
            <circle cx="24" cy="18" r="7" fill="#D21034" />
            <circle cx="26" cy="18" r="5.5" fill="#FFFFFF" />
            <polygon points="27,15 28,17.5 30.5,17.5 28.5,19 29.5,21.5 27,20 24.5,21.5 25.5,19 23.5,17.5 26,17.5" fill="#D21034" />
          </>
        );
      case 'TN': // Tunisie (Rouge avec cercle blanc et croissant/étoile rouges)
        return (
          <>
            <rect width="48" height="36" fill="#E70013" />
            <circle cx="24" cy="18" r="9" fill="#FFFFFF" />
            <circle cx="24" cy="18" r="6" fill="#E70013" />
            <circle cx="26" cy="18" r="5" fill="#FFFFFF" />
            <polygon points="25,16 26,17.5 28,17.5 26.5,18.5 27,20 25.5,19 24,20 24.5,18.5 23,17.5 24.5,17.5" fill="#E70013" />
          </>
        );
      case 'FR': // France (Bleu, Blanc, Rouge)
        return (
          <>
            <rect width="16" height="36" fill="#002654" />
            <rect x="16" width="16" height="36" fill="#FFFFFF" />
            <rect x="32" width="16" height="36" fill="#CE1126" />
          </>
        );
      case 'BE': // Belgique (Noir, Jaune, Rouge)
        return (
          <>
            <rect width="16" height="36" fill="#000000" />
            <rect x="16" width="16" height="36" fill="#FDDA24" />
            <rect x="32" width="16" height="36" fill="#EF3340" />
          </>
        );
      case 'CH': // Suisse (Rouge avec croix blanche)
        return (
          <>
            <rect width="48" height="36" fill="#D52B1E" />
            <rect x="21" y="9" width="6" height="18" fill="#FFFFFF" />
            <rect x="15" y="15" width="18" height="6" fill="#FFFFFF" />
          </>
        );
      case 'GB': // Royaume-Uni (Union Jack simplifié)
        return (
          <>
            <rect width="48" height="36" fill="#012169" />
            <polygon points="0,0 6,0 48,31.5 48,36 42,36 0,4.5" fill="#FFFFFF" />
            <polygon points="48,0 42,0 0,31.5 0,36 6,36 48,4.5" fill="#FFFFFF" />
            <rect x="19" width="10" height="36" fill="#FFFFFF" />
            <rect y="13" width="48" height="10" fill="#FFFFFF" />
            <rect x="21" width="6" height="36" fill="#C8102E" />
            <rect y="15" width="48" height="6" fill="#C8102E" />
          </>
        );
      case 'US': // États-Unis (Bandes rouges/blanches + canton bleu)
        return (
          <>
            <rect width="48" height="36" fill="#B22234" />
            <rect y="5.5" width="48" height="5.5" fill="#FFFFFF" />
            <rect y="16.5" width="48" height="5.5" fill="#FFFFFF" />
            <rect y="27.5" width="48" height="5.5" fill="#FFFFFF" />
            <rect width="20" height="19" fill="#3C3B6E" />
            <circle cx="6" cy="6" r="1.5" fill="#FFFFFF" />
            <circle cx="14" cy="6" r="1.5" fill="#FFFFFF" />
            <circle cx="10" cy="11" r="1.5" fill="#FFFFFF" />
            <circle cx="6" cy="15" r="1.5" fill="#FFFFFF" />
            <circle cx="14" cy="15" r="1.5" fill="#FFFFFF" />
          </>
        );
      case 'CA': // Canada (Rouge, Blanc avec feuille d'érable, Rouge)
        return (
          <>
            <rect width="12" height="36" fill="#FF0000" />
            <rect x="12" width="24" height="36" fill="#FFFFFF" />
            <rect x="36" width="12" height="36" fill="#FF0000" />
            <polygon points="24,10 26,14 29,13 28,17 31,19 28,21 28,24 24,22 20,24 20,21 17,19 20,17 19,13 22,14" fill="#FF0000" />
          </>
        );
      default:
        return (
          <>
            <rect width="48" height="36" fill="#1A365D" />
            <text x="24" y="22" fill="#4FD1C5" fontSize="12" fontWeight="700" textAnchor="middle">{code.slice(0, 2)}</text>
          </>
        );
    }
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 36"
      style={baseStyle}
      className={className}
      role="img"
      aria-label={`Drapeau ${code}`}
    >
      {renderFlag()}
    </svg>
  );
}

