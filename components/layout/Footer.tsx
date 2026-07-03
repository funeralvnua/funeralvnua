import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PhoneLink } from './PhoneLink';
import { SITE } from '@/lib/utils';

export function Footer() {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const tSite = useTranslations('site');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[--color-border] bg-[--color-surface]">
      <div className="container-content py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <p className="font-heading text-2xl text-[--color-ink]">{tSite('name')}</p>
            <div className="divider-gold mt-4 max-w-[60px]" />
            <p className="mt-4 text-sm text-[--color-ink-soft]">{tSite('description')}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[--color-accent]">
              {t('services')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/poslugy/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{t('services')}</Link></li>
              <li><Link href="/tsiny/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{t('prices')}</Link></li>
              <li><Link href="/tovary/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{t('products')}</Link></li>
              <li><Link href="/poradnyk/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{t('guide')}</Link></li>
              <li><Link href="/blog/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{t('blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[--color-accent]">
              {t('contacts')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {SITE.addresses.map((a) => (
                <li key={a.street} className="text-[--color-ink-soft]">{a.street}</li>
              ))}
            </ul>
            <PhoneLink source="footer" className="mt-4" />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[--color-accent]">
              {t('about')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/pro-nas/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{t('about')}</Link></li>
              <li><Link href="/polityka-konfidentsiynosti/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{tFooter('privacy')}</Link></li>
              <li><Link href="/oferta/" className="text-[--color-ink-soft] transition-colors hover:text-[--color-ink]">{tFooter('offer')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[--color-border-soft] pt-6 text-center text-xs text-[--color-ink-muted]">
          {tFooter('copyright', { year })}
        </div>
      </div>
    </footer>
  );
}
