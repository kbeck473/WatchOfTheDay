import { useEffect, useState } from 'react';
import './App.css';

interface Watch {
  id: number;
  name: string;
  brand: string;
  image: string;
  notes: string;
}

function App() {
  const [watch, setWatch] = useState<Watch | null>(null);

  const fetchWatch = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/watch-of-the-day');
      const data = await res.json();
      setWatch(data);
    } catch (err) {
      console.error("Failed to fetch watch:", err);
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
            src={`http://localhost:5000${watch.image}`}
            alt={watch.name}
            style={{ width: '300px', borderRadius: '12px' }}
          />
          <h2>{watch.name}</h2>
          <h3>{watch.brand}</h3>
          <p>{watch.notes}</p>
          <button onClick={fetchWatch} style={{ marginTop: '1rem' }}>
            Show Another
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
