'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { TURNSTILE_SITE_KEY } from '@/lib/utils';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => string;
    };
  }
}

interface TurnstileWidgetProps {
  onToken: (token: string | null) => void;
}

export default function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.turnstile) {
      return;
    }

    window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token) => onToken(token),
      'expired-callback': () => onToken(null),
      'error-callback': () => onToken(null),
    });
  }, [scriptLoaded, onToken]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="contact-turnstile" />
    </>
  );
}
