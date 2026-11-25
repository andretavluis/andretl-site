interface ThemePortraitProps {
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

const PORTRAIT_VARIANTS = [
  { maxWidth: 80, src: '/images/me-160.webp' },
  { maxWidth: 160, src: '/images/me-320.webp' },
] as const;

/** Picks the smallest portrait asset that still covers 2x retina at the given display width. */
function getPortraitSrc(width: number): string {
  return (
    PORTRAIT_VARIANTS.find((v) => width <= v.maxWidth)?.src ??
    PORTRAIT_VARIANTS[PORTRAIT_VARIANTS.length - 1].src
  );
}

/**
 * Theme-aware portrait that swaps between light and dark mode images.
 *
 * Uses native <img> instead of next/image to:
 * - Avoid shipping next/image runtime for static export
 * - Reduce client-side JavaScript bundle
 *
 * CSS visibility toggling handles instant theme switching.
 * Non-visible image uses lazy loading to defer download until needed.
 */
export default function ThemePortrait({
  width,
  height,
  priority = false,
  className = '',
}: ThemePortraitProps) {
  const src = getPortraitSrc(width);

  return (
    <span className={`theme-portrait ${className}`}>
      {/* biome-ignore lint/performance/noImgElement: Using native img to avoid next/image runtime overhead for static export */}
      <img
        src={src}
        alt="André Luís"
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className="theme-portrait-light"
      />
      {/* biome-ignore lint/performance/noImgElement: Using native img to avoid next/image runtime overhead for static export */}
      <img
        src={src}
        alt="André Luís"
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="theme-portrait-dark"
        aria-hidden="true"
      />
    </span>
  );
}
