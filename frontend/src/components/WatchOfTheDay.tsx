import React from 'react';
import { Watch } from '../App';
import WatchCard from './WatchCard';

/**
 * Displays the current "Watch of the Day" with a button to fetch a new one.
 */
export default function WatchOfTheDay({
  wotd,
  fetchWotd,
  loading,
  err
}: {
  wotd: Watch | null;
  fetchWotd: () => void;
  loading: boolean;
  err: string | null;
}) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      {/* Fetch new WOTD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <button
          onClick={fetchWotd}
          disabled={loading}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer' }}
        >
          {loading ? 'Picking…' : 'New pick'}
        </button>
        {err && <span style={{ color: '#c00' }}>{err}</span>}
      </div>

      {/* Watch info or empty state */}
      {wotd ? (
        <WatchCard watch={wotd} size="large" />
      ) : (
        <p style={{ color: '#666' }}>{loading ? 'Loading…' : 'No watches yet.'}</p>
      )}
    </div>
  );
}
