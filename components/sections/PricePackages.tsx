import { useTranslations, useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import packages from '@/data/packages.json';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function PricePackages() {
  const t = useTranslations('packages');
  const tCta = useTranslations('cta');
  const locale = useLocale() as Locale;

  return (
    <section
      aria-labelledby="packages-heading"
      className="bg-[--color-surface-alt] py-16 md:py-24"
    >
      <div className="container-content">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
          <h2 id="packages-heading" className="mt-3">
            {t('subtitle')}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {packages.map((p) => (
            <article
              key={p.slug}
              className={cn(
                'relative flex flex-col rounded-2xl border p-7 md:p-8',
                p.highlighted
                  ? 'border-[--color-accent] bg-[--color-surface-elev] shadow-[var(--shadow-glow)]'
                  : 'border-[--color-border] bg-[--color-surface]',
              )}
            >
              <h3 className="font-heading text-3xl text-[--color-ink]">{p.title[locale]}</h3>
              <p className="mt-1 text-sm text-[--color-ink-muted]">{p.subtitle[locale]}</p>

              <div className="mt-5 flex items-baseline gap-1">
                {p.priceFrom && (
                  <span className="text-sm text-[--color-ink-soft]">{t('from')}</span>
                )}
                <span className="font-heading text-5xl font-medium text-[--color-ink]">
                  {p.price.toLocaleString('uk-UA')}
                </span>
                <span className="text-xl text-[--color-ink-soft]">{t('currency')}</span>
              </div>

              <div className="divider-gold mt-6 max-w-[60px]" />

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.includes[locale].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[--color-accent]"
                      aria-hidden
                    />
                    <span className="text-[--color-ink-soft]">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="outline"
                className="mt-7 w-full"
              >
                <Link href="/tsiny/">{tCta('viewPrices')}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
