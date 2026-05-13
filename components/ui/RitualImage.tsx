import { useLocale } from 'next-intl';
import {
  altText,
  getPhoto,
  photoUrl,
  sizesFor,
  srcSetFor,
  type PhotoVariant,
} from '@/lib/photos';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface RitualImageProps {
  photoKey: string;
  variant?: PhotoVariant;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  altOverride?: string;
}

export function RitualImage({
  photoKey,
  variant = 'card',
  priority = false,
  className,
  imgClassName,
  aspectRatio,
  altOverride,
}: RitualImageProps) {
  const locale = useLocale() as Locale;
  const entry = getPhoto(photoKey);
  if (!entry || !entry.src) return null;

  const alt = altOverride ?? altText(entry, locale);
  const sizes = sizesFor(variant);
  const objectPosition = entry.objectPosition ?? 'center';

  return (
    <figure
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={srcSetFor(entry.src, variant, 'avif')}
          sizes={sizes}
        />
        <source
          type="image/webp"
          srcSet={srcSetFor(entry.src, variant, 'webp')}
          sizes={sizes}
        />
        <img
          src={photoUrl(entry.src, variant, 'jpg')}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn('h-full w-full object-cover', imgClassName)}
          style={{ objectPosition }}
        />
      </picture>
    </figure>
  );
}
