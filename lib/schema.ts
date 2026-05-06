import type { LocalBusiness, WithContext } from 'schema-dts';
import { SITE, buildUrl } from './utils';
import type { Locale } from '@/i18n/routing';
import locations from '@/data/locations.json';

const NAME_BY_LOCALE: Record<Locale, string> = {
  uk: 'Вінницька міська ритуальна служба',
  ru: 'Винницкая городская ритуальная служба',
};

const REGION_BY_LOCALE: Record<Locale, string> = {
  uk: 'Вінницька область',
  ru: 'Винницкая область',
};

const CITY_BY_LOCALE: Record<Locale, string> = {
  uk: 'Вінниця',
  ru: 'Винница',
};

/**
 * Generate LocalBusiness (FuneralHome) JSON-LD with full areaServed list.
 */
export function getLocalBusinessSchema(locale: Locale): WithContext<LocalBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FuneralHome' as 'LocalBusiness',
    name: NAME_BY_LOCALE[locale],
    url: buildUrl('', locale),
    image: `${SITE.url}/og-default.jpg`,
    telephone: SITE.phone,
    priceRange: '₴₴-₴₴₴',
    address: SITE.addresses.map((a) => ({
      '@type': 'PostalAddress',
      streetAddress: locale === 'uk' ? a.street : a.streetRu,
      addressLocality: CITY_BY_LOCALE[locale],
      addressRegion: REGION_BY_LOCALE[locale],
      addressCountry: 'UA',
    })),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.addresses[0].lat,
      longitude: SITE.addresses[0].lon,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: locations.map((loc) => ({
      '@type': 'City',
      name: loc.name[locale],
    })),
  };
}

/**
 * Render JSON-LD into a <script> tag inside layout/page.
 */
export function jsonLdScript(data: object) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  };
}
