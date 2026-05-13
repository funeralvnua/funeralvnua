import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ShieldCheck, Award, Users, Heart } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { RitualImage } from '@/components/ui/RitualImage';
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
    ? 'Про нас — Вінницька міська ритуальна служба'
    : 'О нас — Винницкая городская ритуальная служба';
  const description = isUk
    ? 'Понад 25 років допомагаємо родинам Вінниці у скорботні дні. Ліцензії, досвід, повний цикл послуг — від агента до пам\'ятника.'
    : 'Более 25 лет помогаем семьям Винницы в дни скорби. Лицензии, опыт, полный цикл услуг — от агента до памятника.';

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('pro-nas', locale as Locale),
      languages: {
        'uk-UA': buildUrl('pro-nas', 'uk'),
        'ru-UA': buildUrl('pro-nas', 'ru'),
        'x-default': buildUrl('pro-nas', 'uk'),
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations('nav');
  const isUk = locale === 'uk';

  const values = isUk
    ? [
        {
          Icon: Heart,
          title: 'Шанобливість',
          text: 'Кожна людина — особлива історія. Ми ставимось до кожної родини з повагою й увагою.',
        },
        {
          Icon: ShieldCheck,
          title: 'Чесність',
          text: 'Прозорі ціни, без передоплат, без прихованих платежів. Ви платите за факт.',
        },
        {
          Icon: Award,
          title: 'Досвід',
          text: 'Понад 25 років роботи у ритуальній сфері Вінниці. Десятки тисяч організованих похорон.',
        },
        {
          Icon: Users,
          title: 'Команда',
          text: 'Досвідчені агенти, бригади, водії — всі з відповідною підготовкою та емпатією.',
        },
      ]
    : [
        {
          Icon: Heart,
          title: 'Уважение',
          text: 'Каждый человек — особая история. Мы относимся к каждой семье с уважением и вниманием.',
        },
        {
          Icon: ShieldCheck,
          title: 'Честность',
          text: 'Прозрачные цены, без предоплат, без скрытых платежей. Вы платите за факт.',
        },
        {
          Icon: Award,
          title: 'Опыт',
          text: 'Более 25 лет работы в ритуальной сфере Винницы. Десятки тысяч организованных похорон.',
        },
        {
          Icon: Users,
          title: 'Команда',
          text: 'Опытные агенты, бригады, водители — все с соответствующей подготовкой и эмпатией.',
        },
      ];

  return (
    <>
      <section className="hero-gradient relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <RitualImage
            photoKey="pronas.hero"
            variant="hero"
            priority
            className="h-full w-full"
            imgClassName="opacity-20 md:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[--color-surface] via-[--color-surface]/85 to-[--color-surface]/40" />
        </div>
        <div className="container-content py-10 md:py-16">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('about'), href: '/pro-nas/' },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1>
              {isUk
                ? 'Допомагаємо родинам Вінниці у скорботні дні'
                : 'Помогаем семьям Винницы в дни скорби'}
            </h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
              {isUk
                ? 'Понад 25 років наша служба супроводжує родини Вінниці й області у найважчі моменти життя. Ми робимо все можливе, щоб прощання з близькими пройшло гідно та з повагою.'
                : 'Более 25 лет наша служба сопровождает семьи Винницы и области в самые тяжёлые моменты жизни. Мы делаем всё возможное, чтобы прощание с близкими прошло достойно и с уважением.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        <RitualImage
          photoKey="pronas.team"
          variant="hero"
          aspectRatio="21 / 9"
          className="rounded-2xl shadow-sm"
        />
      </section>

      <section className="container-content py-10 md:py-16">
        <h2 className="font-heading text-2xl font-medium md:text-3xl">
          {isUk ? 'Наші принципи' : 'Наши принципы'}
        </h2>
        <div className="divider-gold mt-4 max-w-[60px]" />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-6 transition-colors hover:border-[--color-accent]/50"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[--color-accent-100]">
                <Icon className="h-5 w-5 text-[--color-accent]" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[--color-ink-soft]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[--color-surface-alt] py-10 md:py-16">
        <div className="container-content">
          <div className="prose-mdx max-w-3xl">
            <h2>{isUk ? 'Що ми пропонуємо' : 'Что мы предлагаем'}</h2>
            <p>
              {isUk
                ? 'Повний цикл ритуальних послуг — від виклику агента у перші години до встановлення пам\'ятника через рік.'
                : 'Полный цикл ритуальных услуг — от вызова агента в первые часы до установки памятника через год.'}
            </p>
            <ul>
              {(isUk
                ? [
                    'Цілодобовий виклик агента у Вінниці й області',
                    'Перевезення померлих, послуги моргу, бальзамування',
                    'Документальний супровід — свідоцтва, дозволи, формальності',
                    'Зали прощання, ритуальний транспорт',
                    'Кремація через крематорії Києва, Харкова, Одеси',
                    'Військові поховання з державним фінансуванням',
                    'Виготовлення та встановлення пам\'ятників',
                    'Поминальні обіди, послуги священника',
                    'Догляд за могилами',
                  ]
                : [
                    'Круглосуточный вызов агента в Виннице и области',
                    'Перевозка умерших, услуги морга, бальзамирование',
                    'Документальное сопровождение — свидетельства, разрешения, формальности',
                    'Залы прощания, ритуальный транспорт',
                    'Кремация через крематории Киева, Харькова, Одессы',
                    'Военные похороны с государственным финансированием',
                    'Изготовление и установка памятников',
                    'Поминальные обеды, услуги священника',
                    'Уход за могилами',
                  ]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>{isUk ? 'Чому обирають нас' : 'Почему выбирают нас'}</h2>
            <p>
              {isUk
                ? 'У ритуальній сфері довіра — найважливіше. Наша служба заслужила її роками сумлінної роботи. Ми не тиснемо, не нав\'язуємо непотрібного, не додаємо прихованих платежів. Кожна родина отримує те, що замовила, і за фіксованою ціною.'
                : 'В ритуальной сфере доверие — самое важное. Наша служба заслужила его годами добросовестной работы. Мы не давим, не навязываем ненужного, не добавляем скрытых платежей. Каждая семья получает то, что заказала, и по фиксированной цене.'}
            </p>
            <p>
              {isUk
                ? 'Ми працюємо у Вінниці й області — тому добре знаємо локальні особливості: кладовища, відстані, традиції громад. Ми поряд цілодобово й готові виїхати у будь-який населений пункт Вінницької області.'
                : 'Мы работаем в Виннице и области — поэтому хорошо знаем локальные особенности: кладбища, расстояния, традиции общин. Мы рядом круглосуточно и готовы выехать в любой населённый пункт Винницкой области.'}
            </p>

            <blockquote>
              {isUk
                ? 'Ми не продаємо послуги — ми допомагаємо людям пройти через найтяжчий момент життя.'
                : 'Мы не продаём услуги — мы помогаем людям пройти через самый тяжёлый момент жизни.'}
            </blockquote>
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-medium md:text-3xl">
              {isUk ? 'Наші відділення' : 'Наши отделения'}
            </h2>
            <div className="divider-gold mt-4 max-w-[60px]" />
            <ul className="mt-6 space-y-4">
              {SITE.addresses.map((a) => (
                <li
                  key={a.street}
                  className="flex items-start gap-3 rounded-lg border border-[--color-border] bg-[--color-surface] p-4"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[--color-accent]" aria-hidden />
                  <span className="text-base text-[--color-ink]">
                    {isUk ? a.street : a.streetRu}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <CallbackForm source="about" />
        </div>
      </section>
    </>
  );
}
