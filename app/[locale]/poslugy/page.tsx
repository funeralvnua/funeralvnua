import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { jsonLdScript } from '@/lib/schema';
import { SITE, buildUrl } from '@/lib/utils';
import services from '@/data/services.json';

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
    ? 'Ритуальні послуги у Вінниці - повний перелік і ціни'
    : 'Ритуальные услуги в Виннице - полный перечень и цены';
  const description = isUk
    ? 'Усі ритуальні послуги у Вінниці: виклик агента 24/7, перевезення тіла, морг, кремація, військове поховання, катафалк, зали прощання. Ціни від міської служби.'
    : 'Все ритуальные услуги в Виннице: вызов агента 24/7, перевозка тела, морг, кремация, военные похороны, катафалк, залы прощания. Цены от городской службы.';

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('poslugy', locale as Locale),
      languages: {
        'uk-UA': buildUrl('poslugy', 'uk'),
        'ru-UA': buildUrl('poslugy', 'ru'),
        'x-default': buildUrl('poslugy', 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: buildUrl('poslugy', locale as Locale),
      locale: isUk ? 'uk_UA' : 'ru_UA',
    },
  };
}

export default async function ServicesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const isUk = locale === 'uk';
  const tNav = await getTranslations('nav');

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isUk ? 'Ритуальні послуги у Вінниці' : 'Ритуальные услуги в Виннице',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.title[loc],
      url: buildUrl(`poslugy/${s.slug}`, loc),
    })),
  };

  return (
    <>
      <section className="container-content pt-6 pb-10 md:pt-8 md:pb-4">
        <Breadcrumbs
          items={[
            { label: tNav('home'), href: '/' },
            { label: tNav('services'), href: '/poslugy/' },
          ]}
        />

        <div className="mt-6">
          <h1>
            {isUk ? 'Ритуальні послуги у Вінниці' : 'Ритуальные услуги в Виннице'}
          </h1>
          <div className="divider-gold mt-6 max-w-[80px]" />
        </div>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <p className="max-w-3xl text-lg text-[--color-ink-soft] md:text-xl">
            {isUk
              ? 'Повний цикл організації поховання - від виїзду агента та оформлення документів до памʼятника. Працюємо цілодобово по Вінниці та області, без передоплат.'
              : 'Полный цикл организации похорон - от выезда агента и оформления документов до памятника. Работаем круглосуточно по Виннице и области, без предоплат.'}
          </p>
          <a
            href={`tel:${SITE.phone}`}
            className="group inline-flex items-center gap-3 self-start rounded-full bg-[--color-emergency] px-6 py-3 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90 md:justify-self-end"
          >
            <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden />
            {SITE.phoneDisplay}
          </a>
        </div>
      </section>

      <ServiceGrid showHeading={false} />

      <section className="container-content pb-16 md:pb-24">
        <p className="text-base text-[--color-ink-soft]">
          {isUk ? 'Орієнтовна вартість пакетів послуг - на сторінці ' : 'Ориентировочная стоимость пакетов услуг - на странице '}
          <Link href="/tsiny/" className="font-semibold text-[--color-accent] hover:text-[--color-accent-700]">
            {isUk ? 'Ціни на ритуальні послуги' : 'Цены на ритуальные услуги'}
          </Link>
          .
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemListSchema)} />
    </>
  );
}
