'use client';

import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/utils';

interface Props {
  source: string;
  variant?: 'compact' | 'default' | 'large';
  className?: string;
}

export function PhoneLink({ source, variant = 'default', className }: Props) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag?.('event', 'phone_click', { source });
    }
  };

  const sizeStyles = {
    compact: 'px-3 py-1.5 text-sm',
    default: 'px-5 py-2.5 text-base',
    large: 'px-6 py-3 text-lg md:text-xl',
  }[variant];

  const iconStyles = {
    compact: 'h-3.5 w-3.5',
    default: 'h-4 w-4',
    large: 'h-5 w-5',
  }[variant];

  return (
    <a
      href={`tel:${SITE.phone}`}
      onClick={handleClick}
      aria-label={`Зателефонувати: ${SITE.phoneDisplay}`}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border border-[--color-accent]/50 bg-[--color-accent-100] font-semibold text-[--color-accent] transition-all',
        'hover:border-[--color-accent] hover:bg-[--color-accent] hover:text-[--color-bg] hover:shadow-[var(--shadow-glow)]',
        sizeStyles,
        className,
      )}
    >
      <Phone
        className={cn('transition-transform group-hover:rotate-12', iconStyles)}
        aria-hidden
      />
      <span className="tracking-wide">{SITE.phoneDisplay}</span>
    </a>
  );
}
