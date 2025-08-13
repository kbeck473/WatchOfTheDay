import React from 'react';
import { Watch } from '../App';

/**
 * Displays a watch's image, brand, name, and optional notes.
 * Can be rendered in "small" or "large" mode.
 */
export default function WatchCard({
  watch,
  size = 'small',
}: {
  watch: Watch;
  size?: 'small' | 'large';
}) {
  const imgSize = size === 'large' ? 240 : 72;
  const borderRadius = size === 'large' ? 12 : 8;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${imgSize}px 1fr`, gap: 16, alignItems: 'center' }}>
      {/* Image */}
      <div
        style={{
          width: imgSize,
          height: imgSize,
          borderRadius,
          overflow: 'hidden',
          border: '1px solid #eee',
          background: '#f7f7f7'
        }}
      >
        <img
          src={watch.image_url}
          alt={watch.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => ((e.currentTarget.src = ''), (e.currentTarget.alt = 'Image not found'))}
        />
      </div>

      {/* Details */}
      <div>
        <div style={{ fontWeight: 600, fontSize: size === 'large' ? 20 : 14 }}>
          {watch.brand} — {watch.name}
        </div>
        {watch.notes && (
          <div style={{ color: '#555', marginTop: size === 'large' ? 8 : 4 }}>
            {watch.notes}
          </div>
        )}
        <div style={{ color: '#888', fontSize: 12 }}>{watch.image_url}</div>
      </div>
    </div>
  );
}
