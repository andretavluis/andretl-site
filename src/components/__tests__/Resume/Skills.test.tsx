import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Skills from '../../Resume/Skills';

const groups = [
  { name: 'Technical', color: 'red', skills: ['Python', 'SQL'] },
  { name: 'Platforms', color: 'blue', skills: ['Snowflake'] },
];

describe('Skills', () => {
  it('renders the section title', () => {
    render(<Skills groups={groups} />);

    expect(
      screen.getByRole('heading', { name: /skills/i, level: 3 }),
    ).toBeInTheDocument();
  });

  it('renders each group heading with its skills', () => {
    render(<Skills groups={groups} />);

    for (const g of groups) {
      expect(
        screen.getByRole('heading', { name: g.name, level: 4 }),
      ).toBeInTheDocument();
    }
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2);
    expect(within(lists[0]).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Snowflake')).toBeInTheDocument();
  });

  it('has no filter buttons', () => {
    render(<Skills groups={groups} />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps the skills anchor for the resume nav', () => {
    const { container } = render(<Skills groups={groups} />);

    expect(container.querySelector('#skills')).toBeInTheDocument();
  });
});
