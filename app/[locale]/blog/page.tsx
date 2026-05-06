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
  const title = isUk ? 'Блог — статті та новини ритуальної служби' : 'Блог — статьи и новости ритуальной службы';
  const description = isUk
    ? 'Корисні статті про ритуальні традиції, поминальні дні, законодавство, практичні поради родинам у скорботі.'
    : 'Полезные статьи о ритуальных традициях, поминальных днях, законодательстве, практические советы семьям в скорби.';

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('blog', locale as Locale),
      languages: {
        'uk-UA': buildUrl('blog', 'uk'),
        'ru-UA': buildUrl('blog', 'ru'),
        'x-default': buildUrl('blog', 'uk'),
      },
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getAllPosts('blog', locale as Locale);
  const tNav = await getTranslations('nav');
  const isUk = locale === 'uk';

  return (
    <>
      <section className="hero-gradient">
        <div className="container-content py-10 md:py-16">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('blog'), href: '/blog/' },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1>
              {isUk ? 'Статті, новини, корисне' : 'Статьи, новости, полезное'}
            </h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
              {isUk
                ? 'Матеріали про ритуальні традиції, поминання, законодавство та підтримку родин.'
                : 'Материалы о ритуальных традициях, поминовениях, законодательстве и поддержке семей.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        {posts.length === 0 ? (
          <p className="text-[--color-ink-soft]">{isUk ? 'Незабаром.' : 'Скоро.'}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .filter((p) => !p.frontmatter.noindex)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}/`}
                    className="card-hover group flex h-full flex-col rounded-2xl border border-[--color-border] bg-[--color-surface] p-7"
                  >
                    {p.frontmatter.publishedAt && (
                      <time
                        dateTime={p.frontmatter.publishedAt}
                        className="text-xs uppercase tracking-wider text-[--color-ink-muted]"
                      >
                        {new Date(p.frontmatter.publishedAt).toLocaleDateString(
                          isUk ? 'uk-UA' : 'ru-RU',
                          { day: 'numeric', month: 'long', year: 'numeric' },
                        )}
                      </time>
                    )}
                    <h2 className="mt-2 font-heading text-xl text-[--color-ink] md:text-2xl">
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
