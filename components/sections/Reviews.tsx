import { useTranslations, useLocale } from 'next-intl';
import { Quote } from 'lucide-react';
import reviews from '@/data/reviews.json';
import type { Locale } from '@/i18n/routing';

export function Reviews() {
  const t = useTranslations('reviews');
  const locale = useLocale() as Locale;

  return (
    <section
      aria-labelledby="reviews-heading"
      className="bg-[--color-surface-alt] py-16 md:py-24"
    >
      <div className="container-content">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
          <h2 id="reviews-heading" className="mt-3">
            {t('subtitle')}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex flex-col rounded-2xl border border-[--color-border] bg-[--color-surface] p-7"
            >
              <Quote className="h-7 w-7 text-[--color-accent] opacity-70" aria-hidden />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-[--color-ink]">
                {r.text[locale]}
              </blockquote>
              <div className="divider-gold mt-6 max-w-[40px]" />
              <footer className="mt-4 text-sm">
                <span className="font-semibold text-[--color-ink]">{r.author[locale]}</span>
                <span className="mx-2 text-[--color-ink-muted]">·</span>
                <time
                  dateTime={r.date}
                  className="text-[--color-ink-muted]"
                >
                  {new Date(r.date).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
