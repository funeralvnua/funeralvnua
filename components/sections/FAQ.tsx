import { useTranslations, useLocale } from 'next-intl';
import { Plus } from 'lucide-react';
import faq from '@/data/faq.json';
import type { Locale } from '@/i18n/routing';
import { jsonLdScript } from '@/lib/schema';

export function FAQ() {
  const t = useTranslations('faq');
  const locale = useLocale() as Locale;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q[locale],
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a[locale],
      },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-[--color-surface-alt] py-16 md:py-24"
    >
      <div className="container-content">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
          <h2 id="faq-heading" className="mt-3">
            {t('subtitle')}
          </h2>
        </div>

        <div className="mt-12 max-w-3xl">
          {faq.map((item, i) => (
            <details
              key={i}
              className="group border-b border-[--color-border] py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span className="text-lg font-semibold text-[--color-ink] transition-colors group-hover:text-[--color-accent]">
                  {item.q[locale]}
                </span>
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[--color-border] text-[--color-accent] transition-transform group-open:rotate-45">
                  <Plus className="h-4 w-4" aria-hidden />
                </span>
              </summary>
              <p className="mt-4 text-base text-[--color-ink-soft]">{item.a[locale]}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqSchema)}
      />
    </section>
  );
}
