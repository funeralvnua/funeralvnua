import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone, Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { routing, type Locale } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { RitualImage } from '@/components/ui/RitualImage';
import { jsonLdScript } from '@/lib/schema';
import { getPhoto, ogImageFor } from '@/lib/photos';
import { SITE, buildUrl, cn } from '@/lib/utils';
import packages from '@/data/packages.json';

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
    ? 'Ціни на ритуальні послуги у Вінниці - пакети та прайс'
    : 'Цены на ритуальные услуги в Виннице - пакеты и прайс';
  const description = isUk
    ? 'Прозорі ціни на ритуальні послуги у Вінниці. Пакети Економ (12 000 ₴), Стандарт (20 000 ₴), Еліт (від 45 000 ₴). Без прихованих платежів.'
    : 'Прозрачные цены на ритуальные услуги в Виннице. Пакеты Эконом (12 000 ₴), Стандарт (20 000 ₴), Элит (от 45 000 ₴). Без скрытых платежей.';

  const og = ogImageFor('tsiny.premium', SITE.url);

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('tsiny', locale as Locale),
      languages: {
        'uk-UA': buildUrl('tsiny', 'uk'),
        'ru-UA': buildUrl('tsiny', 'ru'),
        'x-default': buildUrl('tsiny', 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: buildUrl('tsiny', locale as Locale),
      locale: isUk ? 'uk_UA' : 'ru_UA',
      ...(og && { images: [og] }),
    },
    ...(og && {
      twitter: { card: 'summary_large_image' as const, title, description, images: [og.url] },
    }),
  };
}

export default async function PricesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations('nav');
  const tPkg = await getTranslations('packages');
  const isUk = locale === 'uk';
  const loc = locale as Locale;

  // Schema.org Service з Offer-ами для SEO
  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isUk
      ? 'Ритуальні послуги - пакети у Вінниці'
      : 'Ритуальные услуги - пакеты в Виннице',
    provider: {
      '@type': 'FuneralHome',
      name: isUk
        ? 'Вінницька міська ритуальна служба'
        : 'Винницкая городская ритуальная служба',
      url: SITE.url,
      telephone: SITE.phone,
    },
    areaServed: { '@type': 'City', name: isUk ? 'Вінниця' : 'Винница' },
    offers: packages.map((p) => ({
      '@type': 'Offer',
      name: p.title[loc],
      description: p.subtitle[loc],
      price: p.price,
      priceCurrency: 'UAH',
      availability: 'https://schema.org/InStock',
    })),
  };

  return (
    <>
      <section className="hero-gradient">
        <div className="container-content py-10 md:py-16">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('prices'), href: '/tsiny/' },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1>
              {isUk
                ? 'Ціни на ритуальні послуги у Вінниці'
                : 'Цены на ритуальные услуги в Виннице'}
            </h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">{tPkg('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="container-content py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {packages.map((p) => {
            const photoKey = `tsiny.${p.slug}`;
            const hasPhoto = getPhoto(photoKey) !== null;
            return (
              <article
                key={p.slug}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border',
                  p.highlighted
                    ? 'border-[--color-accent] bg-[--color-surface-elev] shadow-[var(--shadow-glow)]'
                    : 'border-[--color-border] bg-[--color-surface]',
                )}
              >
                {/* Фото банер */}
                {hasPhoto && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[--color-surface-alt]">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                      <RitualImage
                        photoKey={photoKey}
                        variant="card"
                        className="h-full w-full"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <h2 className="font-heading text-3xl text-[--color-ink]">{p.title[loc]}</h2>
                  <p className="mt-1 text-sm text-[--color-ink-muted]">{p.subtitle[loc]}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    {p.priceFrom && (
                      <span className="text-sm text-[--color-ink-soft]">{tPkg('from')}</span>
                    )}
                    <span className="font-heading text-5xl font-medium text-[--color-ink]">
                      {p.price.toLocaleString('uk-UA')}
                    </span>
                    <span className="text-xl text-[--color-ink-soft]">{tPkg('currency')}</span>
                  </div>

                  <div className="divider-gold mt-6 max-w-[60px]" />

                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {p.includes[loc].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[--color-accent]"
                          aria-hidden
                        />
                        <span className="text-[--color-ink-soft]">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant="outline"
                    className="mt-7 w-full"
                  >
                    <a href={`tel:${SITE.phone}`}>{isUk ? 'Замовити пакет' : 'Заказать пакет'}</a>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Додаткові послуги - прайс */}
      <section className="bg-[--color-surface-alt] py-10 md:py-16">
        <div className="container-content">
          <h2 className="font-heading text-2xl font-medium md:text-3xl">
            {isUk ? 'Додаткові послуги - прайс' : 'Дополнительные услуги - прайс'}
          </h2>
          <div className="divider-gold mt-4 max-w-[60px]" />

          <div className="prose-mdx mt-8 max-w-4xl">
            <table>
              <thead>
                <tr>
                  <th>{isUk ? 'Послуга' : 'Услуга'}</th>
                  <th>{isUk ? 'Орієнтовна вартість' : 'Ориентировочная стоимость'}</th>
                </tr>
              </thead>
              <tbody>
                {(
                  isUk
                    ? [
                        ['Виїзд ритуального агента', 'безкоштовно'],
                        ['Перевезення тіла у Вінниці', 'від 1 200 ₴'],
                        ['Перевезення область', 'від 25 ₴/км'],
                        ['Послуги моргу (1 доба)', '200 ₴'],
                        ['Бальзамування', '1 500 – 3 000 ₴'],
                        ['Косметична підготовка', '500 – 1 500 ₴'],
                        ['Зал прощання (Арабея, 1)', '2 000 ₴'],
                        ['Катафалк', '2 000 ₴'],
                        ['Автобус для родини', 'від 2 500 ₴'],
                        ['Бригада виносу та копання', '4 500 – 6 000 ₴'],
                        ['Священник (відспівування)', '1 500 – 2 500 ₴'],
                        ['Псалмоспівець (сингуматор)', '1 500 ₴'],
                        ['Похоронний оркестр', '4 500 ₴'],
                        ['Розпорядник', '1 500 ₴'],
                        ['Поминальний обід (від)', '350 ₴/особа'],
                        ['Кремація (повний пакет)', 'від 18 000 ₴'],
                        ['Репатріація', 'індивідуально'],
                        ['Памʼятник (виготовлення)', 'від 8 000 ₴'],
                        ['Прибирання могили', 'від 700 ₴'],
                      ]
                    : [
                        ['Выезд ритуального агента', 'бесплатно'],
                        ['Перевозка тела в Виннице', 'от 1 200 ₴'],
                        ['Перевозка область', 'от 25 ₴/км'],
                        ['Услуги морга (1 сутки)', '200 ₴'],
                        ['Бальзамирование', '1 500 – 3 000 ₴'],
                        ['Косметическая подготовка', '500 – 1 500 ₴'],
                        ['Зал прощания (Арабея, 1)', '2 000 ₴'],
                        ['Катафалк', '2 000 ₴'],
                        ['Автобус для семьи', 'от 2 500 ₴'],
                        ['Бригада выноса и копки', '4 500 – 6 000 ₴'],
                        ['Священник (отпевание)', '1 500 – 2 500 ₴'],
                        ['Певчий (псалмопевец)', '1 500 ₴'],
                        ['Похоронный оркестр', '4 500 ₴'],
                        ['Распорядитель', '1 500 ₴'],
                        ['Поминальный обед (от)', '350 ₴/чел'],
                        ['Кремация (полный пакет)', 'от 18 000 ₴'],
                        ['Репатриация', 'индивидуально'],
                        ['Памятник (изготовление)', 'от 8 000 ₴'],
                        ['Уборка могилы', 'от 700 ₴'],
                      ]
                ).map(([service, price]) => (
                  <tr key={service}>
                    <td>{service}</td>
                    <td className="font-semibold text-[--color-accent]">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Безкоштовне поховання */}
      <section className="container-content py-10 md:py-16">
        <div className="rounded-2xl border border-[--color-accent]/40 bg-[--color-accent-100] p-7 md:p-10">
          <h2 className="font-heading text-2xl font-medium md:text-3xl">
            {isUk
              ? 'Безкоштовне поховання - для кого?'
              : 'Бесплатное погребение - для кого?'}
          </h2>
          <p className="mt-4 text-base text-[--color-ink-soft]">
            {isUk
              ? 'Для учасників бойових дій, ветеранів АТО/ООС, інвалідів війни та родин загиблих захисників - повний цикл ритуальних послуг здійснюється безкоштовно за державний кошт.'
              : 'Для участников боевых действий, ветеранов АТО/ООС, инвалидов войны и семей погибших защитников - полный цикл ритуальных услуг осуществляется бесплатно за государственный счёт.'}
          </p>
          <Link
            href="/poslugy/viyskove-pokhovannya/"
            className="mt-5 inline-flex items-center gap-1.5 font-semibold text-[--color-accent] hover:text-[--color-accent-700]"
          >
            {isUk ? 'Деталі - Військове поховання' : 'Детали - Военные похороны'} -
          </Link>
        </div>
      </section>

      {/* Контакт + форма */}
      <section className="container-content py-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-heading text-2xl font-medium md:text-3xl">
              {isUk ? 'Маєте запитання про ціни?' : 'Есть вопросы о ценах?'}
            </h2>
            <div className="divider-gold mt-4 max-w-[60px]" />
            <p className="mt-4 text-base text-[--color-ink-soft]">
              {isUk
                ? 'Зателефонуйте - розрахуємо точну вартість під ваші потреби. Без зобовʼязань.'
                : 'Позвоните - рассчитаем точную стоимость под ваши нужды. Без обязательств.'}
            </p>
            <a
              href={`tel:${SITE.phone}`}
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[--color-emergency] px-7 py-4 text-base font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90"
            >
              <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden />
              {SITE.phoneDisplay}
            </a>
          </div>
          <CallbackForm source="prices" />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(offerSchema)} />
    </>
  );
}
