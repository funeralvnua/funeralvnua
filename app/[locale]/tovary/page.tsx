import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { RitualImage } from '@/components/ui/RitualImage';
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
    ? 'Ритуальні товари у Вінниці - труни, вінки, хрести, одяг'
    : 'Ритуальные товары в Виннице - гробы, венки, кресты, одежда';
  const description = isUk
    ? 'Каталог ритуальних товарів у Вінниці: труни, вінки на похорон, хрести, ритуальний одяг. Доставка, гарантія якості.'
    : 'Каталог ритуальных товаров в Виннице: гробы, венки на похороны, кресты, ритуальная одежда. Доставка, гарантия качества.';

  const og = ogImageFor('tovary.vinky', SITE.url);

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('tovary', locale as Locale),
      languages: {
        'uk-UA': buildUrl('tovary', 'uk'),
        'ru-UA': buildUrl('tovary', 'ru'),
        'x-default': buildUrl('tovary', 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: buildUrl('tovary', locale as Locale),
      locale: isUk ? 'uk_UA' : 'ru_UA',
      ...(og && { images: [og] }),
    },
    ...(og && {
      twitter: { card: 'summary_large_image' as const, title, description, images: [og.url] },
    }),
  };
}

interface Category {
  slug: string;
  photoKey: string;
  title: { uk: string; ru: string };
  description: { uk: string; ru: string };
  priceFrom: number;
  items: { uk: string[]; ru: string[] };
}

const CATEGORIES: Category[] = [
  {
    slug: 'truny',
    photoKey: 'tovary.truny',
    title: { uk: 'Труни', ru: 'Гробы' },
    description: {
      uk: 'Деревʼяні труни різних класів - від базових до елітних. Стандартні розміри, оббивка тканиною.',
      ru: 'Деревянные гробы разных классов - от базовых до элитных. Стандартные размеры, обивка тканью.',
    },
    priceFrom: 2500,
    items: {
      uk: [
        'Економ - від 2 500 ₴',
        'Стандарт (з оббивкою) - від 4 500 ₴',
        'Преміум (масив, лакування) - від 8 000 ₴',
        'Еліт (різьблення, особлива деревина) - від 15 000 ₴',
        'Спеціальні (для кремації, для репатріації)',
        'Дитячі',
      ],
      ru: [
        'Эконом - от 2 500 ₴',
        'Стандарт (с обивкой) - от 4 500 ₴',
        'Премиум (массив, лакировка) - от 8 000 ₴',
        'Элит (резьба, особая древесина) - от 15 000 ₴',
        'Специальные (для кремации, для репатриации)',
        'Детские',
      ],
    },
  },
  {
    slug: 'vinky',
    photoKey: 'tovary.vinky',
    title: { uk: 'Вінки на похорон', ru: 'Венки на похороны' },
    description: {
      uk: 'Похоронні вінки зі штучних і живих квітів. З траурними стрічками з написами.',
      ru: 'Похоронные венки из искусственных и живых цветов. С траурными лентами с надписями.',
    },
    priceFrom: 350,
    items: {
      uk: [
        'Базовий вінок (штучні квіти) - від 350 ₴',
        'Стандартний з композицією - від 700 ₴',
        'Преміум вінок - від 1 200 ₴',
        'Великий ритуальний вінок - від 2 000 ₴',
        'Кошик з квітів - від 500 ₴',
        'Живі квіти (хризантеми, троянди) - від 800 ₴',
        'Стрічки з написами - від 100 ₴',
      ],
      ru: [
        'Базовый венок (искусственные цветы) - от 350 ₴',
        'Стандартный с композицией - от 700 ₴',
        'Премиум венок - от 1 200 ₴',
        'Большой ритуальный венок - от 2 000 ₴',
        'Корзина с цветами - от 500 ₴',
        'Живые цветы (хризантемы, розы) - от 800 ₴',
        'Ленты с надписями - от 100 ₴',
      ],
    },
  },
  {
    slug: 'khresty',
    photoKey: 'tovary.khresty',
    title: { uk: 'Хрести', ru: 'Кресты' },
    description: {
      uk: 'Тимчасові деревʼяні хрести для встановлення на могилі до встановлення памʼятника.',
      ru: 'Временные деревянные кресты для установки на могиле до установки памятника.',
    },
    priceFrom: 600,
    items: {
      uk: [
        'Простий деревʼяний - від 600 ₴',
        'Лакований - від 1 000 ₴',
        'З табличкою (написом) - +200 ₴',
        'З декоративним різьбленням - від 1 500 ₴',
        'Військовий хрест (синьо-жовтий) - від 1 200 ₴',
      ],
      ru: [
        'Простой деревянный - от 600 ₴',
        'Лакированный - от 1 000 ₴',
        'С табличкой (надписью) - +200 ₴',
        'С декоративной резьбой - от 1 500 ₴',
        'Военный крест (сине-жёлтый) - от 1 200 ₴',
      ],
    },
  },
  {
    slug: 'odiah',
    photoKey: 'tovary.odiah',
    title: { uk: 'Ритуальний одяг', ru: 'Ритуальная одежда' },
    description: {
      uk: 'Спеціальний одяг для покійних: костюми, плаття, нижня білизна, взуття.',
      ru: 'Специальная одежда для покойных: костюмы, платья, нижнее белье, обувь.',
    },
    priceFrom: 800,
    items: {
      uk: [
        'Костюм чоловічий - від 1 500 ₴',
        'Плаття жіноче - від 1 200 ₴',
        'Сорочка / блуза - від 400 ₴',
        'Білизна - від 200 ₴',
        'Взуття - від 500 ₴',
        'Хустка для жінки - від 150 ₴',
        'Військова форма - координація з військкоматом',
      ],
      ru: [
        'Костюм мужской - от 1 500 ₴',
        'Платье женское - от 1 200 ₴',
        'Сорочка / блуза - от 400 ₴',
        'Бельё - от 200 ₴',
        'Обувь - от 500 ₴',
        'Платок для женщины - от 150 ₴',
        'Военная форма - координация с военкоматом',
      ],
    },
  },
  {
    slug: 'aksesuary',
    photoKey: 'tovary.aksesuary',
    title: { uk: 'Ритуальні аксесуари', ru: 'Ритуальные аксессуары' },
    description: {
      uk: 'Свічки, ікони, рушники, церковне приладдя для прощальної церемонії.',
      ru: 'Свечи, иконы, рушники, церковные принадлежности для прощальной церемонии.',
    },
    priceFrom: 50,
    items: {
      uk: [
        'Свічки церковні (10 шт.) - від 100 ₴',
        'Свічки великі - від 50 ₴/шт.',
        'Ікони (картонні) - від 100 ₴',
        'Ікони (деревʼяні) - від 350 ₴',
        'Рушник традиційний - від 200 ₴',
        'Покровець (тканина для труни) - від 250 ₴',
        'Тюль ритуальний - від 180 ₴',
        'Хрест нагрудний - від 50 ₴',
        'Молитовник, поминальник - від 80 ₴',
        'Кошики з квітами для катафалка - від 700 ₴',
      ],
      ru: [
        'Свечи церковные (10 шт.) - от 100 ₴',
        'Свечи большие - от 50 ₴/шт.',
        'Иконы (картонные) - от 100 ₴',
        'Иконы (деревянные) - от 350 ₴',
        'Рушник традиционный - от 200 ₴',
        'Покров (ткань для гроба) - от 250 ₴',
        'Тюль ритуальный - от 180 ₴',
        'Крест нагрудный - от 50 ₴',
        'Молитвослов, поминальник - от 80 ₴',
        'Корзины с цветами для катафалка - от 700 ₴',
      ],
    },
  },
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations('nav');
  const isUk = locale === 'uk';
  const loc = locale as 'uk' | 'ru';

  return (
    <>
      <section className="hero-gradient">
        <div className="container-content py-10 md:py-16">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('products'), href: '/tovary/' },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1>
              {isUk
                ? 'Ритуальні товари у Вінниці'
                : 'Ритуальные товары в Виннице'}
            </h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
              {isUk
                ? 'Усе необхідне для гідного прощання - труни, вінки, хрести, одяг, церковне приладдя.'
                : 'Всё необходимое для достойного прощания - гробы, венки, кресты, одежда, церковные принадлежности.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <article
              key={cat.slug}
              className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-surface]"
            >
              {/* Фото категорії */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[--color-surface-alt]">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <RitualImage
                    photoKey={cat.photoKey}
                    variant="card"
                    className="h-full w-full"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h2 className="font-heading text-2xl text-white md:text-3xl drop-shadow-md">
                    {cat.title[loc]}
                  </h2>
                  <p className="mt-1.5 text-sm text-white/85 drop-shadow">
                    {isUk ? 'від' : 'от'}{' '}
                    <strong className="text-[--color-accent]">
                      {cat.priceFrom.toLocaleString('uk-UA')} ₴
                    </strong>
                  </p>
                </div>
              </div>

              {/* Тіло картки */}
              <div className="flex flex-1 flex-col p-7">
                <p className="text-sm text-[--color-ink-soft]">{cat.description[loc]}</p>
                <div className="divider-gold mt-4 max-w-[40px]" />
                <ul className="mt-5 space-y-2 text-sm">
                  {cat.items[loc].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[--color-ink]"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[--color-accent]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[--color-surface-alt] py-10 md:py-16">
        <div className="container-content">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="font-heading text-2xl font-medium md:text-3xl">
                {isUk ? 'Не знайшли потрібного?' : 'Не нашли нужного?'}
              </h2>
              <div className="divider-gold mt-4 max-w-[60px]" />
              <p className="mt-4 text-base text-[--color-ink-soft]">
                {isUk
                  ? 'Зателефонуйте - знайдемо саме те, що вам потрібно. Можемо привезти спеціальні товари за запитом, узгодити кольори, розміри, ціни.'
                  : 'Позвоните - найдём именно то, что вам нужно. Можем привезти специальные товары по запросу, согласовать цвета, размеры, цены.'}
              </p>
              <a
                href={`tel:${SITE.phone}`}
                className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[--color-emergency] px-7 py-4 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90"
              >
                <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden />
                {SITE.phoneDisplay}
              </a>

              <p className="mt-8 text-sm text-[--color-ink-soft]">
                {isUk
                  ? 'Усі товари можна замовити окремо або в комплекті з пакетом ритуальних послуг - '
                  : 'Все товары можно заказать отдельно или в комплекте с пакетом ритуальных услуг - '}
                <Link href="/tsiny/" className="font-semibold text-[--color-accent]">
                  {isUk ? 'переглянути пакети' : 'посмотреть пакеты'}
                </Link>.
              </p>
            </div>
            <CallbackForm source="products" />
          </div>
        </div>
      </section>
    </>
  );
}
