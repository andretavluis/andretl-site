/**
 * Conforms to https://jsonresume.org/schema/
 */
import type { LogoKey } from '../logos';

export interface Position {
  name: string;
  logo?: LogoKey;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

const work: Position[] = [
  {
    name: 'Cloudflare',
    logo: 'cloudflare',
    position: 'Data Analyst',
    url: 'https://www.cloudflare.com',
    startDate: '2025-05-01',
    summary: `Supporting Trust & Safety and Security teams in threat research, abuse identification and telemetry.`,
    highlights: [
      'Rebuilt the Trust & Safety analytics layer into a single source of truth, consolidated dozens of dashboards into a small set of authoritative ones, and added automated alerting across multiple abuse categories.',
      'Aggregated cross-platform abuse signals into a unified detection pipeline, enabling automatic identification and remediation of fraudulent sign-ups at scale.',
    ],
  },
  {
    name: 'Tripadvisor',
    logo: 'tripadvisor',
    position: 'Data Analyst',
    url: 'https://www.tripadvisor.com',
    startDate: '2024-02-01',
    endDate: '2025-05-01',
    summary: `Supported the B2B Revenue Operations, Marketing and Product teams.`,
    highlights: [
      'Helped build the new Tripadvisor Management Center, serving 400k+ monthly active users.',
      'Developed ETL processes, automated reports and dashboards (SQL, Snowflake, Tableau) that informed decisions for a range of stakeholders.',
      'Supported RevOps with data on Key Accounts, Sales Representatives and vendors.',
    ],
  },
  {
    name: 'NTT DATA Europe & Latam',
    logo: 'nttData',
    position: 'Data & Analytics Engineer',
    url: 'https://www.nttdata.com',
    startDate: '2022-10-01',
    endDate: '2024-01-01',
    summary: `Focused on Agile software development for Data & BI projects within the Public Sector.`,
    highlights: [
      'Managed stakeholders to identify project milestones and extract critical business requirements.',
      'Designed ETL processes for seamless data migration between various databases.',
      'Conducted data analysis to identify quality bottlenecks and derive key performance indicators (KPIs).',
      'Created interactive dashboards to improve organizational decision-making.',
    ],
  },
  {
    name: 'XAMI LAB',
    logo: 'xamiLab',
    position: 'MSc Student Researcher',
    url: '',
    startDate: '2022-02-01',
    endDate: '2022-11-01',
    highlights: [
      'Developed an MSc thesis using Deep Learning techniques for object detection in Chest X-ray images.',
      'Researched the use of human fixation patterns to predict lesions in medical imaging.',
    ],
  },
  {
    name: 'NOVA SBE Data Science Knowledge Center',
    logo: 'novaSbe',
    position: 'Junior Data Consultant',
    url: '',
    startDate: '2022-03-01',
    endDate: '2022-09-01',
    highlights: [
      'Assisted in building the largest open data platform for the Portuguese social sector.',
      "Engaged with various organizations to foster collaboration and enrich the platform's data relevance.",
      'Maintained and enhanced the platform website to ensure ongoing functionality.',
    ],
  },
  {
    name: 'EDP',
    logo: 'edp',
    position: 'Data Science Intern',
    url: 'https://www.edp.com',
    startDate: '2021-07-01',
    endDate: '2021-08-01',
    summary: `Applied data science to predict the best locations for electric car chargers in Portugal, using Python and Azure Machine Learning.`,
    highlights: [
      'Deployed tabular machine learning models, including Random Forests and XGBoost.',
      'Tackled class imbalance, feature engineering, hyperparameter optimization and model explainability.',
    ],
  },
];

export default work;
