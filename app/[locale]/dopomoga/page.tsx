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
    ? 'Допомога на поховання - державні виплати, пільги, родинам Героїв'
    : 'Помощь на погребение - государственные выплаты, льготы, семьям Героев';
  const description = isUk
    ? 'Допомога на поховання у Вінниці: державна виплата, родинам загиблих захисників, учасникам бойових дій. Як отримати, документи.'
    : 'Помощь на погребение в Виннице: государственная выплата, семьям погибших защитников, участникам боевых действий. Как получить, документы.';

  return {
    title,
    description,
    alternates: {
      canonical: buildUrl('dopomoga', locale as Locale),
      languages: {
        'uk-UA': buildUrl('dopomoga', 'uk'),
        'ru-UA': buildUrl('dopomoga', 'ru'),
        'x-default': buildUrl('dopomoga', 'uk'),
      },
    },
  };
}

export default async function HelpIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getAllPosts('dopomoga', locale as Locale);
  const tNav = await getTranslations('nav');
  const isUk = locale === 'uk';

  return (
    <>
      <section className="hero-gradient">
        <div className="container-content py-10 md:py-16">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: isUk ? 'Допомога' : 'Помощь', href: '/dopomoga/' },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1>
              {isUk
                ? 'Державна допомога та пільги на поховання'
                : 'Государственная помощь и льготы на погребение'}
            </h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
              {isUk
                ? 'Інформація про виплати, пільги та безкоштовні поховання для категорій громадян, передбачених законодавством.'
                : 'Информация о выплатах, льготах и бесплатных погребениях для категорий граждан, предусмотренных законодательством.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        {posts.length === 0 ? (
          <p className="text-[--color-ink-soft]">{isUk ? 'Незабаром.' : 'Скоро.'}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts
              .filter((p) => !p.frontmatter.noindex)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/dopomoga/${p.slug}/`}
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
