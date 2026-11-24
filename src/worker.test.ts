import { afterEach, describe, expect, it, vi } from 'vitest';
import worker, { classifyDevice, referrerHost, rollup } from './worker';

function makeEnv() {
  return {
    ANALYTICS: { writeDataPoint: vi.fn() },
    DB: { prepare: vi.fn(), batch: vi.fn() },
    CF_ACCOUNT_ID: 'test-account',
    CF_API_TOKEN: 'test-token',
  };
}

function makeRequest(init?: RequestInit) {
  return new Request('https://andretl.com/api/track', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://andretl.com',
    },
    ...init,
  });
}

describe('classifyDevice', () => {
  it('detects bots, mobile and desktop', () => {
    expect(classifyDevice('Mozilla/5.0 (iPhone)')).toBe('mobile');
    expect(classifyDevice('Mozilla/5.0 (Windows NT 10.0)')).toBe('desktop');
    expect(classifyDevice('Googlebot/2.1')).toBe('bot');
  });
});

describe('referrerHost', () => {
  it('extracts the hostname or reports direct', () => {
    expect(referrerHost('https://www.linkedin.com/feed/')).toBe(
      'www.linkedin.com',
    );
    expect(referrerHost('')).toBe('direct');
    expect(referrerHost('not a url')).toBe('direct');
  });
});

describe('fetch handler', () => {
  it('records an event and returns 204', async () => {
    const env = makeEnv();
    const response = await worker.fetch(
      makeRequest({
        body: JSON.stringify({
          path: '/about/',
          referrer: 'https://google.com/',
        }),
      }),
      env,
    );

    expect(response.status).toBe(204);
    expect(env.ANALYTICS.writeDataPoint).toHaveBeenCalledWith({
      blobs: ['/about/', 'google.com', 'unknown', 'desktop'],
      indexes: ['v1'],
    });
  });

  it('rejects other methods and cross-origin calls', async () => {
    const env = makeEnv();
    expect(
      (await worker.fetch(makeRequest({ method: 'GET' }), env)).status,
    ).toBe(405);
    expect(
      (
        await worker.fetch(
          makeRequest({
            headers: {
              'content-type': 'application/json',
              origin: 'https://evil.com',
            },
          }),
          env,
        )
      ).status,
    ).toBe(403);
    expect(env.ANALYTICS.writeDataPoint).not.toHaveBeenCalled();
  });

  it('404s for unknown api paths', async () => {
    const response = await worker.fetch(
      new Request('https://andretl.com/api/other'),
      makeEnv(),
    );
    expect(response.status).toBe(404);
  });
});

describe('rollup', () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
    vi.useRealTimers();
  });

  it('deletes and reinserts events, and upserts daily_stats for yesterday (UTC) only', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-24T03:00:00Z'));

    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              timestamp: '2026-11-23 10:00:00',
              blob1: '/about/',
              blob2: 'google.com',
              blob3: 'PT',
              blob4: 'desktop',
              _sample_interval: 1,
            },
            {
              timestamp: '2026-11-23 11:00:00',
              blob1: '/about/',
              blob2: 'google.com',
              blob3: 'PT',
              blob4: 'desktop',
              _sample_interval: 1,
            },
            {
              timestamp: '2026-11-22 09:00:00',
              blob1: '/',
              blob2: 'direct',
              blob3: 'US',
              blob4: 'mobile',
              _sample_interval: 1,
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const statements: unknown[] = [];
    const prepare = vi.fn((sql: string) => ({
      bind: vi.fn((...args: unknown[]) => {
        const statement = { sql, args };
        statements.push(statement);
        return statement;
      }),
    }));
    const batch = vi.fn();
    const env = {
      ANALYTICS: { writeDataPoint: vi.fn() },
      CF_ACCOUNT_ID: 'test-account',
      CF_API_TOKEN: 'test-token',
      DB: { prepare, batch },
    };

    await rollup(env as unknown as Parameters<typeof rollup>[0]);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.cloudflare.com/client/v4/accounts/test-account/analytics_engine/sql',
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer test-token' },
      }),
    );

    // Only the 2026-11-23 rows should be processed (yesterday relative to the frozen clock).
    // 1 DELETE + 2 events INSERT + 1 daily_stats UPSERT = 4 statements.
    expect(statements).toHaveLength(4);
    expect(batch).toHaveBeenCalledWith(statements);
  });
});
