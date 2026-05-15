// Shared MDX components used by next-mdx-remote/rsc.
// Темна типографічна гама — узгоджено з DESIGN.md.

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MdxPhoto } from '@/components/ui/MdxPhoto';

export const mdxComponents = {
  Photo: MdxPhoto,
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2
      className={cn(
        'mt-12 scroll-mt-24 font-heading text-2xl font-medium md:text-3xl',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'mt-10 scroll-mt-24 font-body text-xl font-semibold md:text-2xl',
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentProps<'h4'>) => (
    <h4
      className={cn('mt-8 scroll-mt-24 font-body text-lg font-semibold', className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<'p'>) => (
    <p
      className={cn('mt-5 text-base leading-relaxed text-[--color-ink-soft]', className)}
      {...props}
    />
  ),
  a: ({ className, href = '#', children, ...props }: ComponentProps<'a'>) => {
    const isTel = href.startsWith('tel:');
    const isMail = href.startsWith('mailto:');

    // Tel-link → виразна pill з рамкою
    if (isTel) {
      return (
        <a
          href={href}
          className={cn(
            'group not-prose mx-1 inline-flex items-center gap-1.5 rounded-full border border-[--color-accent]/50 bg-[--color-accent-100] px-3 py-1 align-baseline text-sm font-semibold text-[--color-accent] no-underline transition-all',
            'hover:border-[--color-accent] hover:bg-[--color-accent] hover:text-[--color-bg]',
            className,
          )}
          {...props}
        >
          <Phone
            className="h-3.5 w-3.5 transition-transform group-hover:rotate-12"
            aria-hidden
          />
          {children}
        </a>
      );
    }

    const isInternal = href.startsWith('/') || href.startsWith('#') || isMail;
    const Component = isInternal && !isMail ? Link : 'a';
    const externalProps =
      isInternal || isMail ? {} : { rel: 'noopener noreferrer', target: '_blank' };
    return (
      <Component
        href={href}
        className={cn(
          'text-[--color-accent] underline-offset-4 transition-colors hover:text-[--color-accent-700] hover:underline',
          className,
        )}
        {...externalProps}
        {...props}
      >
        {children}
      </Component>
    );
  },
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul className={cn('mt-5 list-disc space-y-2 pl-6 marker:text-[--color-accent]', className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol className={cn('mt-5 list-decimal space-y-2 pl-6 marker:text-[--color-accent]', className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li className={cn('text-[--color-ink-soft] [&>p]:mt-0', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote className={cn(className)} {...props} />
  ),
  hr: ({ className, ...props }: ComponentProps<'hr'>) => (
    <hr className={cn('my-10 border-[--color-border]', className)} {...props} />
  ),
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <div className="my-8 overflow-x-auto rounded-lg">
      <table className={cn(className)} {...props} />
    </div>
  ),
  code: ({ className, ...props }: ComponentProps<'code'>) => (
    <code
      className={cn(
        'rounded bg-[--color-surface-alt] px-1.5 py-0.5 font-mono text-sm text-[--color-accent]',
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: ComponentProps<'strong'>) => (
    <strong className={cn('font-semibold text-[--color-ink]', className)} {...props} />
  ),
};
