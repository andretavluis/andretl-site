import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { carouselLogos, logos } from '@/data/logos';

import BrandLogo from '../../Logos/BrandLogo';
import LogoCarousel from '../../Logos/LogoCarousel';

describe('BrandLogo', () => {
  it('renders an informative image by default', () => {
    render(<BrandLogo logo="cloudflare" />);

    const img = screen.getByAltText('Cloudflare logo');
    expect(img).toHaveAttribute('src', logos.cloudflare.src);
    expect(img).toHaveClass('brand-logo');
  });

  it('uses empty alt text when decorative', () => {
    const { container } = render(<BrandLogo logo="edp" decorative />);

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('reserves space using the intrinsic dimensions', () => {
    render(<BrandLogo logo="tripadvisor" />);

    const img = screen.getByAltText('Tripadvisor logo');
    expect(img).toHaveAttribute('width', String(logos.tripadvisor.width));
    expect(img).toHaveAttribute('height', String(logos.tripadvisor.height));
  });
});

describe('LogoCarousel', () => {
  it('contains the five requested logos', () => {
    expect(carouselLogos).toEqual([
      'cloudflare',
      'tripadvisor',
      'tecnicoLisboa',
      'novaIms',
      'edp',
    ]);
  });

  it('exposes one accessible link per logo to assistive tech', () => {
    render(<LogoCarousel />);

    for (const key of carouselLogos) {
      const link = screen.getByRole('link', {
        name: `${logos[key].name} (opens in new tab)`,
      });
      expect(link).toHaveAttribute('href', logos[key].url);
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('hides the duplicated loop copy from assistive tech and the tab order', () => {
    const { container } = render(<LogoCarousel />);

    const lists = container.querySelectorAll('.logo-carousel-list');
    expect(lists).toHaveLength(2);
    expect(lists[0]).not.toHaveAttribute('aria-hidden');
    expect(lists[1]).toHaveAttribute('aria-hidden', 'true');
    for (const link of lists[1].querySelectorAll('a')) {
      expect(link).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('logo data', () => {
  it('has a url and size for every logo', () => {
    for (const logo of Object.values(logos)) {
      expect(logo.url).toMatch(/^https:\/\//);
      expect(logo.src.startsWith('/images/logos/')).toBe(true);
      expect(logo.width).toBeGreaterThan(0);
      expect(logo.height).toBeGreaterThan(0);
    }
  });

  it('points every logo at an existing, reasonably small file in public/', () => {
    for (const logo of Object.values(logos)) {
      const file = join(process.cwd(), 'public', logo.src);

      expect(existsSync(file), `${logo.src} should exist`).toBe(true);
      expect(statSync(file).size, `${logo.src} size`).toBeLessThan(30 * 1024);
    }
  });
});
