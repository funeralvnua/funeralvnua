import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PhoneLink } from './PhoneLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const t = useTranslations('nav');
  const tSite = useTranslations('site');

  return (
    <header className="sticky top-0 z-10 border-b border-[--color-border] bg-[--color-bg]/85 backdrop-blur-md">
      <div className="container-content flex h-14 items-center justify-between md:h-18">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-base font-medium text-[--color-ink] transition-colors hover:text-[--color-accent] md:text-lg"
          aria-label={tSite('name')}
        >
          <Image
            src="/logo.webp"
            alt={tSite('name')}
            width={140}
            height={48}
            priority
            sizes="(min-width: 768px) 56px, 40px"
            className="h-10 w-auto md:h-14"
          />
          <span className="hidden leading-tight md:inline">
            {tSite('name')}
          </span>
          <span className="md:hidden">{tSite('shortName')}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label={t('home')}>
          <Link href="/#poslugy" className="text-sm uppercase tracking-wider text-[--color-ink-soft] hover:text-[--color-accent]">
            {t('services')}
          </Link>
          <Link href="/tsiny/" className="text-sm uppercase tracking-wider text-[--color-ink-soft] hover:text-[--color-accent]">
            {t('prices')}
          </Link>
          <Link href="/tovary/" className="text-sm uppercase tracking-wider text-[--color-ink-soft] hover:text-[--color-accent]">
            {t('products')}
          </Link>
          <Link href="/poradnyk/" className="text-sm uppercase tracking-wider text-[--color-ink-soft] hover:text-[--color-accent]">
            {t('guide')}
          </Link>
          <Link href="/kontakty/" className="text-sm uppercase tracking-wider text-[--color-ink-soft] hover:text-[--color-accent]">
            {t('contacts')}
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <PhoneLink source="header" variant="compact" className="hidden sm:inline-flex" />
          <span className="hidden lg:inline-flex">
            <LanguageSwitcher />
          </span>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
