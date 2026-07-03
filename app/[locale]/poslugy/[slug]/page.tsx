import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Phone, Plus } from 'lucide-react';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { getAllSlugs, getPostBySlug } from '@/lib/content';
import { mdxComponents } from '@/mdx-components';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedServices } from '@/components/sections/RelatedServices';
import { CallbackForm } from '@/components/sections/CallbackForm';
import { PageHero } from '@/components/ui/PageHero';
import { MdxPhoto } from '@/components/ui/MdxPhoto';
import { getPhoto, ogImageFor } from '@/lib/photos';
import { jsonLdScript, getLocalBusinessSchema } from '@/lib/schema';
import { SITE, buildUrl } from '@/lib/utils';

type RouteParams = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getAllSlugs('poslugy');
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
  const post = await getPostBySlug('poslugy', slug, locale as Locale);
  if (!post) return {};

  const subPath = `poslugy/${slug}`;
  const ukUrl = buildUrl(subPath, 'uk');
  const ruUrl = buildUrl(subPath, 'ru');
  const og = ogImageFor(`poslugy.${slug}`, SITE.url);

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
        card: 'summary_large_image',
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

export default async function ServicePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug('poslugy', slug, locale as Locale);
  if (!post) notFound();

  const tNav = await getTranslations('nav');

  // JSON-LD schemas
  const subPath = `poslugy/${slug}`;
  const path = `/${subPath}/`;
  const url = buildUrl(subPath, locale as Locale);

  // Reuse full LocalBusiness/FuneralHome schema (з address, geo, opening hours, areaServed)
  const businessSchema = getLocalBusinessSchema(locale as Locale) as unknown as Record<string, unknown>;
  const { '@context': _ctx, ...providerBusiness } = businessSchema;
  void _ctx;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: post.frontmatter.title,
    description: post.frontmatter.description,
    url,
    provider: providerBusiness,
    areaServed: {
      '@type': 'City',
      name: locale === 'uk' ? 'Вінниця' : 'Винница',
    },
    ...(post.frontmatter.priceFrom && {
      offers: {
        '@type': 'Offer',
        price: post.frontmatter.priceFrom,
        priceCurrency: 'UAH',
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  const faqSchema = post.frontmatter.faq && post.frontmatter.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.frontmatter.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  const photoKey = `poslugy.${slug}`;
  const altPhotoKey = `${photoKey}.alt`;
  const hasAltPhoto = getPhoto(altPhotoKey) !== null;

  return (
    <article>
      <PageHero
        photoKey={photoKey}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: tNav('home'), href: '/' },
              { label: tNav('services'), href: '/poslugy/' },
              { label: post.frontmatter.title, href: path },
            ]}
          />
        }
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        cta={
          <div className="flex flex-col items-start md:items-end">
            <a
              href={`tel:${SITE.phone}`}
              className="group inline-flex items-center gap-3 rounded-full bg-[--color-emergency] px-6 py-3 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90"
            >
              <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden />
              {SITE.phoneDisplay}
            </a>
            {post.frontmatter.priceFrom && (
              <span className="flex items-baseline gap-2 text-base text-[--color-ink-soft]">
                від{' '}
                <strong className="font-heading text-4xl font-medium leading-none text-[--color-accent] md:text-5xl">
                  {post.frontmatter.priceFrom.toLocaleString('uk-UA')} ₴
                </strong>
              </span>
            )}
          </div>
        }
      />

      {/* MDX content + Sidebar form */}
      <section className="container-content py-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div className="prose-mdx max-w-none">
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

            {hasAltPhoto && <MdxPhoto photoKey={altPhotoKey} />}

            {/* FAQ */}
            {post.frontmatter.faq && post.frontmatter.faq.length > 0 && (
              <section className="mt-16">
                <h2 className="font-heading text-2xl font-medium md:text-3xl">
                  Часті запитання
                </h2>
                <div className="divider-gold mt-4 max-w-[60px]" />
                <div className="mt-8">
                  {post.frontmatter.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group border-b border-[--color-border] py-5 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                        <span className="text-lg font-semibold text-[--color-ink] transition-colors group-hover:text-[--color-accent]">
                          {item.q}
                        </span>
                        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[--color-border] text-[--color-accent] transition-transform group-open:rotate-45">
                          <Plus className="h-4 w-4" aria-hidden />
                        </span>
                      </summary>
                      <p className="mt-4 text-base text-[--color-ink-soft]">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Related */}
            <RelatedServices slugs={post.frontmatter.related ?? []} />
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CallbackForm source={`service-${slug}`} />
          </aside>
        </div>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(serviceSchema)} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema)} />
      )}
    </article>
  );
}
