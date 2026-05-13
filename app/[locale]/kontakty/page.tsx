import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { PhoneLink } from '@/components/layout/PhoneLink';
import { ogImageFor } from '@/lib/photos';
import { buildUrl, SITE } from '@/lib/utils';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isUk = locale === 'uk';
  const title = isUk
    ? 'Контакти ритуальної служби у Вінниці - телефон 24/7'
    : 'Контакты ритуальной службы в Виннице - телефон 24/7';
  const description = isUk
    ? 'Адреси відділень: Коновальця 83, Підлісна 2. Зали прощання - Арабея 1. Цілодобовий телефон, форма зворотного звʼязку.'
    : 'Адреса отделений: Коновальца 83, Подлесная 2. Залы прощания - Арабея 1. Круглосуточный телефон, форма обратной связи.';

  const og = ogImageFor('kontakty.main', SITE.url);

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('kontakty', locale as Locale),
      languages: {
        'uk-UA': buildUrl('kontakty', 'uk'),
        'ru-UA': buildUrl('kontakty', 'ru'),
        'x-default': buildUrl('kontakty', 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: buildUrl('kontakty', locale as Locale),
      locale: isUk ? 'uk_UA' : 'ru_UA',
      ...(og && { images: [og] }),
    },
    ...(og && {
      twitter: { card: 'summary_large_image' as const, title, description, images: [og.url] },
    }),
  };
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations('nav');
  const tContacts = await getTranslations('contacts');
  const isUk = locale === 'uk';

  return (
    <>
      <section className="hero-gradient">
        <div className="container-content py-10 md:py-16">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('contacts'), href: '/kontakty/' },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1>{tContacts('subtitle')}</h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            {/* Phone */}
            <div className="rounded-2xl border border-[--color-accent]/40 bg-[--color-accent-100] p-7">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[--color-ink-muted]">
                {tContacts('phone')}
              </h2>
              <div className="mt-3">
                <PhoneLink source="contacts-page" variant="large" />
              </div>

              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-center gap-2 text-[--color-ink-soft]">
                  <Phone className="h-4 w-4 text-[--color-accent]" aria-hidden />
                  <a href={`tel:${SITE.phoneAlt1}`} className="hover:text-[--color-accent]">
                    {SITE.phoneAlt1Display}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-[--color-ink-soft]">
                  <Mail className="h-4 w-4 text-[--color-accent]" aria-hidden />
                  <a
                    href={`mailto:${SITE.emailLead}`}
                    className="hover:text-[--color-accent]"
                  >
                    {SITE.emailLead}
                  </a>
                </li>
              </ul>

              <p className="mt-5 inline-flex items-center gap-2 text-sm text-[--color-ink-soft]">
                <Clock className="h-4 w-4" aria-hidden />
                {tContacts('schedule')}
              </p>
            </div>

            {/* Addresses */}
            <h2 className="mt-10 font-heading text-2xl font-medium md:text-3xl">
              {tContacts('addresses')}
            </h2>
            <div className="divider-gold mt-4 max-w-[60px]" />

            <ul className="mt-6 space-y-4">
              {SITE.addresses.map((a) => (
                <li
                  key={a.street}
                  className="flex items-start gap-4 rounded-2xl border border-[--color-border] bg-[--color-surface] p-6"
                >
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[--color-accent-100]">
                    <MapPin className="h-5 w-5 text-[--color-accent]" aria-hidden />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[--color-ink]">
                      {isUk ? a.street : a.streetRu}
                    </p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${a.lat}&mlon=${a.lon}&zoom=18`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-[--color-accent] hover:text-[--color-accent-700]"
                    >
                      {isUk ? 'Подивитись на карті -' : 'Посмотреть на карте -'}
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            {/* OpenStreetMap embed */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-[--color-border]">
              <iframe
                title={isUk ? 'Карта офісів' : 'Карта офисов'}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=28.40%2C49.20%2C28.50%2C49.25&layer=mapnik&marker=${SITE.addresses[0].lat}%2C${SITE.addresses[0].lon}`}
                className="h-[400px] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CallbackForm source="contacts-page" />
          </aside>
        </div>
      </section>
    </>
  );
}
