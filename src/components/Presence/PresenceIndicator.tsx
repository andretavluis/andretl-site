'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PresenceIndicator() {
  const pathname = usePathname();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(
      `${protocol}://${window.location.host}/api/presence?path=${encodeURIComponent(pathname)}`,
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as { count: number };
      setCount(data.count);
    };
    ws.onerror = () => setCount(null);

    return () => ws.close();
  }, [pathname]);

  if (count === null || count <= 1) return null;

  return (
    <p className="presence-indicator">👀 {count} people viewing this page</p>
  );
}
