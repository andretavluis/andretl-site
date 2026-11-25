// Worker for andretl-site.// POST /api/track: records a page-view event in Analytics Engine.
// Blob layout (order is contractual, queries depend on it):
//   blob1 path, blob2 referrer host, blob3 country, blob4 device class
// scheduled(): nightly rollup from Analytics Engine into D1 (events + daily_stats).

type DeviceClass = 'mobile' | 'desktop' | 'bot';

interface AnalyticsDataset {
  writeDataPoint: (point: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }) => void;
}

interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first?: <T = unknown>() => Promise<T | null>;
  all?: <T = unknown>() => Promise<{ results: T[] }>;
}

interface D1Like {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<unknown>;
}

interface Env {
  ANALYTICS: AnalyticsDataset;
  DB: D1Like;
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
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

const ANALYTICS_DATASET = 'andretl_site_events';

interface AeRow {
  timestamp: string;
  blob1: string;
  blob2: string;
  blob3: string;
  blob4: string;
  _sample_interval: number;
}

async function fetchAnalyticsRows(env: Env): Promise<AeRow[]> {
  const query = `
    SELECT timestamp, blob1, blob2, blob3, blob4, _sample_interval
    FROM ${ANALYTICS_DATASET}
    WHERE timestamp > NOW() - INTERVAL '2' DAY
    ORDER BY timestamp DESC
    LIMIT 10000
  `;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/analytics_engine/sql`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` },
      body: query,
    },
  );

  if (!response.ok) {
    throw new Error(
      `Analytics Engine query failed: ${response.status} ${await response.text()}`,
    );
  }

  const json = (await response.json()) as { data: AeRow[] };
  return json.data;
}

function yesterdayUtc(): string {
  const now = new Date();
  const yesterday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
  );
  return yesterday.toISOString().slice(0, 10);
}

interface DailyStat {
  path: string;
  referrerHost: string;
  country: string;
  device: string;
  views: number;
}

export async function rollup(env: Env): Promise<void> {
  const rows = await fetchAnalyticsRows(env);
  const eventDate = yesterdayUtc();
  const dayRows = rows.filter(
    (row) => row.timestamp.slice(0, 10) === eventDate,
  );

  const dailyMap = new Map<string, DailyStat>();
  for (const row of dayRows) {
    const weight = row._sample_interval || 1;
    const key = `${row.blob1}\u0000${row.blob2}\u0000${row.blob3}\u0000${row.blob4}`;
    const existing = dailyMap.get(key);
    if (existing) {
      existing.views += weight;
    } else {
      dailyMap.set(key, {
        path: row.blob1,
        referrerHost: row.blob2,
        country: row.blob3,
        device: row.blob4,
        views: weight,
      });
    }
  }

  const statements: D1PreparedStatement[] = [
    env.DB.prepare('DELETE FROM events WHERE event_date = ?').bind(eventDate),
    ...dayRows.map((row) =>
      env.DB.prepare(
        'INSERT INTO events (event_date, timestamp, path, referrer_host, country, device) VALUES (?, ?, ?, ?, ?, ?)',
      ).bind(
        eventDate,
        row.timestamp,
        row.blob1,
        row.blob2,
        row.blob3,
        row.blob4,
      ),
    ),
    ...[...dailyMap.values()].map((stat) =>
      env.DB.prepare(
        `INSERT INTO daily_stats (event_date, path, referrer_host, country, device, views)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(event_date, path, referrer_host, country, device)
           DO UPDATE SET views = excluded.views`,
      ).bind(
        eventDate,
        stat.path,
        stat.referrerHost,
        stat.country,
        stat.device,
        Math.round(stat.views),
      ),
    ),
  ];

  await env.DB.batch(statements);
}

async function handleStats(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const daysParam = url.searchParams.get('days') ?? '30';
  const since =
    daysParam === 'all'
      ? '1970-01-01'
      : new Date(
          Date.now() -
            Math.min(Number(daysParam) || 30, 3650) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .slice(0, 10);

  const totals = await env.DB.prepare(
    'SELECT COALESCE(SUM(views), 0) AS views FROM daily_stats WHERE event_date >= ?',
  ).bind(since).first!<{ views: number }>();

  const byPath = await env.DB.prepare(
    'SELECT path, SUM(views) AS views FROM daily_stats WHERE event_date >= ? GROUP BY path ORDER BY views DESC LIMIT 20',
  ).bind(since).all!();

  const byReferrer = await env.DB.prepare(
    'SELECT referrer_host, SUM(views) AS views FROM daily_stats WHERE event_date >= ? GROUP BY referrer_host ORDER BY views DESC LIMIT 20',
  ).bind(since).all!();

  const byCountry = await env.DB.prepare(
    'SELECT country, SUM(views) AS views FROM daily_stats WHERE event_date >= ? GROUP BY country ORDER BY views DESC LIMIT 20',
  ).bind(since).all!();

  const byDevice = await env.DB.prepare(
    'SELECT device, SUM(views) AS views FROM daily_stats WHERE event_date >= ? GROUP BY device ORDER BY views DESC',
  ).bind(since).all!();

  const byDate = await env.DB.prepare(
    'SELECT event_date, SUM(views) AS views FROM daily_stats WHERE event_date >= ? GROUP BY event_date ORDER BY event_date ASC',
  ).bind(since).all!();

  return Response.json({
    since,
    totalViews: totals?.views ?? 0,
    byPath: byPath.results,
    byReferrer: byReferrer.results,
    byCountry: byCountry.results,
    byDevice: byDevice.results,
    byDate: byDate.results,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/track') return handleTrack(request, env);
    if (pathname === '/api/stats') return handleStats(request, env);
    return new Response('Not found', { status: 404 });
  },
  async scheduled(
    _controller: unknown,
    env: Env,
    ctx: { waitUntil: (promise: Promise<unknown>) => void },
  ): Promise<void> {
    ctx.waitUntil(rollup(env));
  },
} as const;
