'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, Phone, MapPin } from 'lucide-react';
import locations from '@/data/locations.json';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Group = 'vinnytsia-raion' | 'vinnytsia-oblast';

export function ServiceArea() {
  const t = useTranslations('serviceArea');
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<Group>('vinnytsia-raion');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations
      .filter((l) => l.group === activeGroup)
      .filter((l) => !q || l.name[locale].toLowerCase().includes(q))
      .sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
  }, [query, activeGroup, locale]);

  const groups: { key: Group; label: string }[] = [
    { key: 'vinnytsia-raion', label: t('tabRaion') },
    { key: 'vinnytsia-oblast', label: t('tabOblast') },
  ];

  return (
    <section
      aria-labelledby="service-area-heading"
      className="container-content py-16 md:py-24"
    >
      <div className="flex items-start gap-4">
        <MapPin className="mt-1 h-6 w-6 shrink-0 text-[--color-accent]" aria-hidden />
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
          <h2 id="service-area-heading" className="mt-3">
            {t('lead')}
          </h2>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[--color-ink-muted]"
            aria-hidden
          />
          <label htmlFor="loc-search" className="sr-only">
            {t('search')}
          </label>
          <input
            id="loc-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            className="h-12 w-full rounded-md border border-[--color-border] bg-[--color-surface] pl-12 pr-4 text-base text-[--color-ink] placeholder:text-[--color-ink-muted] focus:border-[--color-accent] focus-visible:outline-none"
          />
        </div>

        <div
          role="tablist"
          aria-label={t('title')}
          className="inline-flex rounded-md border border-[--color-border] bg-[--color-surface] p-1"
        >
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              role="tab"
              id={`tab-${g.key}`}
              aria-selected={activeGroup === g.key}
              aria-controls={`panel-${g.key}`}
              tabIndex={activeGroup === g.key ? 0 : -1}
              onClick={() => setActiveGroup(g.key)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                activeGroup === g.key
                  ? 'bg-[--color-accent] text-[--color-bg]'
                  : 'text-[--color-ink-soft] hover:text-[--color-ink]',
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeGroup}`}
        aria-labelledby={`tab-${activeGroup}`}
      >
        {filtered.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((l) => (
              <li
                key={l.slug}
                className="flex items-baseline justify-between gap-3 border-b border-[--color-border-soft] py-3 transition-colors hover:border-[--color-accent]"
              >
                <span className="text-base text-[--color-ink]">{l.name[locale]}</span>
                <small className="shrink-0 font-mono text-xs text-[--color-ink-muted]">
                  ~{l.distanceKm} {t('kmShort')}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-[--color-ink-soft]">{t('noResults')}</p>
        )}
      </div>

      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-[--color-accent]/30 bg-[--color-accent-100] p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <p className="text-base text-[--color-ink]">
          <strong className="block text-lg">{t('notFound')}</strong>
          <span className="mt-1 inline-block text-[--color-ink-soft]">{t('notFoundCta')}</span>
        </p>
        <a
          href={`tel:${SITE.phone}`}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[--color-accent] px-6 py-3 font-semibold tracking-wide text-[--color-bg] shadow-[var(--shadow-glow)] transition-all hover:bg-[--color-accent-700] hover:shadow-md"
        >
          <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden />
          {SITE.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
