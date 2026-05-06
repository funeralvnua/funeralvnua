import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { jsonLdScript } from '@/lib/schema';
import { buildUrl } from '@/lib/utils';

export interface Crumb {
  label: string;
  href: string;
}

interface Props {
  items: Crumb[];
}

export function Breadcrumbs({ items }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: buildUrl(c.href, 'uk'),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[--color-ink-muted]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-4 w-4 text-[--color-ink-muted]/60" aria-hidden />}
              {isLast ? (
                <span aria-current="page" className="text-[--color-ink-soft]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[--color-accent]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schema)} />
    </nav>
  );
}
