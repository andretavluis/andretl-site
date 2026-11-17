import { describe, expect, it } from 'vitest';

import { skillGroups } from '../resume/skills';

const group = (name: string) => skillGroups.find((g) => g.name === name);

describe('skills data', () => {
  it('has the three expected groups in order', () => {
    expect(skillGroups.map((g) => g.name)).toEqual([
      'Technical',
      'Platforms',
      'Domains',
    ]);
  });

  it('technical skills', () => {
    expect(group('Technical')?.skills).toEqual([
      'Python',
      'SQL',
      'dbt',
      'Git',
      'CI/CD',
    ]);
  });

  it('platforms include OpenCode', () => {
    expect(group('Platforms')?.skills).toContain('OpenCode');
  });

  it('domains start with Network Traffic Analysis and exclude ETL', () => {
    const domains = group('Domains')?.skills ?? [];

    expect(domains[0]).toBe('Network Traffic Analysis');
    expect(domains).toContain('Trust & Safety Analytics');
    expect(domains).toContain('Fraud Prevention');
    expect(domains).toContain('Detection Engineering');
    expect(domains).not.toContain('ETL');
    expect(domains).not.toContain('Abuse Detection');
    expect(domains).not.toContain('Financial Fraud');
  });

  it('gives each group a distinct color', () => {
    const colors = skillGroups.map((g) => g.color);

    expect(new Set(colors).size).toBe(colors.length);
  });

  it('has no empty groups and no duplicate skills', () => {
    const all = skillGroups.flatMap((g) => g.skills);

    for (const g of skillGroups) {
      expect(g.skills.length).toBeGreaterThan(0);
    }
    expect(new Set(all).size).toBe(all.length);
  });
});
