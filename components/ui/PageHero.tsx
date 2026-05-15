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

      <div className="mt-6">
        <h1>{title}</h1>
        <div className="divider-gold mt-6 max-w-[80px]" />
      </div>

      {hasPhoto && (
        <RitualImage
          photoKey={photoKey}
          variant="hero"
          priority
          aspectRatio="16 / 7"
          className="mt-8 overflow-hidden rounded-2xl shadow-lg ring-1 ring-[--color-border] md:mt-10"
        />
      )}

      <div className="mt-8 md:mt-10">
        {description && cta ? (
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <p className="max-w-3xl text-lg text-[--color-ink-soft] md:text-xl">
              {description}
            </p>
            <div className="md:justify-self-end">{cta}</div>
          </div>
        ) : (
          <div className="max-w-3xl">
            {description && (
              <p className="text-lg text-[--color-ink-soft] md:text-xl">
                {description}
              </p>
            )}
            {cta && <div className="mt-8">{cta}</div>}
          </div>
        )}
        {meta && <div className="mt-6 max-w-3xl">{meta}</div>}
      </div>
    </section>
  );
}
