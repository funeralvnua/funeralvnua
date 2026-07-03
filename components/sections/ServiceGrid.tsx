import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import services from '@/data/services.json';
import { RitualImage } from '@/components/ui/RitualImage';
import { getPhoto } from '@/lib/photos';
import type { Locale } from '@/i18n/routing';

type ServiceGroup = 'urgent' | 'transport' | 'special' | 'ceremonial';

const GROUPS: { key: ServiceGroup; tKey: 'groupUrgent' | 'groupTransport' | 'groupSpecial' | 'groupCeremonial' }[] = [
  { key: 'urgent', tKey: 'groupUrgent' },
  { key: 'transport', tKey: 'groupTransport' },
  { key: 'special', tKey: 'groupSpecial' },
  { key: 'ceremonial', tKey: 'groupCeremonial' },
];

export function ServiceGrid({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations('services');
  const tCta = useTranslations('cta');
  const locale = useLocale() as Locale;

  return (
    <section
      id="poslugy"
      aria-labelledby={showHeading ? 'services-heading' : undefined}
      className={showHeading ? 'container-content py-16 md:py-24' : 'container-content pb-16 md:pb-24'}
    >
      {showHeading && (
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
          <h2 id="services-heading" className="mt-3">{t('subtitle')}</h2>
        </div>
      )}

      <div className={showHeading ? 'mt-14 space-y-16' : 'space-y-16'}>
        {GROUPS.map((group) => {
          const items = services.filter((s) => s.group === group.key);
          return (
            <div key={group.key}>
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-2xl font-medium text-[--color-ink] md:text-3xl">
                  {t(group.tKey)}
                </h3>
                <div className="divider-gold flex-1" />
              </div>

              <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => {
                  const photoKey = `poslugy.${s.slug}`;
                  const hasPhoto = getPhoto(photoKey) !== null;
                  return (
                    <li key={s.slug}>
                      <Link
                        href={`/poslugy/${s.slug}/`}
                        className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-surface]"
                      >
                        {/* Фото-банер */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[--color-surface-alt]">
                          {hasPhoto && (
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                              <RitualImage
                                photoKey={photoKey}
                                variant="card"
                                className="h-full w-full"
                              />
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        </div>

                        {/* Тіло */}
                        <div className="flex flex-1 flex-col p-6">
                          <h4 className="text-lg font-semibold text-[--color-ink]">
                            {s.title[locale]}
                          </h4>
                          <p className="mt-2 text-sm text-[--color-ink-soft]">
                            {s.intro[locale]}
                          </p>
                          <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[--color-accent]">
                            {tCta('learnMore')}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
