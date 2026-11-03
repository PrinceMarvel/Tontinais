/**
 * @file Logo.jsx
 * @description Composant officiel du Logo TontiNaïs (Triptyque rotatif solidaire & Typographie Serif).
 * Respecte fidèlement la géométrie de l'ébauche originale avec flèches séparées et aérées.
 * @module components/Logo
 */

import React from 'react';

export default function Logo({
  size = 36,
  showText = true,
  stacked = false,
  className = '',
  style = {}
}) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: stacked ? '14px' : '10px',
        userSelect: 'none',
        ...style
      }}
    >
      {/* Symbole Vectoriel : Triptyque Circulaire à 3 Flèches Rotatives Séparées */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 8px rgba(49, 151, 149, 0.35))',
          transition: 'transform 0.3s ease'
        }}
      >
        <defs>
          {/* Dégradé Vert Émeraude / Turquoise FinTech (Branche 1) */}
          <linearGradient id="tontiTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#319795" />
            <stop offset="50%" stopColor="#38B2AC" />
            <stop offset="100%" stopColor="#4FD1C5" />
          </linearGradient>

          {/* Dégradé Or Solaire / Ambre (Branche 2) */}
          <linearGradient id="tontiGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DD6B20" />
            <stop offset="50%" stopColor="#ED8936" />
            <stop offset="100%" stopColor="#F6AD55" />
          </linearGradient>

          {/* Dégradé Cyan Émeraude Lumineux (Branche 3) */}
          <linearGradient id="tontiCyan" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2B6CB0" />
            <stop offset="50%" stopColor="#319795" />
            <stop offset="100%" stopColor="#4FD1C5" />
          </linearGradient>

          {/* Tracé unitaire d'une flèche rotative séparée avec respiration visuelle */}
          <path
            id="tontiSegment"
            d="M 123.6 128.2 
               A 184 184 0 0 1 364.2 107.1 
               L 375.9 91.0 
               L 380.6 165.5 
               L 317.1 171.9 
               L 328.9 155.7 
               A 124 124 0 0 0 166.8 169.9 
               L 174.4 125.4 
               Z"
          />
        </defs>

        {/* Rotation symétrique à 120° des 3 flèches autonomes */}
        <g>
          {/* Branche 1 (Haut) */}
          <use href="#tontiSegment" fill="url(#tontiTeal)" />

          {/* Branche 2 (Droite / Bas) */}
          <use href="#tontiSegment" fill="url(#tontiGold)" transform="rotate(120 256 256)" />

          {/* Branche 3 (Gauche / Bas) */}
          <use href="#tontiSegment" fill="url(#tontiCyan)" transform="rotate(240 256 256)" />
        </g>
      </svg>

      {/* Typographie Serif Officielle TontiNaïs */}
      {showText && (
        <span
          style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
            fontSize: stacked ? '1.85rem' : '1.35rem',
            fontWeight: 700,
            letterSpacing: '-0.4px',
            color: 'var(--color-text-primary)',
            display: 'inline-flex',
            alignItems: 'baseline',
            lineHeight: 1
          }}
        >
          <span>Tonti</span>
          <span
            style={{
              background: 'linear-gradient(135deg, var(--color-secondary-light), #2DD4BF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Naïs
          </span>
        </span>
      )}
    </div>
  );
}
