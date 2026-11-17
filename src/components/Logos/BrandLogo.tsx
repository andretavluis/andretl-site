import { type LogoKey, logos } from '@/data/logos';

interface BrandLogoProps {
  logo: LogoKey;
  className?: string;
  /** Decorative logos sit next to the organisation's name, so they get empty alt text */
  decorative?: boolean;
}

/**
 * Brand logo rendered with a native <img> (static export, no next/image runtime).
 * Colour handling (greyscale, dark mode) lives in CSS: see components/logos.css.
 */
export default function BrandLogo({
  logo,
  className = '',
  decorative = false,
}: BrandLogoProps) {
  const { name, src, width, height } = logos[logo];

  return (
    // biome-ignore lint/performance/noImgElement: Using native img to avoid next/image runtime overhead for static export
    <img
      src={src}
      alt={decorative ? '' : `${name} logo`}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={`brand-logo ${className}`.trim()}
    />
  );
}
