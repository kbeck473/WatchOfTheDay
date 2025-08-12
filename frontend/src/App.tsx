import React, { useEffect, useState } from 'react';

type Watch = {
  id: number;
  name: string;
  brand: string;
  image_url: string;
  notes?: string | null;
};

export default function App() {
  const [wotd, setWotd] = useState<Watch | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [list, setList] = useState<Watch[]>([]);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const fetchList = async () => {
    try {
      const r = await fetch(`/api/watches`);
      if (r.ok) setList(await r.json());
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchWotd();
    fetchList();
  }, []);

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Pick an image');
    try {
      setUploading(true);
      const form = new FormData();
      form.append('name', name.trim());
      form.append('brand', brand.trim());
      if (notes.trim()) form.append('notes', notes.trim());
      form.append('image', file);
      const r = await fetch(`/api/watches/upload`, { method: 'POST', body: form });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`);
      setName(''); setBrand(''); setNotes(''); setFile(null);
      await Promise.all([fetchWotd(), fetchList()]);
    } catch (e: any) {
      alert(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>Watch of the Day</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Random pick from the community collection.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginTop: 16 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <button onClick={fetchWotd} disabled={loading}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer' }}>
              {loading ? 'Picking…' : 'New pick'}
            </button>
            {err && <span style={{ color: '#c00' }}>{err}</span>}
          </div>

          {wotd ? (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>
              <div style={{ width: 240, height: 240, borderRadius: 12, overflow: 'hidden', border: '1px solid #eee', background: '#f7f7f7' }}>
                <img
                  src={wotd.image_url}
                  alt={wotd.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => ((e.currentTarget.src = ''), (e.currentTarget.alt = 'Image not found'))}
                />
              </div>
              <div>
                <h2 style={{ margin: '4px 0 8px' }}>{wotd.brand} — {wotd.name}</h2>
                {wotd.notes && <p style={{ color: '#444' }}>{wotd.notes}</p>}
                <code style={{ color: '#666' }}>{wotd.image_url}</code>
              </div>
            </div>
          ) : (
            <p style={{ color: '#666' }}>{loading ? 'Loading…' : 'No watches yet.'}</p>
          )}
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginTop: 0 }}>Add a watch</h3>
          <form onSubmit={onUpload} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Seamaster 300M" style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Brand</span>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} required placeholder="Omega" style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Notes (optional)</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Why it’s cool…" style={{ ...inputStyle, resize: 'vertical' }} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Image</span>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required style={inputStyle} />
            </label>
            <div>
              <button type="submit" disabled={uploading}
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}>
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Newest uploads</h3>
            <button onClick={fetchList}
              style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer' }}>
              Refresh
            </button>
          </div>
          {list.length === 0 ? (
            <p style={{ color: '#666' }}>Nothing yet — be the first!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12, marginTop: 12 }}>
              {list.map((w) => (
                <li key={w.id}
                  style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 12, alignItems: 'center', border: '1px solid #f0f0f0', borderRadius: 10, padding: 8 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', background: '#f7f7f7', border: '1px solid #eee' }}>
                    <img
                      src={w.image_url}
                      alt={w.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => ((e.currentTarget.src = ''), (e.currentTarget.alt = ''))}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{w.brand} — {w.name}</div>
                    {w.notes && <div style={{ color: '#555' }}>{w.notes}</div>}
                    <div style={{ color: '#888', fontSize: 12 }}>{w.image_url}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #ddd',
  background: '#fff',
  fontSize: 14
};
