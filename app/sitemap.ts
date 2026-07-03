import type { MetadataRoute } from 'next';
import { buildUrl } from '@/lib/utils';
import { getAllSlugs, getPostBySlug } from '@/lib/content';
import offices from '@/data/offices.json';

const STATIC_PATHS = ['', 'poslugy', 'tsiny', 'tovary', 'poradnyk', 'dopomoga', 'blog', 'pro-nas', 'kontakty'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // lastModified вказуємо лише там, де є реальна дата оновлення (frontmatter.updatedAt) —
  // build-time `new Date()` для всіх сторінок знецінює сигнал свіжості для Google.
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: buildUrl(path, 'uk'),
    changeFrequency: (path === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: path === '' ? 1.0 : 0.7,
    alternates: {
      languages: {
        'uk-UA': buildUrl(path, 'uk'),
        'ru-UA': buildUrl(path, 'ru'),
        'x-default': buildUrl(path, 'uk'),
      },
    },
  }));

  // Dynamic content entries (poslugy + poradnyk + blog) — фільтр noindex
  const dynamicEntries: MetadataRoute.Sitemap = [];
  for (const type of ['poslugy', 'poradnyk', 'blog', 'dopomoga'] as const) {
    const slugs = await getAllSlugs(type);
    for (const slug of slugs) {
      const post = await getPostBySlug(type, slug, 'uk');
      if (!post || post.frontmatter.noindex) continue;

      const path = `${type}/${slug}`;
      dynamicEntries.push({
        url: buildUrl(path, 'uk'),
        ...(post.frontmatter.updatedAt && {
          lastModified: new Date(post.frontmatter.updatedAt),
        }),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            'uk-UA': buildUrl(path, 'uk'),
            'ru-UA': buildUrl(path, 'ru'),
            'x-default': buildUrl(path, 'uk'),
          },
        },
      });
    }
  }

  // Offices
  const officeEntries: MetadataRoute.Sitemap = offices.map((office) => ({
    url: buildUrl(`lokatsiyi/${office.slug}`, 'uk'),
    changeFrequency: 'yearly',
    priority: 0.6,
    alternates: {
      languages: {
        'uk-UA': buildUrl(`lokatsiyi/${office.slug}`, 'uk'),
        'ru-UA': buildUrl(`lokatsiyi/${office.slug}`, 'ru'),
        'x-default': buildUrl(`lokatsiyi/${office.slug}`, 'uk'),
      },
    },
  }));

  return [...staticEntries, ...dynamicEntries, ...officeEntries];
}
