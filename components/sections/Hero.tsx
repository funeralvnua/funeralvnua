import { useTranslations } from 'next-intl';
import { CallbackForm } from './CallbackForm';
import { SITE } from '@/lib/utils';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="hero-editorial">
      <div className="container-content grid gap-10 py-16 md:gap-16 md:py-24 md:[grid-template-columns:1.35fr_1px_1fr] md:items-start">
        {/* LEFT — editorial copy */}
        <div>
          <span className="hero-editorial-eyebrow">
            <span className="dot" aria-hidden />
            {t('eyebrow')}
            <span className="line" aria-hidden />
          </span>

          <h1 className="hero-editorial-h1 mt-7 md:mt-8">
            {t('h1Main')}
            <br />
            <span>{t('h1Em')}</span>
          </h1>

          <div className="hero-editorial-emdash mt-8 md:mt-9" aria-hidden />

          <p className="hero-editorial-lede mt-6 md:mt-7">
            {t.rich('lede', {
              em: (chunks) => <em>{chunks}</em>,
            })}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-[rgba(201,165,96,0.15)] pt-7 md:mt-12 md:gap-7">
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-[var(--eda-ink-faint,#8a7f6e)]">
              {t('ctaLabel')}
            </div>
            <a
              href={`tel:${SITE.phone}`}
              className="hero-editorial-cta-phone"
              aria-label={`${t('ctaLabel')} — ${SITE.phoneDisplay}`}
            >
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* RULE — vertical gold hairline */}
        <div
          className="hero-editorial-rule hidden md:block md:h-full md:w-px md:self-stretch"
          aria-hidden
        />

        {/* RIGHT — editorial form */}
        <div>
          <CallbackForm source="hero" />
        </div>
      </div>
    </section>
  );
}
