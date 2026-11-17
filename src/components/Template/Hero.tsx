import Link from 'next/link';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={160} height={160} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">André Luís</span>
        </h1>

        <p className="hero-tagline">
          Data Analyst at{' '}
          <a href="https://www.cloudflare.com" className="hero-highlight">
            Cloudflare
          </a>
          , turning abuse signals into insights for the Trust & Safety and
          Security teams.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">Fraud &amp; Abuse Analytics</span>
          <span className="hero-chip">
            MSc Data Science and Engineering, IST Lisbon
          </span>
        </div>

        <div className="hero-cta">
          <Link href="/about" className="button button-primary">
            About Me
          </Link>
          <Link href="/resume" className="button button-secondary">
            View Resume
          </Link>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
      </div>
    </section>
  );
}
