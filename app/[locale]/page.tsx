import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { PricePackages } from '@/components/sections/PricePackages';
import { Trust } from '@/components/sections/Trust';
import { Reviews } from '@/components/sections/Reviews';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { FAQ } from '@/components/sections/FAQ';
import { Contacts } from '@/components/sections/Contacts';
import { buildUrl } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isUk = locale === 'uk';

  const title = isUk
    ? 'Ритуальні послуги у Вінниці 24/7 - організація поховань | ВМРС'
    : 'Ритуальные услуги в Виннице 24/7 - организация похорон | ВМРС';

  const description = isUk
    ? 'Цілодобова організація поховань у Вінниці та області. Виклик ритуального агента безкоштовно, без передоплат. Понад 25 років допомоги родинам - від документів до памʼятника.'
    : 'Круглосуточная организация похорон в Виннице и области. Вызов ритуального агента бесплатно, без предоплат. Более 25 лет помощи семьям - от документов до памятника.';

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('', locale as Locale),
      languages: {
        'uk-UA': buildUrl('', 'uk'),
        'ru-UA': buildUrl('', 'ru'),
        'x-default': buildUrl('', 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: buildUrl('', locale as Locale),
      locale: isUk ? 'uk_UA' : 'ru_UA',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServiceGrid />
      <PricePackages />
      <Trust />
      <Reviews />
      <ServiceArea />
      <FAQ />
      <Contacts />
    </>
  );
}
