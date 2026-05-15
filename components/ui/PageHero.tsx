import type { ReactNode } from 'react';
import { RitualImage } from '@/components/ui/RitualImage';
import { getPhoto } from '@/lib/photos';

interface PageHeroProps {
  photoKey: string;
  breadcrumbs?: ReactNode;
  title: string;
  description?: string;
  meta?: ReactNode;
  cta?: ReactNode;
}

export function PageHero({
  photoKey,
  breadcrumbs,
  title,
  description,
  meta,
  cta,
}: PageHeroProps) {
  const hasPhoto = getPhoto(photoKey) !== null;

  return (
    <section className="container-content pt-6 pb-10 md:pt-8 md:pb-14">
      {breadcrumbs}

      {hasPhoto && (
        <RitualImage
          photoKey={photoKey}
          variant="hero"
          priority
          aspectRatio="16 / 7"
          className="mt-6 overflow-hidden rounded-2xl shadow-lg ring-1 ring-[--color-border]"
        />
      )}

      <div className="mt-8 max-w-3xl md:mt-10">
        <h1>{title}</h1>
        <div className="divider-gold mt-6 max-w-[80px]" />
        {description && (
          <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
            {description}
          </p>
        )}
        {meta}
        {cta && <div className="mt-8">{cta}</div>}
      </div>
    </section>
  );
}
