import React, { useEffect, useRef, useState } from 'react';

/**
 * TimeBar
 * - Shows precise local time (to the second) and UTC.
 * - Uses a next-second–aligned timer to avoid drift.
 */
export default function TimeBar() {
  const [now, setNow] = useState<Date>(new Date());
  const timerRef = useRef<number | null>(null);

  // Format helpers (24-hour with seconds so it's easy to set a watch)
  const fmtLocal = (d: Date) =>
    d.toLocaleTimeString(undefined, {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short', // e.g., PDT / GMT-7 / etc (browser dependent)
    });

  const fmtUTC = (d: Date) =>
    d.toLocaleTimeString(undefined, {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    });

  useEffect(() => {
    // Align the first tick to the next second boundary, then tick every second
    const tick = () => {
      setNow(new Date());
      const msToNextSecond = 1000 - (Date.now() % 1000);
      timerRef.current = window.setTimeout(tick, msToNextSecond);
    };

    tick(); // start the loop

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '8px 12px',
        border: '1px solid #eee',
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        marginBottom: 16,
        background: '#fafafa',
      }}
    >
      {/* Big local time with seconds */}
      <div style={{ fontSize: 24, fontWeight: 700 }}>
        {fmtLocal(now)}
      </div>

    </div>
  );
}
