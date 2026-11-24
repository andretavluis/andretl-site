// Worker for andretl-site.
// POST /api/track: records a page-view event in Analytics Engine.
// Blob layout (order is contractual, queries depend on it):
//   blob1 path, blob2 referrer host, blob3 country, blob4 device class

type DeviceClass = 'mobile' | 'desktop' | 'bot';

interface AnalyticsDataset {
  writeDataPoint: (point: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }) => void;
}

interface Env {
  ANALYTICS: AnalyticsDataset;
}

export function classifyDevice(userAgent: string): DeviceClass {
  const ua = userAgent.toLowerCase();
  if (/bot|crawl|spider|slurp|bingpreview|lighthouse|headless/.test(ua)) {
    return 'bot';
  }
  if (/mobile|iphone|android|ipad/.test(ua)) return 'mobile';
  return 'desktop';
}

export function referrerHost(referrer: string): string {
  if (!referrer) return 'direct';
  try {
    return new URL(referrer).hostname;
  } catch {
    return 'direct';
  }
}

function requestCountry(request: Request): string {
  const cf = (request as Request & { cf?: { country?: string } }).cf;
  return cf?.country ?? 'unknown';
}

async function handleTrack(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) {
    return new Response('Forbidden', { status: 403 });
  }

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const path = typeof body.path === 'string' ? body.path.slice(0, 256) : '/';
  const referrer =
    typeof body.referrer === 'string' ? referrerHost(body.referrer) : 'direct';
  const device = classifyDevice(request.headers.get('user-agent') ?? '');

  env.ANALYTICS.writeDataPoint({
    blobs: [path, referrer, requestCountry(request), device],
    indexes: ['v1'],
  });

  return new Response(null, { status: 204 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/track') return handleTrack(request, env);
    return new Response('Not found', { status: 404 });
  },
} as const;
