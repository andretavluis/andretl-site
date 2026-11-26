import type { Metadata } from 'next';

import ContactForm from '@/components/Contact/ContactForm';

import PageWrapper from '@/components/Template/PageWrapper';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in Touch',
};

export default function ContactPage() {
  return (
    <PageWrapper>
      <section className="contact-page">
        <header className="contact-header">
          <h1 className="page-title">Get in Touch</h1>
        </header>

        <div className="contact-content">
          <ContactForm />
        </div>
      </section>
    </PageWrapper>
  );
}
