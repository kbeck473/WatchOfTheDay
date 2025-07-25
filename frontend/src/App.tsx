import { useEffect, useState } from 'react';
import './App.css';

interface Watch {
  id: number;
  name: string;
  image_url: string;
  brand?: string;
  notes?: string;
}

function App() {
  const [watch, setWatch] = useState<Watch | null>(null);
  const [newName, setNewName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchWatch = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/watch-of-the-day');
      const data = await res.json();
      setWatch(data);
    } catch (err) {
      console.error("Failed to fetch watch:", err);
    }
  };

  const addWatchWithUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/watches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, image_url: newImageUrl }),
      });
      if (res.ok) {
        alert('✅ Watch added!');
        setNewName('');
        setNewImageUrl('');
        fetchWatch();
      } else {
        const err = await res.json();
        alert('❌ Failed to add watch: ' + err.error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const uploadWatchWithFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName || !imageFile) return;

    const formData = new FormData();
    formData.append('name', uploadName);
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/watches/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('✅ Watch uploaded!');
        setUploadName('');
        setImageFile(null);
        fetchWatch();
      } else {
        const err = await res.json();
        alert('❌ Upload failed: ' + err.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  useEffect(() => {
    fetchWatch();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Watch of the Day</h1>

      {watch ? (
        <>
          <img
            src={`http://localhost:5000${watch.image_url}`}
            alt={watch.name}
            style={{ width: '300px', borderRadius: '12px' }}
            onError={(e) => (e.currentTarget.src = '/fallback.png')}
          />
          <h2>{watch.name}</h2>
          {watch.brand && <h3>{watch.brand}</h3>}
          {watch.notes && <p>{watch.notes}</p>}
          <button onClick={fetchWatch} style={{ marginTop: '1rem' }}>
            Show Another
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}

      {/* Form: Add by URL */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Add a New Watch (via Image URL)</h2>
        <form onSubmit={addWatchWithUrl}>
          <input
            type="text"
            placeholder="Watch Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ padding: '0.5rem', marginRight: '1rem' }}
          />
          <input
            type="text"
            placeholder="Image URL (e.g. /images/mywatch.jpg)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            required
            style={{ padding: '0.5rem', marginRight: '1rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>
            Add Watch
          </button>
        </form>
      </div>

      {/* Form: Upload Watch Image */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Add a New Watch (via File Upload)</h2>
        <form onSubmit={uploadWatchWithFile} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Watch Name"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            required
            style={{ padding: '0.5rem', marginRight: '1rem' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
            style={{ padding: '0.5rem', marginRight: '1rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>
            Upload Watch
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
