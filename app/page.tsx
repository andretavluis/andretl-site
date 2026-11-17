import type { Metadata } from 'next';

import LogoCarousel from '@/components/Logos/LogoCarousel';
import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';

export const metadata: Metadata = {
  description:
    'Data Analyst at Cloudflare working on Trust & Safety analytics and abuse detection. Previously Tripadvisor. MSc in Data Science and Engineering from IST Lisbon.',
};

export default function HomePage() {
  return (
    <PageWrapper>
      <PersonSchema />
      <Hero />
      <LogoCarousel />
    </PageWrapper>
  );
}
