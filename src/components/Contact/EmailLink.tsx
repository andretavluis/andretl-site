import { CONTACT_EMAIL } from '@/lib/utils';

const [localPart, domain] = CONTACT_EMAIL.split('@');

export default function EmailLink() {
  return (
    <div className="contact-email-container">
      <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email-link">
        <span className="contact-email-prefix">{localPart}</span>
        <span className="contact-email-domain">@{domain}</span>
      </a>
    </div>
  );
}
