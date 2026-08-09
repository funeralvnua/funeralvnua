import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Phone } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { PageHero } from '@/components/ui/PageHero';
import { jsonLdScript } from '@/lib/schema';
import { ogImageFor } from '@/lib/photos';
import { SITE, buildUrl } from '@/lib/utils';
import offices from '@/data/offices.json';

type RouteParams = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    offices.map((o) => ({ locale, slug: o.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const office = offices.find((o) => o.slug === slug);
  if (!office) return {};

  const loc = locale as Locale;
  const isUk = locale === 'uk';
  const subPath = `lokatsiyi/${slug}`;
  // Адреса — на початку тайтла: сторінка локації має вигравати адресні запити
  // («генерала арабея 1»), а не сторінка послуги /poslugy/zal-proshchannya/.
  const title = isUk ? office.metaTitle.uk : office.metaTitle.ru;

  const og = ogImageFor(`office.${slug}`, SITE.url);

  return {
    title,
    description: office.description[loc],
    alternates: {
      canonical: buildUrl(subPath, loc),
      languages: {
        'uk-UA': buildUrl(subPath, 'uk'),
        'ru-UA': buildUrl(subPath, 'ru'),
        'x-default': buildUrl(subPath, 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description: office.description[loc],
      url: buildUrl(subPath, loc),
      locale: isUk ? 'uk_UA' : 'ru_UA',
      ...(og && { images: [og] }),
    },
    ...(og && {
      twitter: {
        card: 'summary_large_image' as const,
        title,
        description: office.description[loc],
        images: [og.url],
      },
    }),
  };
}

export default async function OfficePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const office = offices.find((o) => o.slug === slug);
  if (!office) notFound();

  const loc = locale as Locale;
  const isUk = locale === 'uk';
  const tNav = await getTranslations('nav');

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'FuneralHome',
    name: office.title[loc],
    description: office.description[loc],
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.address[loc],
      addressLocality: isUk ? 'Вінниця' : 'Винница',
      addressRegion: isUk ? 'Вінницька область' : 'Винницкая область',
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: office.lat,
      longitude: office.lon,
    },
    telephone: office.phone,
    url: buildUrl(`lokatsiyi/${slug}`, loc),
    openingHours: 'Mo-Su 00:00-23:59',
  };

  return (
    <>
      <PageHero
        photoKey={`office.${slug}`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('contacts'), href: '/kontakty/' },
              { label: office.title[loc], href: `/lokatsiyi/${slug}/` },
            ]}
          />
        }
        title={office.title[loc]}
        description={office.description[loc]}
      />

      <section className="container-content py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            {/* Info cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[--color-accent-100]">
                  <MapPin className="h-5 w-5 text-[--color-accent]" aria-hidden />
                </div>
                <h2 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[--color-ink-muted]">
                  {isUk ? 'Адреса' : 'Адрес'}
                </h2>
                <p className="mt-2 text-base text-[--color-ink]">{office.address[loc]}</p>
                <p className="mt-1 text-sm text-[--color-ink-soft]">
                  {isUk ? 'Район:' : 'Район:'} {office.district[loc]}
                </p>
              </div>

              <div className="rounded-2xl border border-[--color-accent]/40 bg-[--color-accent-100] p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[--color-accent]/20">
                  <Phone className="h-5 w-5 text-[--color-accent]" aria-hidden />
                </div>
                <h2 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[--color-ink-muted]">
                  {isUk ? 'Телефон' : 'Телефон'}
                </h2>
                <a
                  href={`tel:${office.phone}`}
                  className="mt-2 block font-heading text-2xl text-[--color-accent] hover:text-[--color-accent-700]"
                >
                  {office.phoneDisplay}
                </a>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-[--color-ink-soft]">
                  <Clock className="h-4 w-4" aria-hidden />
                  {office.schedule}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-[--color-border]">
              <iframe
                title={isUk ? 'Карта офісу' : 'Карта офиса'}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${office.lon - 0.005}%2C${office.lat - 0.005}%2C${office.lon + 0.005}%2C${office.lat + 0.005}&layer=mapnik&marker=${office.lat}%2C${office.lon}`}
                className="h-[400px] w-full border-0"
                loading="lazy"
              />
            </div>

            <p className="mt-4 text-sm text-[--color-ink-soft]">
              <a
                href={`https://www.openstreetmap.org/?mlat=${office.lat}&mlon=${office.lon}&zoom=18`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--color-accent] hover:text-[--color-accent-700]"
              >
                {isUk ? 'Прокласти маршрут на OpenStreetMap -' : 'Проложить маршрут на OpenStreetMap -'}
              </a>
            </p>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CallbackForm source={`office-${slug}`} />
          </aside>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(businessSchema)} />
    </>
  );
}
