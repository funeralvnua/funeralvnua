import { useTranslations, useLocale } from 'next-intl';
import * as Icons from 'lucide-react';
import { Link } from '@/i18n/navigation';
import services from '@/data/services.json';
import type { Locale } from '@/i18n/routing';

interface Props {
  /** List of related service slugs from frontmatter. */
  slugs: string[];
}

export function RelatedServices({ slugs }: Props) {
  const tCta = useTranslations('cta');
  const locale = useLocale() as Locale;

  const items = slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2 id="related-heading" className="font-heading text-2xl font-medium md:text-3xl">
        Супутні послуги
      </h2>
      <div className="divider-gold mt-4 max-w-[60px]" />

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => {
          const IconComponent =
            (Icons as unknown as Record<string, React.FC<{ className?: string; 'aria-hidden'?: boolean }>>)[
              s.icon
            ] ?? Icons.Circle;
          return (
            <li key={s.slug}>
              <Link
                href={`/poslugy/${s.slug}/`}
                className="card-hover group block h-full rounded-xl border border-[--color-border] bg-[--color-surface] p-6"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[--color-accent-100]">
                  <IconComponent className="h-4 w-4 text-[--color-accent]" aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[--color-ink]">
                  {s.title[locale]}
                </h3>
                <p className="mt-1 text-sm text-[--color-ink-soft]">{s.intro[locale]}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[--color-accent]">
                  {tCta('learnMore')}
                  <Icons.ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
