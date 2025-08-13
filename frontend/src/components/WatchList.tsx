import React from 'react';
import { Watch } from '../App';
import WatchCard from './WatchCard';

/**
 * Displays the newest uploaded watches in a list.
 */
export default function WatchList({ list, refresh }: { list: Watch[], refresh: () => void }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>Newest uploads</h3>
        <button
          onClick={refresh}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer' }}
        >
          Refresh
        </button>
      </div>

      {/* List or empty state */}
      {list.length === 0 ? (
        <p style={{ color: '#666' }}>Nothing yet — be the first!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12, marginTop: 12 }}>
          {list.map((w) => (
            <li key={w.id} style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 8 }}>
              <WatchCard watch={w} size="small" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
