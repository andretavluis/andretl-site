'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Only record on the production hostname, so previews and localhost
// never pollute the dataset.
const BEACON_HOST = 'andretl.com';

export default function Beacon() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    const isFirst = firstLoad.current;
    firstLoad.current = false;

    if (window.location.hostname !== BEACON_HOST) return;

    fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        // document.referrer does not change on client-side navigation,
        // so send it only for the first (landing) event.
        referrer: isFirst ? document.referrer : '',
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
