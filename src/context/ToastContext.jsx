/**
 * @file ToastContext.jsx
 * @description Contexte global de notifications Toast interactives (alertes flottantes animées).
 * @module context/ToastContext
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#34d399" />;
      case 'error':
        return <AlertCircle size={18} color="#f87171" />;
      case 'warning':
        return <AlertTriangle size={18} color="#fbbf24" />;
      case 'info':
      default:
        return <Info size={18} color="#60a5fa" />;
    }
  };

  const getToastBorder = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Conteneur des Toasts Flottants (Coin supérieur droit) */}
      <aside
        aria-live="polite"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
          maxWidth: '380px',
          width: 'calc(100vw - 40px)'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-slide-in"
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'var(--backdrop-blur)',
              border: `1px solid ${getToastBorder(toast.type)}`,
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              color: 'var(--color-text-primary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getToastIcon(toast.type)}
              <span style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.3 }}>
                {toast.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'grid',
                placeItems: 'center'
              }}
              aria-label="Fermer"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast doit être utilisé à l\'intérieur d\'un ToastProvider.');
  }
  return context;
}

