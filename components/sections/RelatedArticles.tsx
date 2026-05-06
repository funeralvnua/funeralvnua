import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { getRelatedPosts, type ContentType } from '@/lib/content';
import type { Locale } from '@/i18n/routing';

interface Props {
  type: ContentType;
  slugs: string[];
}

/**
 * Async server component — fetches related posts metadata from MDX content.
 * Used at the bottom of articles for cross-linking.
 */
export async function RelatedArticles({ type, slugs }: Props) {
  const locale = (await getLocale()) as Locale;
  const related = await getRelatedPosts(type, slugs, locale);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-articles-heading" className="mt-16">
      <h2
        id="related-articles-heading"
        className="font-heading text-2xl font-medium md:text-3xl"
      >
        Читайте також
      </h2>
      <div className="divider-gold mt-4 max-w-[60px]" />

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${type}/${p.slug}/`}
              className="card-hover group block h-full rounded-xl border border-[--color-border] bg-[--color-surface] p-6"
            >
              <h3 className="text-base font-semibold text-[--color-ink]">
                {p.frontmatter.title}
              </h3>
              <p className="mt-2 text-sm text-[--color-ink-soft]">
                {p.frontmatter.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[--color-accent]">
                Читати
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
