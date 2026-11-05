/**
 * @file QrCodeScanner.jsx
 * @description Lecteur de QR Code en temps réel par caméra vidéo et import d'image pour rejoindre une tontine.
 * @module components/groups/QrCodeScanner
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Image, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * Analyse et extrait le code d'invitation à 8 caractères depuis le contenu brut scanné.
 * Supporte le format JSON officiel, les URLs de redirection et les chaînes de caractères brutes.
 * @param {string} text - Contenu brut décodé.
 * @returns {string|null} Code d'invitation normalisé à 8 caractères ou null.
 */
export function extractInviteCode(text) {
  if (!text || typeof text !== 'string') return null;
  const cleanText = text.trim();

  // 1. Tenter l'extraction depuis un objet JSON
  try {
    const parsed = JSON.parse(cleanText);
    if (parsed.code && typeof parsed.code === 'string') {
      return parsed.code.trim().toUpperCase();
    }
  } catch {
    // Le contenu n'est pas un JSON, continuer
  }

  // 2. Tenter l'extraction depuis un paramètre d'URL (?code=XXXXXXXX)
  const urlParamMatch = cleanText.match(/[?&]code=([a-zA-Z0-9]{8})/i);
  if (urlParamMatch) {
    return urlParamMatch[1].toUpperCase();
  }

  // 3. Tenter la correspondance exacte sur 8 caractères alphanumériques
  if (/^[a-zA-Z0-9]{8}$/.test(cleanText)) {
    return cleanText.toUpperCase();
  }

  // 4. Recherche de séquence isolée de 8 caractères alphanumériques
  const seqMatch = cleanText.match(/\b([a-zA-Z0-9]{8})\b/);
  if (seqMatch) {
    return seqMatch[1].toUpperCase();
  }

  return cleanText.toUpperCase().slice(0, 8);
}

export default function QrCodeScanner({ onScanSuccess }) {
  const { t } = useTranslation();
  const scannerContainerId = 'qr-reader-container';

  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedCode, setScannedCode] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (arrière) ou 'user' (avant)

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSuccess = useCallback((decodedText) => {
    const code = extractInviteCode(decodedText);
    if (code) {
      setScannedCode(code);
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
      setIsScanning(false);
      if (onScanSuccess) {
        onScanSuccess(code);
      }
    }
  }, [onScanSuccess]);

  const startScanner = useCallback(async (mode = facingMode) => {
    try {
      setErrorMessage('');
      setScannedCode('');

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }

      if (html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCodeRef.current.start(
        { facingMode: mode },
        config,
        (decodedText) => handleSuccess(decodedText),
        () => {} // Ignorer les échecs de trames intermédiaires
      );

      setIsScanning(true);
    } catch (err) {
      setIsScanning(false);
      setErrorMessage(
        err?.name === 'NotAllowedError' || String(err).includes('Permission')
          ? t('groups.cameraPermissionError')
          : t('groups.cameraGenericError')
      );
    }
  }, [facingMode, handleSuccess, t]);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch {
        // Ignorer silencieusement
      }
    }
    setIsScanning(false);
  }, []);

  const toggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startScanner(nextMode);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMessage('');
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }
      await stopScanner();

      const decodedText = await html5QrCodeRef.current.scanFile(file, true);
      handleSuccess(decodedText);
    } catch {
      setErrorMessage(t('groups.qrDecodeError'));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
      {/* Viseur du Scanner avec coins illuminés */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '320px',
          aspectRatio: '1',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#000000',
          border: '2px solid rgba(79, 209, 197, 0.4)',
          boxShadow: '0 0 20px rgba(49, 151, 149, 0.25)'
        }}
      >
        <div id={scannerContainerId} style={{ width: '100%', height: '100%' }} />

        {/* Animation du cadre de visée */}
        {isScanning && (
          <div
            style={{
              position: 'absolute',
              inset: '24px',
              border: '2px dashed var(--color-secondary-light)',
              borderRadius: 'var(--radius-sm)',
              pointerEvents: 'none',
              animation: 'pulse 2s infinite'
            }}
          />
        )}

        {/* Message de succès visuel immédiat */}
        {scannedCode && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: 'var(--color-secondary-light)'
            }}
          >
            <CheckCircle2 size={44} />
            <span style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.05em' }}>
              {scannedCode}
            </span>
          </div>
        )}
      </div>

      {/* Message d'erreur caméra éventuelle */}
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            width: '100%',
            maxWidth: '360px'
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Boutons d'action auxiliaires : Changer caméra & Importer image */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={toggleCamera}
          className="btn btn-outline"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          title={t('groups.toggleCamera')}
        >
          <RefreshCw size={14} />
          <span>{t('groups.toggleCamera')}</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-outline"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          title={t('groups.uploadQrImage')}
        >
          <Image size={14} />
          <span>{t('groups.uploadQrImage')}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>
        {t('groups.scanInstructions')}
      </p>
    </div>
  );
}

