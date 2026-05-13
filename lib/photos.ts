import photosData from '@/data/photos.json';
import type { Locale } from '@/i18n/routing';

export type PhotoVariant = 'hero' | 'card' | 'thumb' | 'og';
export type PhotoFormat = 'avif' | 'webp' | 'jpg';

export interface PhotoEntry {
  src: string | null;
  alt: { uk: string; ru: string };
  objectPosition?: string;
  sensitive?: boolean;
  cropNote?: string;
  todo?: string;
}

const photos = photosData as unknown as Record<string, PhotoEntry>;

export function getPhoto(key: string): PhotoEntry | null {
  const entry = photos[key];
  if (!entry || !entry.src) return null;
  return entry;
}

export function photoUrl(
  src: string,
  variant: PhotoVariant,
  format: PhotoFormat,
  retina = false,
): string {
  const suffix = variant === 'hero' && retina ? 'hero@2x' : variant;
  return `/images/${src}-${suffix}.${format}`;
}

export function altText(entry: PhotoEntry, locale: Locale): string {
  return entry.alt[locale] ?? entry.alt.uk;
}

const SIZES_BY_VARIANT: Record<PhotoVariant, string> = {
  hero: '100vw',
  card: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  thumb: '(min-width: 1024px) 200px, 50vw',
  og: '1200px',
};

export function sizesFor(variant: PhotoVariant): string {
  return SIZES_BY_VARIANT[variant];
}

export function srcSetFor(
  src: string,
  variant: PhotoVariant,
  format: PhotoFormat,
): string {
  if (variant === 'hero') {
    return `${photoUrl(src, 'hero', format)} 1920w, ${photoUrl(src, 'hero', format, true)} 2560w`;
  }
  if (variant === 'card') {
    return `${photoUrl(src, 'thumb', format)} 400w, ${photoUrl(src, 'card', format)} 800w`;
  }
  return photoUrl(src, variant, format);
}

/**
 * Open Graph image URL для метаданих сторінки.
 * Повертає абсолютний URL (1200×630 JPG) для openGraph.images у Next metadata,
 * або null, якщо фото не задано — тоді спрацює дефолтний opengraph-image.tsx.
 */
export function ogImageFor(
  photoKey: string,
  siteUrl: string,
): { url: string; alt: string; width: number; height: number } | null {
  const entry = getPhoto(photoKey);
  if (!entry || !entry.src) return null;
  return {
    url: `${siteUrl}${photoUrl(entry.src, 'og', 'jpg')}`,
    alt: entry.alt.uk,
    width: 1200,
    height: 630,
  };
}
