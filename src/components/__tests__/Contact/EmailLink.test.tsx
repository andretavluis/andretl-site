import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmailLink from '../../Contact/EmailLink';

describe('EmailLink', () => {
  it('renders the full email address', () => {
    render(<EmailLink />);

    expect(screen.getByText('aluis6847')).toBeInTheDocument();
    expect(screen.getByText('@gmail.com')).toBeInTheDocument();
  });

  it('links to a mailto for the contact address', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('mailto:aluis6847@gmail.com');
  });

  it('keeps the contact link styling class', () => {
    render(<EmailLink />);

    expect(screen.getByRole('link')).toHaveClass('contact-email-link');
  });
});
