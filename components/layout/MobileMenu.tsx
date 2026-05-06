'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SITE } from '@/lib/utils';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('nav');

  const navItems = [
    { href: '/#poslugy', label: t('services') },
    { href: '/tsiny/', label: t('prices') },
    { href: '/tovary/', label: t('products') },
    { href: '/poradnyk/', label: t('guide') },
    { href: '/dopomoga/', label: 'Допомога' },
    { href: '/blog/', label: t('blog') },
    { href: '/pro-nas/', label: t('about') },
    { href: '/kontakty/', label: t('contacts') },
  ] as const;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t('openMenu')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[--color-ink] hover:bg-[--color-surface] lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[--color-overlay] backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-[--color-bg] shadow-xl"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t('openMenu')}</Dialog.Title>

          <div className="flex items-center justify-between border-b border-[--color-border] px-5 py-4">
            <span className="font-heading text-lg text-[--color-ink]">Меню</span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t('closeMenu')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[--color-ink] hover:bg-[--color-surface]"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex-1 px-5 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-base text-[--color-ink-soft] transition-colors hover:bg-[--color-surface] hover:text-[--color-accent]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-[--color-border] px-5 py-4">
            <a
              href={`tel:${SITE.phone}`}
              className="group flex items-center justify-center gap-2 rounded-full border border-[--color-accent]/50 bg-[--color-accent-100] px-5 py-3 text-base font-semibold text-[--color-accent] transition-all hover:bg-[--color-accent] hover:text-[--color-bg]"
            >
              <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden />
              {SITE.phoneDisplay}
            </a>

            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
