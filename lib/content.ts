import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import type { Locale } from '@/i18n/routing';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export type ContentType = 'poslugy' | 'poradnyk' | 'blog' | 'dopomoga';

export interface FrontmatterFAQ {
  q: string;
  a: string;
}

export interface ContentFrontmatter {
  title: string;
  description: string;
  slug: string;
  category?: string;
  priority?: number;
  icon?: string;
  priceFrom?: number;
  faq?: FrontmatterFAQ[];
  related?: string[];
  publishedAt?: string;
  updatedAt?: string;
  /** When true — page is rendered but with `noindex` (e.g. ru fallback to uk). */
  noindex?: boolean;
}

export interface PostMeta {
  type: ContentType;
  slug: string;
  locale: Locale;
  /** True when ru content was missing and uk content is shown instead. */
  fallback: boolean;
  frontmatter: ContentFrontmatter;
}

export interface Post extends PostMeta {
  content: string;
}

const fileFor = (type: ContentType, slug: string, locale: Locale) =>
  path.join(CONTENT_DIR, type, `${slug}.${locale}.mdx`);

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a single MDX post by content type, slug and locale.
 * Falls back to UK if RU file is missing — in that case `fallback: true` is set
 * (consumer can apply `noindex` to non-default locale).
 */
export const getPostBySlug = cache(_getPostBySlug);
async function _getPostBySlug(
  type: ContentType,
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  let filePath = fileFor(type, slug, locale);
  let fallback = false;

  if (!(await exists(filePath))) {
    if (locale === 'uk') return null;
    // Try uk as fallback for ru
    filePath = fileFor(type, slug, 'uk');
    if (!(await exists(filePath))) return null;
    fallback = true;
  }

  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    type,
    slug,
    locale,
    fallback,
    frontmatter: { ...(data as ContentFrontmatter), slug },
    content,
  };
}

/**
 * Get all slugs for a given content type — used for `generateStaticParams`.
 * Returns unique slugs across both locales.
 */
export const getAllSlugs = cache(_getAllSlugs);
async function _getAllSlugs(type: ContentType): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, type);
  if (!(await exists(dir))) return [];

  const files = await fs.readdir(dir);
  const slugs = new Set<string>();

  for (const file of files) {
    // Format: {slug}.{uk|ru}.mdx
    const match = file.match(/^(.+)\.(uk|ru)\.mdx$/);
    if (match) slugs.add(match[1]);
  }

  return [...slugs].sort();
}

/**
 * Get all posts of a given content type for a locale (e.g. blog index).
 * Sorted by publishedAt desc (if present).
 */
export async function getAllPosts(type: ContentType, locale: Locale): Promise<Post[]> {
  const slugs = await getAllSlugs(type);
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(type, s, locale)));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => {
      const da = a.frontmatter.publishedAt ?? '';
      const db = b.frontmatter.publishedAt ?? '';
      return db.localeCompare(da);
    });
}

/**
 * Get related posts for a given post — reads `frontmatter.related` slugs.
 * Used for cross-linking on service / guide pages.
 */
export async function getRelatedPosts(
  type: ContentType,
  slugs: string[] | undefined,
  locale: Locale,
): Promise<PostMeta[]> {
  if (!slugs || slugs.length === 0) return [];
  const items = await Promise.all(slugs.map((s) => getPostBySlug(type, s, locale)));
  return items
    .filter((p): p is Post => p !== null)
    .map(({ content: _content, ...meta }) => meta);
}
