import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { buildUrl } from '@/lib/utils';

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
    ? 'Поради родинам у скорботі - ритуальні традиції, молитви, поминальні дні'
    : 'Советы семьям в скорби - ритуальные традиции, молитвы, поминальные дни';
  const description = isUk
    ? 'Православні традиції поминання, молитви за упокій, календар поминальних днів, поради при втраті близького.'
    : 'Православные традиции поминовения, молитвы за упокой, календарь поминальных дней, советы при утрате близкого.';

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('poradnyk', locale as Locale),
      languages: {
        'uk-UA': buildUrl('poradnyk', 'uk'),
        'ru-UA': buildUrl('poradnyk', 'ru'),
        'x-default': buildUrl('poradnyk', 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: buildUrl('poradnyk', locale as Locale),
      locale: isUk ? 'uk_UA' : 'ru_UA',
    },
  };
}

export default async function GuideIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getAllPosts('poradnyk', locale as Locale);
  const tNav = await getTranslations('nav');
  const isUk = locale === 'uk';

  return (
    <>
      <section className="hero-gradient">
        <div className="container-content py-10 md:py-16">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('guide'), href: '/poradnyk/' },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1>
              {isUk
                ? 'Поради родинам у скорботі'
                : 'Советы семьям в скорби'}
            </h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
              {isUk
                ? 'Православні традиції поминання, молитви, календар поминальних днів та практичні поради при втраті близького.'
                : 'Православные традиции поминовения, молитвы, календарь поминальных дней и практические советы при утрате близкого.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        {posts.length === 0 ? (
          <p className="text-[--color-ink-soft]">
            {isUk ? 'Статті незабаром.' : 'Статьи скоро.'}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter((p) => !p.frontmatter.noindex)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/poradnyk/${p.slug}/`}
                    className="card-hover group flex h-full flex-col rounded-2xl border border-[--color-border] bg-[--color-surface] p-7"
                  >
                    <h2 className="font-heading text-xl text-[--color-ink] md:text-2xl">
                      {p.frontmatter.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm text-[--color-ink-soft]">
                      {p.frontmatter.description}
                    </p>
                    <div className="divider-gold mt-5 max-w-[40px]" />
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[--color-accent]">
                      {isUk ? 'Читати' : 'Читать'}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </section>
    </>
  );
}
