'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SITE } from '@/lib/utils';

export function StickyCallButton() {
  const t = useTranslations('cta');

  const handleTelClick = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag?.('event', 'phone_click', { source: 'sticky' });
    }
  };

  const handleCallback = () => {
    document.getElementById('callback-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector<HTMLInputElement>('#callback-form input[name="phone"]')?.focus();
  };

  return (
    <aside
      role="region"
      aria-label="Швидкий зв'язок"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-[--color-border] shadow-lg md:hidden"
    >
      <a
        href={`tel:${SITE.phone}`}
        onClick={handleTelClick}
        className="flex items-center justify-center gap-2 bg-[--color-emergency] px-3 py-4 text-sm font-semibold text-white"
      >
        <Phone className="h-5 w-5" aria-hidden />
        <span>{t('callNowShort')}</span>
      </a>
      <button
        type="button"
        onClick={handleCallback}
        className="flex items-center justify-center gap-2 bg-[--color-accent] px-3 py-4 text-sm font-semibold text-[--color-bg]"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        <span>{t('callMeBackShort')}</span>
      </button>
    </aside>
  );
}
