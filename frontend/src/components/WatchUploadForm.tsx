import React, { useState } from 'react';

/**
 * Form for uploading a new watch.
 */
export default function WatchUploadForm({ afterUpload }: { afterUpload: () => void }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputStyle: React.CSSProperties = {
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #ddd',
    background: '#fff',
    fontSize: 14
  };

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

      // Reset form
      setName('');
      setBrand('');
      setNotes('');
      setFile(null);

      // Trigger refresh in parent
      afterUpload();
    } catch (e: any) {
      alert(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
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
          <button
            type="submit"
            disabled={uploading}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#0ea5e9', color: 'white', cursor: 'pointer' }}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
}
