import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ThemePortrait from '../../Template/ThemePortrait';

describe('ThemePortrait', () => {
  it('uses the 320px WebP portrait for both themes at width 160', () => {
    const { container } = render(<ThemePortrait width={160} height={160} />);

    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(2);
    for (const img of imgs) {
      expect(img).toHaveAttribute('src', '/images/me-320.webp');
    }
  });

  it('uses the smaller 160px WebP portrait at width 80', () => {
    const { container } = render(<ThemePortrait width={80} height={80} />);

    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(2);
    for (const img of imgs) {
      expect(img).toHaveAttribute('src', '/images/me-160.webp');
    }
  });

  it('loads eagerly with high fetch priority when priority is set', () => {
    const { container } = render(
      <ThemePortrait width={160} height={160} priority />,
    );

    const light = container.querySelector('.theme-portrait-light');
    expect(light).toHaveAttribute('loading', 'eager');
    expect(light).toHaveAttribute('fetchpriority', 'high');
  });

  it('lazy loads by default and hides the dark copy from assistive tech', () => {
    const { container } = render(<ThemePortrait width={80} height={80} />);

    expect(container.querySelector('.theme-portrait-light')).toHaveAttribute(
      'loading',
      'lazy',
    );
    expect(container.querySelector('.theme-portrait-dark')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});