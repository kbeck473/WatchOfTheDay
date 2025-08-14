import React, { useEffect, useState } from 'react';
import WatchOfTheDay from './components/WatchOfTheDay';
import WatchUploadForm from './components/WatchUploadForm';
import WatchList from './components/WatchList';

// TypeScript type for a watch
export type Watch = {
  id: number;
  name: string;
  brand: string;
  image_url: string;
  notes?: string | null;
};

export default function App() {
  const [wotd, setWotd] = useState<Watch | null>(null); // Watch of the Day
  const [list, setList] = useState<Watch[]>([]);        // Newest uploads
  const [loading, setLoading] = useState(false);        // WOTD loading state
  const [err, setErr] = useState<string | null>(null);  // WOTD error state

  // Fetch a random "Watch of the Day"
  const fetchWotd = async () => {
    try {
      setLoading(true);
      setErr(null);
      const r = await fetch(`/api/watch-of-the-day`);
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`);
      setWotd(await r.json());
    } catch (e: any) {
      setErr(e.message || 'Failed to load');
      setWotd(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the newest uploads
  const fetchList = async () => {
    try {
      const r = await fetch(`/api/watches`);
      if (r.ok) setList(await r.json());
    } catch {
      /* Ignore errors */
    }
  };

  // Load data when the app mounts
  useEffect(() => {
    fetchWotd();
    fetchList();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>Watch of the Day</h1>
      <p style={{ color: '#666', marginTop: 0 }}>This will give a watch from your collection. TEst for deploy</p>

      <div style={{ display: 'grid', gap: 24, marginTop: 16 }}>
        {/* WOTD Card */}
        <WatchOfTheDay wotd={wotd} fetchWotd={fetchWotd} loading={loading} err={err} />

        {/* Upload form with callback to refresh lists */}
        <WatchUploadForm afterUpload={() => { fetchWotd(); fetchList(); }} />

        {/* Newest uploads list */}
        <WatchList list={list} refresh={fetchList} />
      </div>
    </div>
  );
}
