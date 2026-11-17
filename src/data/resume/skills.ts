export interface SkillGroup {
  name: string;
  /** CSS color used for the group's title and pills */
  color: string;
  skills: string[];
}

/** Main skills only, shown as plain tags grouped by type. */
export const skillGroups: SkillGroup[] = [
  {
    name: 'Technical',
    color: 'var(--color-skill-1)',
    skills: ['Python', 'SQL', 'dbt', 'Git', 'CI/CD'],
  },
  {
    name: 'Platforms',
    color: 'var(--color-skill-2)',
    skills: [
      'Google BigQuery',
      'Snowflake',
      'Tableau',
      'Power BI',
      'Celonis',
      'Azure',
      'GitLab',
      'OpenCode',
    ],
  },
  {
    name: 'Domains',
    color: 'var(--color-skill-5)',
    skills: [
      'Network Traffic Analysis',
      'Trust & Safety Analytics',
      'Fraud Prevention',
      'Detection Engineering',
      'KPI Definition',
      'Data Visualization',
    ],
  },
];
