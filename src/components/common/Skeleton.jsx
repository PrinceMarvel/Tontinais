/**
 * @file Skeleton.jsx
 * @description Composants de chargement pulsants (Skeleton Loaders) pour fluidifier l'expérience visuelle.
 * @module components/common/Skeleton
 */

import React from 'react';

/**
 * Bloc de chargement générique avec effet Shimmer
 */
export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}

/**
 * Squelette d'une carte KPI financière
 */
export function SkeletonKPI() {
  return (
    <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Skeleton width="52px" height="52px" borderRadius="var(--radius-sm)" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width="45%" height="14px" />
        <Skeleton width="70%" height="24px" />
      </div>
    </div>
  );
}

/**
 * Squelette d'une carte de tontine collaborative
 */
export function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Skeleton width="60%" height="20px" />
          <Skeleton width="25%" height="22px" borderRadius="var(--radius-full)" />
        </div>
        <Skeleton width="90%" height="14px" style={{ marginBottom: '6px' }} />
        <Skeleton width="75%" height="14px" style={{ marginBottom: '16px' }} />

        <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-surface)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <Skeleton width="40%" height="12px" style={{ marginBottom: '6px' }} />
            <Skeleton width="70%" height="18px" />
          </div>
          <div>
            <Skeleton width="40%" height="12px" style={{ marginBottom: '6px' }} />
            <Skeleton width="70%" height="18px" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
        <Skeleton width="35%" height="14px" />
        <Skeleton width="28%" height="32px" borderRadius="var(--radius-sm)" />
      </div>
    </div>
  );
}

export default Skeleton;

