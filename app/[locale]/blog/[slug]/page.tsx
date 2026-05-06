import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { getAllSlugs, getPostBySlug } from '@/lib/content';
import { mdxComponents } from '@/mdx-components';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { jsonLdScript } from '@/lib/schema';
import { SITE, buildUrl } from '@/lib/utils';

type RouteParams = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getAllSlugs('blog');
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
  const post = await getPostBySlug('blog', slug, locale as Locale);
  if (!post) return {};

  const subPath = `blog/${slug}`;
  const ukUrl = buildUrl(subPath, 'uk');
  const ruUrl = buildUrl(subPath, 'ru');

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
      ...(post.frontmatter.publishedAt && { publishedTime: post.frontmatter.publishedAt }),
    },
    robots: {
      index: !post.frontmatter.noindex && !post.fallback,
      follow: true,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug('blog', slug, locale as Locale);
  if (!post) notFound();

  const tNav = await getTranslations('nav');
  const isUk = locale === 'uk';

  const subPath = `blog/${slug}`;
  const path = `/${subPath}/`;
  const url = buildUrl(subPath, locale as Locale);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    url,
    inLanguage: isUk ? 'uk-UA' : 'ru-UA',
    ...(post.frontmatter.publishedAt && { datePublished: post.frontmatter.publishedAt }),
    ...(post.frontmatter.updatedAt && { dateModified: post.frontmatter.updatedAt }),
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
              { label: tNav('blog'), href: '/blog/' },
              { label: post.frontmatter.title, href: path },
            ]}
          />

          <div className="mt-6 max-w-3xl">
            <h1>{post.frontmatter.title}</h1>
            <div className="divider-gold mt-6 max-w-[80px]" />
            <p className="mt-6 text-lg text-[--color-ink-soft] md:text-xl">
              {post.frontmatter.description}
            </p>

            {post.frontmatter.publishedAt && (
              <p className="mt-4 text-sm text-[--color-ink-muted]">
                {isUk ? 'Опубліковано: ' : 'Опубликовано: '}
                <time dateTime={post.frontmatter.publishedAt}>
                  {new Date(post.frontmatter.publishedAt).toLocaleDateString(
                    isUk ? 'uk-UA' : 'ru-RU',
                    { day: 'numeric', month: 'long', year: 'numeric' },
                  )}
                </time>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-content py-10 md:py-16">
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

          {post.frontmatter.related && (
            <RelatedArticles type="blog" slugs={post.frontmatter.related} />
          )}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleSchema)} />
    </article>
  );
}
