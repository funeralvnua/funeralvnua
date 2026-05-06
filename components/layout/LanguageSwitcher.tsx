'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();
  const tA11y = useTranslations('a11y');

  const handleSwitch = (nextLocale: 'uk' | 'ru') => {
    if (nextLocale === currentLocale) return;
    // @ts-expect-error params type from next-intl
    router.replace({ pathname, params }, { locale: nextLocale });
  };

  return (
    <div
      role="group"
      aria-label={tA11y('languageSwitch')}
      className="inline-flex items-center gap-1 text-sm font-medium"
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="contents">
          {i > 0 && <span className="text-[--color-ink-muted]">·</span>}
          <button
            type="button"
            onClick={() => handleSwitch(loc)}
            aria-current={loc === currentLocale ? 'true' : undefined}
            className={cn(
              'px-1 uppercase tracking-wider transition-colors',
              loc === currentLocale
                ? 'font-bold text-[--color-accent]'
                : 'text-[--color-ink-muted] hover:text-[--color-ink]',
            )}
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
}
