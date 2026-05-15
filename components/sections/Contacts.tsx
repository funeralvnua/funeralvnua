import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Clock } from 'lucide-react';
import { PhoneLink } from '@/components/layout/PhoneLink';
import { MessengerLinks } from '@/components/layout/MessengerLinks';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/utils';

export function Contacts() {
  const t = useTranslations('contacts');
  const locale = useLocale() as Locale;

  return (
    <section
      aria-labelledby="contacts-heading"
      className="container-content py-16 md:py-24"
    >
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
          {t('title')}
        </span>
        <h2 id="contacts-heading" className="mt-3">
          {t('subtitle')}
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-[--color-accent]/40 bg-[--color-accent-100] p-7">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[--color-accent]/20">
            <Phone className="h-5 w-5 text-[--color-accent]" aria-hidden />
          </div>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[--color-ink-muted]">
            {t('phone')}
          </h3>
          <div className="mt-3">
            <PhoneLink source="contacts" variant="large" />
          </div>
          <MessengerLinks className="mt-4" size="sm" />
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-[--color-ink-soft]">
            <Clock className="h-4 w-4" aria-hidden />
            {t('schedule')}
          </p>
        </div>

        <div className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-7 md:col-span-2">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[--color-accent-100]">
                <MapPin className="h-5 w-5 text-[--color-accent]" aria-hidden />
              </div>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[--color-ink-muted]">
                {t('addresses')}
              </h3>
              <ul className="mt-3 space-y-3 text-base">
                {SITE.addresses.map((a) => (
                  <li
                    key={a.street}
                    className="flex items-start gap-3 text-[--color-ink]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[--color-accent]" aria-hidden />
                    <span>{locale === 'uk' ? a.street : a.streetRu}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src="/logo.webp"
              alt={t('title')}
              width={180}
              height={180}
              sizes="(min-width: 768px) 180px, 140px"
              className="h-auto w-32 justify-self-center opacity-90 sm:w-44"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
