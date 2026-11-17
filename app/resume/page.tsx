import type { Metadata } from 'next';

import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import degrees from '@/data/resume/degrees';
import { skillGroups } from '@/data/resume/skills';
import work from '@/data/resume/work';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    "André Luís's Resume. Data Analyst at Cloudflare, previously Tripadvisor, NTT DATA and EDP.",
};

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <h1 className="resume-title">Resume</h1>
        </header>

        <ResumeNav />

        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} />
          </section>

          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          <section id="skills" className="resume-section">
            <Skills groups={skillGroups} />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
