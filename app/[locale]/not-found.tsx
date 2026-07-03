import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Phone, Home, Search } from 'lucide-react';
import { SITE } from '@/lib/utils';

export default function LocaleNotFound() {
  const t = useTranslations('nav');

  return (
    <section className="hero-gradient">
      <div className="container-content py-16 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-7xl text-[--color-accent] md:text-9xl">404</p>
          <div className="divider-gold mx-auto mt-6 max-w-[80px]" />

          <h1 className="mt-8">Сторінку не знайдено</h1>
          <p className="mt-6 text-lg text-[--color-ink-soft]">
            Можливо, посилання застаріло або сторінку видалено. Скористайтеся навігацією
            нижче, щоб знайти потрібне.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-[--color-accent]/50 bg-[--color-accent-100] px-5 py-3 font-semibold text-[--color-accent] transition-all hover:border-[--color-accent] hover:bg-[--color-accent] hover:text-[--color-bg]"
            >
              <Home className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden />
              {t('home')}
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="group inline-flex items-center gap-2 rounded-full bg-[--color-emergency] px-5 py-3 font-semibold text-white shadow-md transition-all hover:opacity-90"
            >
              <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden />
              {SITE.phoneDisplay}
            </a>
          </div>

          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-ink-muted]">
              <Search className="mb-1 mr-1 inline h-3.5 w-3.5" aria-hidden /> Корисні сторінки
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <li><Link href="/poslugy/" className="text-[--color-accent] hover:text-[--color-accent-700]">{t('services')}</Link></li>
              <li><Link href="/tsiny/" className="text-[--color-accent] hover:text-[--color-accent-700]">{t('prices')}</Link></li>
              <li><Link href="/poradnyk/" className="text-[--color-accent] hover:text-[--color-accent-700]">{t('guide')}</Link></li>
              <li><Link href="/tovary/" className="text-[--color-accent] hover:text-[--color-accent-700]">{t('products')}</Link></li>
              <li><Link href="/kontakty/" className="text-[--color-accent] hover:text-[--color-accent-700]">{t('contacts')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
