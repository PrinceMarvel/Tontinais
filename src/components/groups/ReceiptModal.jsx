/**
 * @file ReceiptModal.jsx
 * @description Modale d'aperçu plein écran du justificatif de paiement Cloudinary.
 * @module components/groups/ReceiptModal
 */

import React from 'react';
import { X } from 'lucide-react';

export default function ReceiptModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 300,
        padding: '20px'
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '24px',
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
          Justificatif de versement
        </h4>

        <img
          src={imageUrl}
          alt="Reçu de paiement"
          style={{
            maxWidth: '100%',
            maxHeight: '68vh',
            borderRadius: 'var(--radius-sm)',
            objectFit: 'contain',
            border: '1px solid var(--color-border)'
          }}
        />
      </div>
    </div>
  );
}
