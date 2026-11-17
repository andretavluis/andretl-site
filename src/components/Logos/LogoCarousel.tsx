import { carouselLogos, logos } from '@/data/logos';

import BrandLogo from './BrandLogo';

/**
 * Continuously scrolling strip of logos (pure CSS, no client JS).
 * The list is rendered twice for a seamless loop. The second copy is hidden
 * from assistive tech and removed from the tab order.
 */
export default function LogoCarousel() {
  return (
    <section className="logo-carousel" aria-label="Companies and schools">
      <p className="logo-carousel-label">Where I've worked &amp; studied</p>
      <div className="logo-carousel-viewport">
        <div className="logo-carousel-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="logo-carousel-list"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {carouselLogos.map((key) => (
                <li key={key} className="logo-carousel-item">
                  <a
                    href={logos[key].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${logos[key].name} (opens in new tab)`}
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    <BrandLogo logo={key} decorative />
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
