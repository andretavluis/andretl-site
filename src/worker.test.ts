import { describe, expect, it, vi } from 'vitest';
import worker, { classifyDevice, referrerHost } from './worker';

function makeEnv() {
  return {
    ANALYTICS: { writeDataPoint: vi.fn() },
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
