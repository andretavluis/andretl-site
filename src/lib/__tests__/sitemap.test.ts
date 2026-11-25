import { describe, expect, it } from 'vitest';

import sitemap from '../../../app/sitemap';

describe('sitemap', () => {
  it('only lists pages that exist', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual([
      'https://andretl.com',
      'https://andretl.com/about',
      'https://andretl.com/resume',
      'https://andretl.com/stats',
      'https://andretl.com/contact',
    ]);
  });
});
