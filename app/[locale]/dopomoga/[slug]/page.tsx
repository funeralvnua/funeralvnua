import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Phone } from 'lucide-react';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { getAllSlugs, getPostBySlug } from '@/lib/content';
import { mdxComponents } from '@/mdx-components';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { jsonLdScript } from '@/lib/schema';
import { ogImageFor } from '@/lib/photos';
import { SITE, buildUrl } from '@/lib/utils';

type RouteParams = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getAllSlugs('dopomoga');
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug('dopomoga', slug, locale as Locale);
  if (!post) return {};

  const subPath = `dopomoga/${slug}`;
  const ukUrl = buildUrl(subPath, 'uk');
  const ruUrl = buildUrl(subPath, 'ru');
  const og = ogImageFor(`dopomoga.${slug}`, SITE.url) ?? ogImageFor('dopomoga.hero', SITE.url);

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: locale === 'uk' ? ukUrl : ruUrl,
      languages: {
        'uk-UA': ukUrl,
        'ru-UA': ruUrl,
        'x-default': ukUrl,
      },
    },
    openGraph: {
      type: 'article',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: locale === 'uk' ? ukUrl : ruUrl,
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      ...(og && { images: [og] }),
    },
    ...(og && {
      twitter: {
        card: 'summary_large_image' as const,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        images: [og.url],
      },
    }),
    robots: {
      index: !post.frontmatter.noindex && !post.fallback,
      follow: true,
    },
  };
}

export default async function HelpPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug('dopomoga', slug, locale as Locale);
  if (!post) notFound();

  const tNav = await getTranslations('nav');
  const isUk = locale === 'uk';
  const subPath = `dopomoga/${slug}`;
  const path = `/${subPath}/`;
  const url = buildUrl(subPath, locale as Locale);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    url,
    inLanguage: isUk ? 'uk-UA' : 'ru-UA',
    publisher: {
      '@type': 'Organization',
      name: isUk
        ? 'Вінницька міська ритуальна служба'
        : 'Винницкая городская ритуальная служба',
      url: SITE.url,
    },
  };

  return (
    <article>
      <section className="hero-gradient">
        <div className="container-content py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: isUk ? 'Допомога' : 'Помощь', href: '/dopomoga/' },
              { label: post.frontmatter.title, href: path },
            ]}
          />

          <div className="mt-6 max-w-3xl">
            <h1>{post.frontmatter.title}</h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
              {post.frontmatter.description}
            </p>
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <div className="prose-mdx max-w-3xl">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                  ],
                },
              }}
            />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[--color-accent]/40 bg-[--color-accent-100] p-6">
              <h3 className="font-heading text-xl text-[--color-ink]">
                {isUk ? 'Потрібна консультація?' : 'Нужна консультация?'}
              </h3>
              <div className="divider-gold mt-3 max-w-[40px]" />
              <p className="mt-3 text-sm text-[--color-ink-soft]">
                {isUk
                  ? 'Допоможемо оформити документи й отримати належну допомогу.'
                  : 'Поможем оформить документы и получить положенную помощь.'}
              </p>
              <a
                href={`tel:${SITE.phone}`}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[--color-emergency] px-5 py-3 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90"
              >
                <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden />
                {SITE.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleSchema)} />
    </article>
  );
}
